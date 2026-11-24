import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { vi } from 'vitest'

import {
  calculateNextVersion,
  detectBump,
  detectCommitBump,
  getCommitsSinceTag,
  getLatestTag,
  readPackageVersion,
  execShellScript,
  resolveGitBinary,
  resolveReleaseTag,
  resolveShellForScripts,
  runCli
} from '../../scripts/detect-bump.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../..')
const gitBin = resolveGitBinary()

function initTempGitRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'detect-bump-test-'))
  execFileSync(gitBin, ['init', '-b', 'main'], { cwd: dir, stdio: 'ignore' })
  execFileSync(gitBin, ['config', 'user.name', 'Test User'], {
    cwd: dir,
    stdio: 'ignore'
  })
  execFileSync(gitBin, ['config', 'user.email', 'test@example.com'], {
    cwd: dir,
    stdio: 'ignore'
  })
  execFileSync(gitBin, ['config', 'commit.gpgsign', 'false'], {
    cwd: dir,
    stdio: 'ignore'
  })
  execFileSync(gitBin, ['config', 'tag.gpgsign', 'false'], {
    cwd: dir,
    stdio: 'ignore'
  })
  return dir
}

function makeCommit(cwd, message) {
  execFileSync(gitBin, ['commit', '--allow-empty', '-m', message], {
    cwd,
    stdio: 'ignore'
  })
}

function createBufferStdout() {
  let output = ''
  return {
    stream: {
      write(chunk) {
        output += chunk
      }
    },
    read: () => output
  }
}

describe('detect-bump script', () => {
  const tempDirs = []

  const trackTempDir = (dir) => {
    tempDirs.push(dir)
    return dir
  }

  afterEach(() => {
    vi.restoreAllMocks()
    while (tempDirs.length > 0) {
      fs.rmSync(tempDirs.pop(), { recursive: true, force: true })
    }
  })

  describe('detectCommitBump', () => {
    test.each([
      ['', 'none'],
      [null, 'none'],
      [undefined, 'none'],
      [123, 'none'],
      ['wip commit without prefix', 'none'],
      ['docs: update README', 'none'],
      ['chore(deps): update vitest', 'none'],
      ['fix: correct typo', 'patch'],
      ['fix(subnavigation): adjust focus border', 'patch'],
      ['perf: speed up helper', 'patch'],
      ['content: update label copy', 'patch'],
      ['style: align header link', 'patch'],
      ['refactor(search): simplify hidden fields', 'patch'],
      ['security: patch dependency', 'patch'],
      ['docs: note update\n\nbump: patch', 'patch'],
      ['feat: add tabs list component', 'minor'],
      ['feat(header): support custom slot', 'minor'],
      ['docs: major guide\r\n\r\nbump: minor', 'minor'],
      ['feat!: drop legacy app prefix', 'major'],
      ['fix(api)!: change signature', 'major'],
      ['feat: change API\n\nBREAKING CHANGE: renamed macro', 'major'],
      ['refactor: rename dir\n\nBREAKING-CHANGE: path changed', 'major'],
      ['chore: release prep\n\nbump: major', 'major']
    ])('classifies %j as %s', (message, expected) => {
      expect(detectCommitBump(message)).toBe(expected)
    })
  })

  describe('detectBump', () => {
    test('returns none for empty commit list', () => {
      expect(detectBump([])).toBe('none')
    })

    test('picks highest precedence bump regardless of order', () => {
      expect(detectBump(['docs: x', 'fix: y', 'feat: z'])).toBe('minor')
      expect(detectBump(['feat!: break', 'fix: y', 'feat: z'])).toBe('major')
      expect(detectBump(['fix: a', 'chore: b'])).toBe('patch')
    })
  })

  describe('calculateNextVersion', () => {
    test('returns null when bump is none', () => {
      expect(calculateNextVersion('1.2.3', 'none')).toBeNull()
    })

    test.each([
      ['0.1.0', 'patch', '0.1.1'],
      ['0.1.0', 'minor', '0.2.0'],
      ['0.1.0', 'major', '1.0.0'],
      ['v1.4.9', 'minor', '1.5.0']
    ])('bumps %s (%s) to %s', (current, bump, expected) => {
      expect(calculateNextVersion(current, bump)).toBe(expected)
    })

    test('throws for invalid semantic version', () => {
      expect(() => calculateNextVersion('invalid', 'patch')).toThrow(
        'Invalid semantic version'
      )
      expect(() => calculateNextVersion(null, 'patch')).toThrow(
        'Invalid semantic version'
      )
    })

    test('throws for invalid bump type', () => {
      expect(() => calculateNextVersion('1.2.3', 'unknown')).toThrow(
        'Invalid bump type'
      )
    })
  })

  describe('git and package helpers', () => {
    test('handles empty git repo without commits or tags', () => {
      const dir = trackTempDir(initTempGitRepo())

      expect(getLatestTag(dir)).toBeNull()
      expect(getCommitsSinceTag(null, dir)).toEqual([])
      expect(readPackageVersion(dir)).toBe('0.0.0')
    })

    test('reads package.json version and handles missing version field', () => {
      const dir = trackTempDir(fs.mkdtempSync(path.join(os.tmpdir(), 'pkg-')))
      fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({}))
      expect(readPackageVersion(dir)).toBe('0.0.0')
      expect(resolveReleaseTag(dir)).toBe('v0.0.0')

      fs.writeFileSync(
        path.join(dir, 'package.json'),
        JSON.stringify({ version: '2.3.4' })
      )
      expect(readPackageVersion(dir)).toBe('2.3.4')
      expect(resolveReleaseTag(dir)).toBe('v2.3.4')
      expect(typeof readPackageVersion()).toBe('string')
    })

    test('finds latest semver tag and commits since tag', () => {
      const dir = trackTempDir(initTempGitRepo())
      fs.writeFileSync(
        path.join(dir, 'package.json'),
        JSON.stringify({ version: '0.0.1' })
      )
      makeCommit(dir, 'chore: initial commit')
      execFileSync(gitBin, ['tag', 'v0.1.0'], { cwd: dir, stdio: 'ignore' })
      makeCommit(dir, 'feat: add component')
      makeCommit(dir, 'fix: tidy padding')

      expect(getLatestTag(dir)).toBe('v0.1.0')
      expect(resolveReleaseTag(dir)).toBe('v0.1.0')
      expect(getCommitsSinceTag('v0.1.0', dir)).toEqual([
        'fix: tidy padding',
        'feat: add component'
      ])
      expect(getCommitsSinceTag(null, dir)).toHaveLength(3)
    })

    test('resolves git binary from PATH and falls back when missing', () => {
      expect(path.basename(resolveGitBinary())).toBe('git')
      expect(resolveGitBinary('')).toBe('git')
      expect(resolveGitBinary('/nonexistent-bin-dir')).toBe('git')
    })

    test('resolves shell for scripts and can run generate-release-notes.sh', () => {
      const shell = resolveShellForScripts()
      if (process.platform === 'win32') {
        expect(shell.toLowerCase()).toMatch(/bash\.exe$/)
      } else {
        expect(path.basename(shell)).toBe('sh')
      }

      const output = execShellScript(
        path.join(repoRoot, 'scripts/generate-release-notes.sh'),
        ['--preview'],
        { cwd: repoRoot, encoding: 'utf8' }
      )
      expect(output).toContain(
        'Release notes for Waste Regulator Components Frontend'
      )

      const tempDir = trackTempDir(
        fs.mkdtempSync(path.join(os.tmpdir(), 'shell-exec-'))
      )
      const scriptFile = path.join(tempDir, 'echo.sh')
      fs.writeFileSync(scriptFile, '#!/bin/sh\necho "$1"\n')

      expect(() => execShellScript(scriptFile)).not.toThrow()
      expect(
        execShellScript(scriptFile, ['ok'], {
          encoding: 'utf8',
          env: process.env
        }).trim()
      ).toBe('ok')
    })

    test('resolveShellForScripts resolves sh from PATH and falls back off Windows', () => {
      const platformSpy = vi
        .spyOn(process, 'platform', 'get')
        .mockReturnValue('linux')
      const tempBinDir = trackTempDir(
        fs.mkdtempSync(path.join(os.tmpdir(), 'sh-bin-'))
      )
      const shPath = path.join(tempBinDir, 'sh')
      fs.writeFileSync(shPath, '#!/bin/sh\n')
      fs.chmodSync(shPath, 0o755)

      try {
        expect(resolveShellForScripts(tempBinDir)).toBe(shPath)
        expect(resolveShellForScripts('')).toBe('sh')
        expect(resolveShellForScripts('/nonexistent-bin-dir')).toBe('sh')
      } finally {
        platformSpy.mockRestore()
      }
    })

    test('resolveShellForScripts resolves Git Bash on Windows and falls back when missing', () => {
      const platformSpy = vi
        .spyOn(process, 'platform', 'get')
        .mockReturnValue('win32')
      const previousProgramFiles = process.env.ProgramFiles
      const previousProgramFilesX86 = process.env['ProgramFiles(x86)']

      const createFakeBash = (baseDir, ...segments) => {
        const target = path.join(baseDir, ...segments)
        fs.mkdirSync(path.dirname(target), { recursive: true })
        fs.writeFileSync(target, '')
        fs.chmodSync(target, 0o755)
        return target
      }

      const programFilesDir = trackTempDir(
        fs.mkdtempSync(path.join(os.tmpdir(), 'pf-'))
      )
      const programFilesX86Dir = trackTempDir(
        fs.mkdtempSync(path.join(os.tmpdir(), 'pf86-'))
      )
      const pathBinDir = trackTempDir(
        fs.mkdtempSync(path.join(os.tmpdir(), 'bash-path-'))
      )
      const emptyDir = trackTempDir(
        fs.mkdtempSync(path.join(os.tmpdir(), 'empty-'))
      )

      const pfBash = createFakeBash(programFilesDir, 'Git', 'bin', 'bash.exe')
      const pf86Bash = createFakeBash(
        programFilesX86Dir,
        'Git',
        'bin',
        'bash.exe'
      )
      const pathBash = createFakeBash(pathBinDir, 'bash.exe')

      try {
        process.env.ProgramFiles = programFilesDir
        delete process.env['ProgramFiles(x86)']
        expect(resolveShellForScripts(emptyDir)).toBe(pfBash)

        process.env.ProgramFiles = emptyDir
        process.env['ProgramFiles(x86)'] = programFilesX86Dir
        expect(resolveShellForScripts(emptyDir)).toBe(pf86Bash)

        delete process.env.ProgramFiles
        delete process.env['ProgramFiles(x86)']
        expect(resolveShellForScripts(pathBinDir)).toBe(pathBash)
        expect(resolveShellForScripts(emptyDir)).toBe('bash.exe')
        expect(resolveShellForScripts('')).toBe('bash.exe')
      } finally {
        platformSpy.mockRestore()
        if (previousProgramFiles === undefined) {
          delete process.env.ProgramFiles
        } else {
          process.env.ProgramFiles = previousProgramFiles
        }
        if (previousProgramFilesX86 === undefined) {
          delete process.env['ProgramFiles(x86)']
        } else {
          process.env['ProgramFiles(x86)'] = previousProgramFilesX86
        }
      }
    })

    test('supports default cwd parameters', () => {
      expect(() => getLatestTag()).not.toThrow()
      expect(Array.isArray(getCommitsSinceTag(null))).toBe(true)
      expect(resolveReleaseTag()).toMatch(/^v\d+\.\d+\.\d+$/)
    })
  })

  describe('runCli', () => {
    test('outputs --bump, --next-version, and JSON modes using package.json when untagged', () => {
      const dir = trackTempDir(initTempGitRepo())
      fs.writeFileSync(
        path.join(dir, 'package.json'),
        JSON.stringify({ version: '0.1.0' })
      )
      makeCommit(dir, 'feat: add search component')

      const bumpOut = createBufferStdout()
      runCli(['--bump'], { cwd: dir, stdout: bumpOut.stream })
      expect(bumpOut.read()).toBe('minor\n')

      const nextOut = createBufferStdout()
      runCli(['--next-version'], { cwd: dir, stdout: nextOut.stream })
      expect(nextOut.read()).toBe('v0.2.0\n')

      const jsonOut = createBufferStdout()
      const result = runCli([], { cwd: dir, stdout: jsonOut.stream })
      expect(JSON.parse(jsonOut.read())).toEqual({
        currentVersion: '0.1.0',
        bump: 'minor',
        nextVersion: 'v0.2.0'
      })
      expect(result).toEqual({
        currentVersion: '0.1.0',
        bump: 'minor',
        nextVersion: 'v0.2.0'
      })
    })

    test('uses latest tag and handles none bump cleanly', () => {
      const dir = trackTempDir(initTempGitRepo())
      makeCommit(dir, 'feat: baseline')
      execFileSync(gitBin, ['tag', 'v1.2.3'], { cwd: dir, stdio: 'ignore' })
      makeCommit(dir, 'docs: clarify setup')

      const nextOut = createBufferStdout()
      const result = runCli(['--next-version'], {
        cwd: dir,
        stdout: nextOut.stream
      })
      expect(nextOut.read()).toBe('')
      expect(result).toEqual({
        currentVersion: '1.2.3',
        bump: 'none',
        nextVersion: null
      })
    })

    test('uses default arguments cleanly', () => {
      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true)

      const result = runCli()
      expect(result).toHaveProperty('currentVersion')
      expect(result).toHaveProperty('bump')
      expect(result).toHaveProperty('nextVersion')
      expect(writeSpy).toHaveBeenCalled()
    })
  })
})
