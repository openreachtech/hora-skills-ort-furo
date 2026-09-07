#!/usr/bin/env node

/*
 * Find the system's own vocabulary reaching the screen.
 *
 * An application branches on keys — `pending`, `file`, `failed` — and shows people words. The two are not the
 * same, and the keys are always at hand at the moment a template is written, so they leak. What the user then
 * reads is a token from a database column: it is in the wrong language, it is not what anyone at the site
 * calls the thing, and it cannot be changed without changing behaviour.
 *
 * Two ways it happens, and both are checkable:
 *
 *   - A key literal placed in text. The value of an enumeration, printed.
 *   - Rendering `somethingName` where `somethingDisplayName` also exists. The API offers both precisely
 *     because one is for branching and one is for reading, and taking the first is a silent substitution of
 *     the wrong one.
 *
 * Values are only reported in text position. The same string used as a prop or compared against is the code
 * doing its job.
 *
 * Usage:
 *   node find-leaked-vocabulary.mjs [project-root]
 *
 * Exit codes:
 *   0  nothing internal reaches the screen
 *   1  at least one leak
 *   2  no enumerations and no display-name pairs found — nothing was checked
 */

import fs from 'node:fs'
import path from 'node:path'
import nodeProcess from 'node:process'

const PROJECT_PATH = path.resolve(nodeProcess.argv[2] ?? '.')

const TEMPLATE_DIRECTORY_NAMES = [
  'components',
  'layouts',
  'pages',
]

/*
 * Where enumeration-shaped constants are collected. Anything whose keys are upper snake case and whose values
 * are strings is treated as a set of internal keys.
 */
const CONSTANT_DIRECTORY_NAMES = [
  'constants',
  'app',
]

const SKIPPED_DIRECTORY_NAMES = new Set([
  'node_modules',
  '.nuxt',
  '.output',
  'tests',
])

const TEMPLATE_PATTERN = /<template>(?<body>[\s\S]*)<\/template>/u

const ENUM_ENTRY_PATTERN = /^\s{2}(?<key>[A-Z][A-Z0-9_]*)\s*:\s*'(?<value>[a-z][a-zA-Z0-9_]*)',?\s*$/gmu

/*
 * A mustache holding only a literal: `{{ 'pending' }}`.
 */
const LITERAL_MUSTACHE_PATTERN = /\{\{\s*'(?<value>[^']+)'\s*\}\}/gu

/*
 * A mustache reading a member: `{{ it.statusName }}`, `{{ context.resolveX() }}`.
 */
const MEMBER_MUSTACHE_PATTERN = /\{\{\s*(?<expression>[^}]+?)\s*\}\}/gu

const NAME_MEMBER_PATTERN = /\b(?<base>[a-z][A-Za-z0-9]*)Name\b/gu

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
    .filter(entryPath => !path.relative(directoryPath, entryPath)
      .split(path.sep)
      .some(segment => SKIPPED_DIRECTORY_NAMES.has(segment)))
    .filter(entryPath => entryPath.endsWith(extension))
}

/**
 * Read the text a template puts on screen, without the markup around it.
 *
 * @param {{
 *   templateBody: string
 * }} params - Parameters.
 * @returns {string} Text nodes, joined.
 */
function extractTextNodes ({
  templateBody,
}) {
  return templateBody
    .replace(/<!--[\s\S]*?-->/gu, ' ')
    /*
     * Expressions are not prose. A prop called `label` interpolated into the markup is the component doing its
     * job, and reading the inside of a mustache as text reports it as a leaked key. Literals inside a mustache
     * are covered by their own rule.
     */
    .replace(/\{\{[\s\S]*?\}\}/gu, ' ')
    .split(/<[^>]*>/u)
    .map(it => it.trim())
    .filter(it => it !== '')
}

const enumValues = new Set(
  CONSTANT_DIRECTORY_NAMES
    .flatMap(directoryName => collectFilePaths({
      directoryPath: path.join(PROJECT_PATH, directoryName),
      extension: '.js',
    }))
    .flatMap(filePath => [
      ...fs.readFileSync(filePath, 'utf8')
        .matchAll(ENUM_ENTRY_PATTERN),
    ])
    .map(matched => String(matched.groups?.value))
)

const templatePaths = TEMPLATE_DIRECTORY_NAMES
  .flatMap(directoryName => collectFilePaths({
    directoryPath: path.join(PROJECT_PATH, directoryName),
    extension: '.vue',
  }))

/*
 * The display-name half of a pair only counts as available if the project actually offers it somewhere.
 */
const projectSource = [
  ...CONSTANT_DIRECTORY_NAMES,
  ...TEMPLATE_DIRECTORY_NAMES,
  'app',
]
  .flatMap(directoryName => [
    ...collectFilePaths({
      directoryPath: path.join(PROJECT_PATH, directoryName),
      extension: '.js',
    }),
    ...collectFilePaths({
      directoryPath: path.join(PROJECT_PATH, directoryName),
      extension: '.vue',
    }),
  ])
  .map(filePath => fs.readFileSync(filePath, 'utf8'))
  .join('\n')

if (enumValues.size === 0 && templatePaths.length === 0) {
  console.log('NOT APPLICABLE: no enumeration-shaped constants and no templates found.')

  nodeProcess.exitCode = 2
} else {
  const findings = templatePaths
    .flatMap(templatePath => {
      const templateBody = fs.readFileSync(templatePath, 'utf8')
        .match(TEMPLATE_PATTERN)
        ?.groups
        ?.body
        ?? ''

      const textNodes = extractTextNodes({ templateBody })

      /*
       * The whole text node has to be the key, not a word inside a sentence. Enumeration values are ordinary
       * English words often enough — `label`, `file`, `text` — that matching them anywhere in prose reports
       * every screen that uses the word in a sentence.
       */
      const printedKeys = [
        ...new Set([
          ...textNodes
            .filter(textNode => enumValues.has(textNode)),
          ...[
            ...templateBody.matchAll(LITERAL_MUSTACHE_PATTERN),
          ]
            .map(matched => String(matched.groups?.value))
            .filter(value => enumValues.has(value)),
        ]),
      ]
        .map(value => `a key of the system, printed as text: '${value}'`)

      const shadowedNames = [
        ...new Set(
          [
            ...templateBody.matchAll(MEMBER_MUSTACHE_PATTERN),
          ]
            .flatMap(matched => [
              ...String(matched.groups?.expression)
                .matchAll(NAME_MEMBER_PATTERN),
            ])
            .map(matched => String(matched.groups?.base))
            .filter(base => projectSource.includes(`${base}DisplayName`))
        ),
      ]
        .map(base => `renders ${base}Name while ${base}DisplayName exists — the branching key shown instead of the word`)

      return [
        ...printedKeys,
        ...shadowedNames,
      ]
        .map(message => ({
          templatePath,
          message,
        }))
    })

  const report = findings
    .map(it => `  ${path.relative(PROJECT_PATH, it.templatePath)}\n    ${it.message}`)
    .join('\n')

  console.log(
    [
      report,
      `LEAKS: ${findings.length}   TEMPLATES: ${templatePaths.length}   KEYS KNOWN: ${enumValues.size}`,
    ]
      .filter(it => it !== '')
      .join('\n\n')
  )

  nodeProcess.exitCode = findings.length > 0
    ? 1
    : 0
}
