#!/usr/bin/env node

/*
 * Find screens that fetch data and cannot say all four things about it.
 *
 * Loading, empty, error, ready. A screen missing one of them does not fail — it shows the wrong thing. The
 * common case is a region with no empty state: nothing renders, and blank reads as broken rather than as "you
 * have none of these yet". The next most common is a failure rendered as empty, which tells the user there is
 * nothing here when the truth is that nobody could find out.
 *
 * Two rules, both narrow enough to be worth failing on:
 *
 *   - A screen that resolves its state must resolve to all four. Naming three of them means one branch of the
 *     screen was never written, and the resolver is where that is visible.
 *   - A screen that fetches must be able to say empty and say error. How it says them is its own business —
 *     a shared panel, its own markup, a message — so the check looks for any of those, not for one component.
 *
 * Usage:
 *   node find-missing-screen-states.mjs [project-root]
 *
 * Exit codes:
 *   0  every fetching screen can say all four
 *   1  at least one cannot
 *   2  no screens found in the expected layout — nothing was checked
 */

import fs from 'node:fs'
import path from 'node:path'
import nodeProcess from 'node:process'

const PROJECT_PATH = path.resolve(nodeProcess.argv[2] ?? '.')

const SCREEN_DIRECTORY_NAME = 'pages'

/*
 * The four states, by the words a project uses for them. Matched case-insensitively against the resolver's
 * body, so a constant, a string or an enumeration member all count.
 */
const STATE_WORDS = [
  'loading',
  'empty',
  'error',
  'ready',
]

/*
 * A screen fetches when it holds a client, a launcher or a fetcher. Matched on the role in the name, not on
 * any one project's composable: a wrapper may be called anything as long as it says what it wraps.
 */
const FETCHING_PATTERN = /Launcher|GraphqlClient|RestfulApiClient|Fetcher/u

/*
 * A screen lists when it repeats markup over something. Only a list can be empty: a form that submits has no
 * empty state to show, and asking it for one reports every sign-in screen ever written.
 */
const LISTING_PATTERN = /\bv-for\b/u

const STATE_RESOLVER_PATTERN = /(?<name>resolve\w*(?:Screen)?State)\s*\(\)\s*\{(?<body>[\s\S]*?)\n {2}\}/gu

/*
 * Any of these means the screen can say "there is nothing here". `EmptyState` matches the framework's own
 * component and anything wrapping it; a project whose shared component is named something else entirely has
 * to add that name here, and until it does this check under-reports rather than over-reports.
 */
const EMPTY_AFFORDANCE_PATTERN = /\bempty\b|\bEMPTY\b|hasNo[A-Z]|isEmpty|EmptyState/u

/*
 * Any of these means the screen can say "I could not find out". Same caveat as above.
 */
const ERROR_AFFORDANCE_PATTERN = /errorMessage|hasError|\bERROR\b|ErrorState/u

/**
 * Collect files with one extension, recursively.
 *
 * @param {{
 *   directoryPath: string
 *   extension: string
 * }} params - Parameters.
 * @returns {Array<string>} Absolute paths.
 */
function collectFilePaths ({
  directoryPath,
  extension,
}) {
  if (!fs.existsSync(directoryPath)) {
    return []
  }

  return fs.readdirSync(directoryPath, { recursive: true })
    .map(entryPath => path.join(directoryPath, String(entryPath)))
    .filter(entryPath => entryPath.endsWith(extension))
}

/**
 * Read every file that makes up one screen — the component and the modules beside it.
 *
 * A screen's logic lives in files next to it rather than inside the component, so reading the component alone
 * finds neither the resolver nor the fetch.
 *
 * @param {{
 *   screenPath: string
 * }} params - Parameters.
 * @returns {string} The screen's sources, joined.
 */
function readScreenSource ({
  screenPath,
}) {
  const directoryPath = path.dirname(screenPath)

  return [
    screenPath,
    ...fs.readdirSync(directoryPath)
      .map(entryName => path.join(directoryPath, entryName))
      .filter(entryPath => entryPath.endsWith('.js')),
  ]
    .map(filePath => fs.readFileSync(filePath, 'utf8'))
    .join('\n')
}

const screenPaths = collectFilePaths({
  directoryPath: path.join(PROJECT_PATH, SCREEN_DIRECTORY_NAME),
  extension: '.vue',
})

if (screenPaths.length === 0) {
  console.log(`NOT APPLICABLE: no .vue file under ${SCREEN_DIRECTORY_NAME}/.`)

  nodeProcess.exitCode = 2
} else {
  const checked = screenPaths
    .map(screenPath => {
      const source = readScreenSource({ screenPath })
      if (!FETCHING_PATTERN.test(source)) {
        return null
      }

      const resolvers = [
        ...source.matchAll(STATE_RESOLVER_PATTERN),
      ]

      const incompleteResolvers = resolvers
        .map(matched => ({
          name: String(matched.groups?.name),
          missingWords: STATE_WORDS
            .filter(word => !new RegExp(word, 'iu')
              .test(String(matched.groups?.body))),
        }))
        .filter(it => it.missingWords.length > 0)

      return {
        screenPath,
        hasResolver: resolvers.length > 0,
        incompleteResolvers,
        lacksEmpty: LISTING_PATTERN.test(source)
          && !EMPTY_AFFORDANCE_PATTERN.test(source),
        lacksError: !ERROR_AFFORDANCE_PATTERN.test(source),
      }
    })
    .filter(Boolean)

  const findings = checked
    .filter(it => it.incompleteResolvers.length > 0 || it.lacksEmpty || it.lacksError)

  const report = findings
    .map(it => [
      `  ${path.relative(PROJECT_PATH, it.screenPath)}`,
      ...it.incompleteResolvers
        .map(resolver => `    ${resolver.name}() never resolves to: ${resolver.missingWords.join(', ')}`),
      ...it.lacksEmpty
        ? ['    fetches, and nothing here says "there is nothing" — blank reads as broken']
        : [],
      ...it.lacksError
        ? ['    fetches, and nothing here says "I could not find out" — a failure will read as empty']
        : [],
    ]
      .join('\n'))
    .join('\n')

  console.log(
    [
      report,
      `INCOMPLETE SCREENS: ${findings.length}   FETCHING SCREENS: ${checked.length}`,
    ]
      .filter(it => it !== '')
      .join('\n\n')
  )

  nodeProcess.exitCode = findings.length > 0
    ? 1
    : 0
}
