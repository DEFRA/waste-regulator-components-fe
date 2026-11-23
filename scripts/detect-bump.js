import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const BUMP_ORDER = {
  none: 0,
  patch: 1,
  minor: 2,
  major: 3
}

const MAJOR_PATTERNS = [
  /^[a-z]+(?:\([^)]+\))?!:/,
  /(?:^|\n)BREAKING[ -]CHANGE:/,
  /(?:^|\n)bump:\s*major(?:\s|$)/i
]

const MINOR_PATTERNS = [
  /^feat(?:\([^)]+\))?:/,
  /(?:^|\n)bump:\s*minor(?:\s|$)/i
]

const PATCH_PATTERNS = [
  /^(?:fix|perf|content|style|refactor|security)(?:\([^)]+\))?:/,
  /(?:^|\n)bump:\s*patch(?:\s|$)/i
]

/**
 * Determine the semantic version bump implied by a single commit message.
 */
export function detectCommitBump(commitMessage) {
  if (!commitMessage || typeof commitMessage !== 'string') {
    return 'none'
  }

  const normalized = commitMessage.replaceAll('\r\n', '\n').trim()

  if (MAJOR_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return 'major'
  }

  if (MINOR_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return 'minor'
  }

  if (PATCH_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return 'patch'
  }

  return 'none'
}

/**
 * Determine the highest semantic version bump across a list of commit messages.
 */
export function detectBump(commits) {
  return commits.reduce((highest, message) => {
    const candidate = detectCommitBump(message)
    return BUMP_ORDER[candidate] > BUMP_ORDER[highest] ? candidate : highest
  }, 'none')
}

/**
 * Calculate the next semantic version string given the current version and bump level.
 */
export function calculateNextVersion(currentVersion, bump) {
  if (bump === 'none') {
    return null
  }

  const match =
    typeof currentVersion === 'string' &&
    currentVersion.trim().match(/^v?(\d+)\.(\d+)\.(\d+)$/)

  if (!match) {
    throw new Error(`Invalid semantic version: ${currentVersion}`)
  }

  const [major, minor, patch] = match.slice(1).map(Number)

  const calculators = {
    major: () => `${major + 1}.0.0`,
    minor: () => `${major}.${minor + 1}.0`,
    patch: () => `${major}.${minor}.${patch + 1}`
  }

  const calculator = calculators[bump]
  if (!calculator) {
    throw new Error(`Invalid bump type: ${bump}`)
  }

  return calculator()
}

function isExecutable(candidate) {
  try {
    fs.accessSync(candidate, fs.constants.X_OK)
    return true
  } catch {
    return false
  }
}

function findExecutableOnPath(binaryName, envPath) {
  if (!envPath) {
    return null
  }
  return (
    envPath
      .split(path.delimiter)
      .map((dir) => path.join(dir, binaryName))
      .find(isExecutable) ?? null
  )
}

/**
 * Resolve the git binary path from PATH to avoid POSIX spawn PATH permission errors in sandboxed environments.
 */
export function resolveGitBinary(envPath = process.env.PATH) {
  return findExecutableOnPath('git', envPath) ?? 'git'
}

/**
 * Shell used to run repository .sh scripts (Git Bash on Windows, POSIX sh elsewhere).
 */
export function resolveShellForScripts(envPath = process.env.PATH) {
  if (process.platform === 'win32') {
    const windowsCandidates = [
      process.env.ProgramFiles,
      process.env['ProgramFiles(x86)']
    ]
      .filter(Boolean)
      .map((baseDir) => path.join(baseDir, 'Git', 'bin', 'bash.exe'))

    return (
      windowsCandidates.find(isExecutable) ??
      findExecutableOnPath('bash.exe', envPath) ??
      'bash.exe'
    )
  }
  return findExecutableOnPath('sh', envPath) ?? 'sh'
}

/**
 * Run a shell script via sh/bash so tests work on Windows without a shebang executable.
 */
export function execShellScript(scriptPath, args = [], options = {}) {
  const shell = resolveShellForScripts(options.env?.PATH)
  return execFileSync(shell, [scriptPath, ...args], options)
}

/**
 * Retrieve the latest semantic version git tag (vX.Y.Z) or null when none exists.
 */
export function getLatestTag(cwd = process.cwd()) {
  try {
    return execFileSync(
      resolveGitBinary(),
      ['describe', '--tags', '--match', 'v[0-9]*.[0-9]*.[0-9]*', '--abbrev=0'],
      { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim()
  } catch {
    return null
  }
}

/**
 * Retrieve raw commit messages since a tag (or across HEAD history if tag is null).
 */
export function getCommitsSinceTag(tag, cwd = process.cwd()) {
  const range = tag ? `${tag}..HEAD` : 'HEAD'
  try {
    const raw = execFileSync(
      resolveGitBinary(),
      ['log', range, '--format=%B%x1e'],
      {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      }
    )
    return raw
      .split('\x1e')
      .map((entry) => entry.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

/**
 * Read the package version from package.json in cwd, defaulting to '0.0.0'.
 */
export function readPackageVersion(cwd = process.cwd()) {
  const pkgPath = path.join(cwd, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    return '0.0.0'
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  return pkg.version || '0.0.0'
}

/**
 * CLI entrypoint reporting bump level, next tag, or full JSON metadata.
 */
export function runCli(argv = process.argv.slice(2), options = {}) {
  const cwd = options.cwd || process.cwd()
  const stdout = options.stdout || process.stdout
  const latestTag = getLatestTag(cwd)
  const currentVersion = latestTag
    ? latestTag.replace(/^v/, '')
    : readPackageVersion(cwd)
  const commits = getCommitsSinceTag(latestTag, cwd)
  const bump = detectBump(commits)
  const next = calculateNextVersion(currentVersion, bump)
  const nextVersion = next ? `v${next}` : null

  if (argv.includes('--bump')) {
    stdout.write(`${bump}\n`)
  } else if (argv.includes('--next-version')) {
    stdout.write(nextVersion ? `${nextVersion}\n` : '')
  } else {
    stdout.write(`${JSON.stringify({ currentVersion, bump, nextVersion })}\n`)
  }

  return { currentVersion, bump, nextVersion }
}

/* v8 ignore start */
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  runCli()
}
/* v8 ignore stop */
