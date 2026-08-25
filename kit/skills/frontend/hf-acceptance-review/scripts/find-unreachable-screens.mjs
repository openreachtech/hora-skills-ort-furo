#!/usr/bin/env node

/*
 * Find screens that exist and that nothing navigates to.
 *
 * A screen can be complete, correct and tested while being reachable only by typing its address. Every
 * capability on it is then unreachable in practice, and no other check notices: the route resolves, the page
 * renders, the tests pass.
 *
 * A path counts as referenced when its literal appears anywhere outside the screen's own directory — which
 * covers a link written inline and a route constant collected in one place, without needing to know which
 * convention a project uses. Dynamic segments are stripped first, because a screen taking an id is navigated
 * to by building its path from the base.
 *
 * Screens a user arrives at without being sent — the entry point and the sign-in screen — will appear here
 * unless something else mentions them. Record those as accepted in the project declaration rather than
 * teaching this script which paths are special: which screens are entrances is a fact about the product.
 *
 * Usage:
 *   node find-unreachable-screens.mjs [project-root]
 *
 * Exit codes:
 *   0  every screen is navigated to from somewhere
 *   1  at least one is not
 *   2  no screen directory in the expected layout — nothing was checked
 */

import fs from 'node:fs'
import path from 'node:path'
import nodeProcess from 'node:process'

const PROJECT_PATH = path.resolve(nodeProcess.argv[2] ?? '.')

const SCREEN_DIRECTORY_NAME = 'pages'

/*
 * Everywhere a path could be written down. Route paths are usually collected into one constants file rather
 * than repeated at each link, so a list of the directories that hold screens and components misses every
 * reference and reports the whole application as unreachable. Scan the project and skip what is generated,
 * vendored, or a test.
 */
const SKIPPED_DIRECTORY_NAMES = new Set([
  'node_modules',
  'tests',
  'test',
  '.nuxt',
  '.output',
  '.git',
  'dist',
  'coverage',
  'ai',
])

const SCANNED_EXTENSIONS = [
  '.vue',
  '.js',
]

/*
 * Route segments that stand for a value rather than a name: `[id]`, `[[id]]`, `[...all]`, `:id`.
 */
const DYNAMIC_SEGMENT_PATTERN = /^(?:\[+.*\]+|:.*)$/u

/**
 * Collect files with any of the scanned extensions, recursively.
 *
 * @param {{
 *   directoryPath: string
 * }} params - Parameters.
 * @returns {Array<string>} Absolute paths.
 */
function collectFilePaths ({
  directoryPath,
}) {
  if (!fs.existsSync(directoryPath)) {
    return []
  }

  return fs.readdirSync(directoryPath, { recursive: true })
    .map(entryPath => path.join(directoryPath, String(entryPath)))
    .filter(entryPath => !path.relative(directoryPath, entryPath)
      .split(path.sep)
      .some(segment => SKIPPED_DIRECTORY_NAMES.has(segment)))
    .filter(entryPath => SCANNED_EXTENSIONS
      .some(extension => entryPath.endsWith(extension)))
}

/**
 * Turn a screen file into the path a user would be sent to.
 *
 * @param {{
 *   screenPath: string
 * }} params - Parameters.
 * @returns {string} Route path, without any dynamic segment.
 */
function composeRoutePath ({
  screenPath,
}) {
  const relativePath = path.relative(path.join(PROJECT_PATH, SCREEN_DIRECTORY_NAME), screenPath)

  const segments = relativePath
    .replace(/\.vue$/u, '')
    .split(path.sep)
    .filter(segment => segment !== 'index')
    .filter(segment => !DYNAMIC_SEGMENT_PATTERN.test(segment))

  return `/${segments.join('/')}`
}

const screenPaths = collectFilePaths({
  directoryPath: path.join(PROJECT_PATH, SCREEN_DIRECTORY_NAME),
})
  .filter(screenPath => screenPath.endsWith('.vue'))

if (screenPaths.length === 0) {
  console.log(`NOT APPLICABLE: no .vue file under ${SCREEN_DIRECTORY_NAME}/.`)

  nodeProcess.exitCode = 2
} else {
  const referrers = collectFilePaths({
    directoryPath: PROJECT_PATH,
  })
    .map(filePath => ({
      filePath,
      source: fs.readFileSync(filePath, 'utf8'),
    }))

  const findings = screenPaths
    .map(screenPath => ({
      screenPath,
      routePath: composeRoutePath({ screenPath }),
    }))
    .filter(it => it.routePath !== '/')
    .filter(it => !referrers
      .filter(referrer => !referrer.filePath.startsWith(path.dirname(it.screenPath)))
      .some(referrer => referrer.source.includes(`'${it.routePath}'`)
        || referrer.source.includes(`"${it.routePath}"`)
        || referrer.source.includes(`${it.routePath}'`)))

  const report = findings
    .map(it => [
      `  ${path.relative(PROJECT_PATH, it.screenPath)}`,
      `    ${it.routePath} — nothing outside this screen mentions the path`,
      '    reachable only by typing the address, so every capability on it is unreachable in practice',
    ]
      .join('\n'))
    .join('\n')

  console.log(
    [
      report,
      `UNREACHABLE SCREENS: ${findings.length}   SCREENS: ${screenPaths.length}`,
    ]
      .filter(it => it !== '')
      .join('\n\n')
  )

  nodeProcess.exitCode = findings.length > 0
    ? 1
    : 0
}
