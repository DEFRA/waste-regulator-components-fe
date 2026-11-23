import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { execShellScript, resolveGitBinary } from '../../scripts/detect-bump.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../..')
const scriptPath = path.join(repoRoot, 'scripts/generate-release-notes.sh')
const gitBin = resolveGitBinary()

function createRepoWithSampleCommits() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-cliff-test-'))
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

  const commit = (message) => {
    execFileSync(gitBin, ['commit', '--allow-empty', '-m', message], {
      cwd: dir,
      stdio: 'ignore'
    })
  }

  commit('chore: initial release')
  execFileSync(gitBin, ['tag', 'v0.1.0'], { cwd: dir, stdio: 'ignore' })

  commit(
    'feat(tabs): add tabs list\n\nFixes https://eaflood.atlassian.net/browse/AMCR-678'
  )
  commit(
    'fix: resolve subnav styling\n\nhttps://eaflood.atlassian.net/browse/AMCR-679'
  )
  commit('feat!: rename wrc prefix')
  commit('wip stuff without conventional prefix or ticket')

  return dir
}

describe('git-cliff release notes configuration', () => {
  const tempDirs = []

  afterEach(() => {
    while (tempDirs.length > 0) {
      fs.rmSync(tempDirs.pop(), { recursive: true, force: true })
    }
  })

  test('renders ordered groups, breaking markers, and ticket summaries in preview mode', () => {
    const dir = createRepoWithSampleCommits()
    tempDirs.push(dir)

    const output = execShellScript(scriptPath, ['--preview'], {
      cwd: dir,
      encoding: 'utf8'
    })

    const featuresIndex = output.indexOf('## 🚀 Features')
    const fixesIndex = output.indexOf('## 🐛 Bug Fixes')
    expect(featuresIndex).toBeGreaterThan(-1)
    expect(fixesIndex).toBeGreaterThan(featuresIndex)

    expect(output).toContain('Unreleased changes since [v0.1.0]')
    expect(output).toContain(
      '*(tabs)* Add tabs list https://eaflood.atlassian.net/browse/AMCR-678'
    )
    expect(output).toContain('[**breaking**] Rename wrc prefix')
    expect(output).toContain(
      'Resolve subnav styling https://eaflood.atlassian.net/browse/AMCR-679'
    )
    expect(output).not.toContain(
      'wip stuff without conventional prefix or ticket'
    )

    const completedSection = output
      .split('## ✅ Completed Tickets')[1]
      .split('## 🎫 Related Tickets')[0]
    const relatedSection = output.split('## 🎫 Related Tickets')[1]
    expect(completedSection).toContain(
      'https://eaflood.atlassian.net/browse/AMCR-678'
    )
    expect(completedSection).not.toContain('AMCR-679')
    expect(relatedSection).toContain(
      'https://eaflood.atlassian.net/browse/AMCR-679'
    )
    expect(relatedSection).not.toContain('AMCR-678')
  })

  test('renders versioned heading with --tag mode and latest release notes', () => {
    const dir = createRepoWithSampleCommits()
    tempDirs.push(dir)

    const taggedOutput = execShellScript(scriptPath, ['--tag', 'v1.0.0'], {
      cwd: dir,
      encoding: 'utf8'
    })
    expect(taggedOutput).toContain(
      '# Release notes for Waste Regulator Components Frontend'
    )
    expect(taggedOutput).toContain('## [1.0.0] - ')
    expect(taggedOutput).not.toContain('Unreleased changes since')
    expect(taggedOutput).toContain('## 🚀 Features')

    execFileSync(gitBin, ['tag', 'v1.0.0'], { cwd: dir, stdio: 'ignore' })
    const latestOutput = execShellScript(scriptPath, [], {
      cwd: dir,
      encoding: 'utf8'
    })
    expect(latestOutput).toContain('## [1.0.0] - ')
    expect(latestOutput).toContain('Add tabs list')
  })
})
