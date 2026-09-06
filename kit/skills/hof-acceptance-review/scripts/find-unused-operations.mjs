#!/usr/bin/env node

/*
 * Find operations the app can perform that no screen ever calls.
 *
 * What the API layer exposes is the contract of what the product can do, and it is machine-readable. So a
 * missing feature does not have to be noticed by someone: it shows up as a difference — an operation with a
 * client built for it and nothing importing that client. A requirement can be fully implemented on both
 * sides and still be unreachable, and nothing else in the toolchain reports that.
 *
 * Deliberate absences are read from the project declaration, so an operation kept out of the UI on purpose
 * is not reported. Those exclusions are checked in the other direction too: one that no longer describes
 * anything is reported, because an exception that has quietly stopped applying reads as a reviewed decision
 * while permitting the very gap this looks for.
 *
 * Usage:
 *   node find-unused-operations.mjs [project-root]
 *
 * Exit codes:
 *   0  every operation is reached, or excluded on purpose
 *   1  at least one is unreached, or an exclusion has gone stale
 *   2  no operation clients found in the expected layout — nothing was checked
 */

import fs from 'node:fs'
import path from 'node:path'
import nodeProcess from 'node:process'

const PROJECT_PATH = path.resolve(nodeProcess.argv[2] ?? '.')

/*
 * Where operation clients live, and where a screen would refer to one. Both are conventions of the
 * application layout rather than of any library, so they are stated here and nowhere else in this script.
 */
const CLIENT_DIRECTORY_NAMES = [
  path.join('app', 'graphql', 'client'),
  path.join('app', 'restfulapi'),
]

/*
 * Everything that could hold a call site. `app/` is included whole — a client is often reached through a
 * module rather than from a screen directly, and leaving those out reports a reachable operation as
 * unreachable. The client directories themselves are then skipped, or every operation would find its own
 * name in its own file.
 */
const CONSUMER_DIRECTORY_NAMES = [
  'app',
  'pages',
  'components',
  'composables',
  'layouts',
  'middleware',
  'plugins',
  'stores',
]

const LAUNCHER_FILE_SUFFIX = 'Launcher.js'

const DECLARATION_PATH = path.join('ai', 'contexts', 'acceptance-context.md')

/*
 * A line of the declaration's exclusion table: `| OperationLauncherName | reason |`.
 */
const EXCLUSION_ROW_PATTERN = /^\|\s*(?<name>[A-Za-z0-9_]+)\s*\|\s*(?<reason>[^|]+?)\s*\|/gmu

/**
 * Collect files with one suffix, recursively.
 *
 * @param {{
 *   directoryPath: string
 *   suffix: string
 * }} params - Parameters.
 * @returns {Array<string>} Absolute paths.
 */
function collectFilePaths ({
  directoryPath,
  suffix,
}) {
  if (!fs.existsSync(directoryPath)) {
    return []
  }

  return fs.readdirSync(directoryPath, { recursive: true })
    .map(entryPath => path.join(directoryPath, String(entryPath)))
    .filter(entryPath => entryPath.endsWith(suffix))
}

/**
 * Read the source of every file a screen could be written in.
 *
 * @returns {string} Every consumer file concatenated.
 */
function readConsumerSource () {
  return CONSUMER_DIRECTORY_NAMES
    .flatMap(directoryName => [
      ...collectFilePaths({
        directoryPath: path.join(PROJECT_PATH, directoryName),
        suffix: '.vue',
      }),
      ...collectFilePaths({
        directoryPath: path.join(PROJECT_PATH, directoryName),
        suffix: '.js',
      }),
    ])
    .filter(filePath => !CLIENT_DIRECTORY_NAMES
      .some(clientDirectory => filePath.includes(path.join(PROJECT_PATH, clientDirectory))))
    .map(filePath => fs.readFileSync(filePath, 'utf8'))
    .join('\n')
}

/**
 * Read the operations the project declares as deliberately absent from the UI.
 *
 * @returns {Array<{ name: string, reason: string }>} Declared exclusions.
 */
function readExclusions () {
  const declarationPath = path.join(PROJECT_PATH, DECLARATION_PATH)
  if (!fs.existsSync(declarationPath)) {
    return []
  }

  return [
    ...fs.readFileSync(declarationPath, 'utf8')
      .matchAll(EXCLUSION_ROW_PATTERN),
  ]
    .map(matched => ({
      name: String(matched.groups?.name),
      reason: String(matched.groups?.reason),
    }))
    .filter(it => it.name.endsWith(LAUNCHER_FILE_SUFFIX.replace('.js', '')))
}

/*
 * One operation is a directory holding a trio of classes, and a call site may reach it through any of them —
 * an upload that drives the request itself still imports the payload for its URL and credential. So the unit
 * of reachability is the operation, and any of its class names counts as reaching it. Naming the launcher
 * alone reported a reachable upload as unreachable.
 */
const operations = CLIENT_DIRECTORY_NAMES
  .flatMap(directoryName => collectFilePaths({
    directoryPath: path.join(PROJECT_PATH, directoryName),
    suffix: LAUNCHER_FILE_SUFFIX,
  }))
  .map(filePath => path.basename(filePath, '.js'))
  .filter(name => !name.startsWith('Base'))
  .map(launcherName => ({
    name: launcherName,
    classNames: [
      launcherName,
      launcherName.replace('Launcher', 'Payload'),
      launcherName.replace('Launcher', 'Capsule'),
    ],
  }))

const launcherNames = operations.map(it => it.name)

if (launcherNames.length === 0) {
  console.log(`NOT APPLICABLE: no *${LAUNCHER_FILE_SUFFIX} found under ${CLIENT_DIRECTORY_NAMES.join(' or ')}.`)

  nodeProcess.exitCode = 2
} else {
  const consumerSource = readConsumerSource()
  const exclusions = readExclusions()
  const excludedNames = new Set(
    exclusions.map(it => it.name)
  )

  const unreached = operations
    .filter(operation => !operation.classNames
      .some(className => consumerSource.includes(className)))
    .map(operation => operation.name)

  const unexpected = unreached
    .filter(name => !excludedNames.has(name))

  const stale = exclusions
    .filter(it => !unreached.includes(it.name))

  const report = [
    ...unexpected
      .map(name => `  ${name}\n    built, and no screen imports it — the capability has no way in`),
    ...stale
      .map(it => `  ${it.name}\n    exclusion no longer applies; delete it from the declaration`),
  ]
    .join('\n')

  console.log(
    [
      report,
      `UNREACHED OPERATIONS: ${unexpected.length}   EXCLUDED: ${excludedNames.size - stale.length}   STALE: ${stale.length}   OPERATIONS: ${launcherNames.length}`,
    ]
      .filter(it => it !== '')
      .join('\n\n')
  )

  nodeProcess.exitCode = unexpected.length > 0 || stale.length > 0
    ? 1
    : 0
}
