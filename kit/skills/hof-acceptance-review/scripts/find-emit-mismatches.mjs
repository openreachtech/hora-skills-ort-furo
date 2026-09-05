#!/usr/bin/env node

/*
 * Find disagreements between the events a component declares, the events it emits, and the events its
 * framework registration knows about.
 *
 * Three separate mistakes hide in that triangle, and none of them stops a build:
 *
 *   - An event named in the declaration and never emitted. The listener a caller writes for it can never
 *     fire, and the caller has no way to tell that from a listener that simply has not been triggered yet.
 *   - An event emitted as a bare string rather than through the declaration. It works, and it is invisible to
 *     every check that reads the declaration — including the dead-affordance check.
 *   - An event declared on the context but missing from the component's own `emits` registration. Vue then
 *     treats a caller's listener as a native DOM listener on the root element. That happens to work for a
 *     `click` on a component whose root is a `<button>`, which is why it survives: the control responds, so
 *     nobody looks, and the same shape silently does nothing for any event a DOM element does not raise.
 *
 * Usage:
 *   node find-emit-mismatches.mjs [project-root]
 *
 * Exit codes:
 *   0  the three agree everywhere
 *   1  at least one disagreement
 *   2  no component here declares events this way — nothing was checked
 */

import fs from 'node:fs'
import path from 'node:path'
import nodeProcess from 'node:process'

const PROJECT_PATH = path.resolve(nodeProcess.argv[2] ?? '.')

const SEARCH_DIRECTORY_NAMES = [
  'components',
  'layouts',
  'pages',
]

const CONTEXT_FILE_SUFFIX = 'Context.js'

const EMIT_EVENT_NAME_PATTERN = /static get EMIT_EVENT_NAME \(\) \{\s*return \{(?<body>[\s\S]*?)\}\s*\}/u

const EVENT_ENTRY_PATTERN = /^\s*(?<key>[A-Z_]+)\s*:\s*'(?<name>[^']+)'/gmu

/*
 * `this.emit(this.EMIT_EVENT_NAME.KEY` — the declared route out.
 */
const DECLARED_EMIT_PATTERN = /\.emit\(\s*\n?\s*this\.EMIT_EVENT_NAME\.(?<key>[A-Z_]+)/gu

/*
 * `emit('literal'` — the undeclared route out.
 */
const LITERAL_EMIT_PATTERN = /\.emit\(\s*\n?\s*'(?<name>[^']+)'/gu

const EMITS_OPTION_PATTERN = /emits\s*:\s*\[(?<body>[\s\S]*?)\]/u

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
 * Find the component that pairs with a context file.
 *
 * @param {{
 *   contextPath: string
 * }} params - Parameters.
 * @returns {string | null} Absolute path, or null when there is no paired component.
 */
function resolveComponentPath ({
  contextPath,
}) {
  const directoryPath = path.dirname(contextPath)
  const baseName = path.basename(contextPath, CONTEXT_FILE_SUFFIX)

  return [
    path.join(directoryPath, `${baseName}.vue`),
    path.join(directoryPath, 'index.vue'),
  ]
    .find(candidate => fs.existsSync(candidate))
    ?? null
}

const contextPaths = SEARCH_DIRECTORY_NAMES
  .flatMap(directoryName => collectFilePaths({
    directoryPath: path.join(PROJECT_PATH, directoryName),
    suffix: CONTEXT_FILE_SUFFIX,
  }))

const checked = contextPaths
  .map(contextPath => {
    const source = fs.readFileSync(contextPath, 'utf8')

    const declarationBody = source.match(EMIT_EVENT_NAME_PATTERN)
      ?.groups
      ?.body
    if (!declarationBody) {
      return null
    }

    const declared = [
      ...declarationBody.matchAll(EVENT_ENTRY_PATTERN),
    ]
      .map(matched => ({
        key: String(matched.groups?.key),
        name: String(matched.groups?.name),
      }))

    const emittedKeys = new Set(
      [
        ...source.matchAll(DECLARED_EMIT_PATTERN),
      ]
        .map(matched => String(matched.groups?.key))
    )

    const literalNames = [
      ...new Set(
        [
          ...source.matchAll(LITERAL_EMIT_PATTERN),
        ]
          .map(matched => String(matched.groups?.name))
      ),
    ]

    const componentPath = resolveComponentPath({ contextPath })
    const registeredBody = componentPath
      ? fs.readFileSync(componentPath, 'utf8')
        .match(EMITS_OPTION_PATTERN)
        ?.groups
        ?.body
        ?? ''
      : ''

    return {
      contextPath,
      componentPath,
      neverEmitted: declared
        .filter(it => !emittedKeys.has(it.key)),
      literalNames,
      unregistered: componentPath
        ? declared
          .filter(it => !registeredBody.includes(`.${it.key}`) && !registeredBody.includes(`'${it.name}'`))
        : [],
    }
  })
  .filter(Boolean)

if (checked.length === 0) {
  console.log('NOT APPLICABLE: no context here declares its events in one place.')

  nodeProcess.exitCode = 2
} else {
  const findings = checked
    .filter(it => it.neverEmitted.length > 0 || it.literalNames.length > 0 || it.unregistered.length > 0)

  const report = findings
    .map(it => [
      `  ${path.relative(PROJECT_PATH, it.contextPath)}`,
      ...it.neverEmitted
        .map(event => `    ${event.key} ('${event.name}') declared and never emitted — a listener for it can never fire`),
      ...it.literalNames
        .map(name => `    emit('${name}') bypasses the declaration — invisible to every check that reads it`),
      ...it.unregistered
        .map(event => `    '${event.name}' missing from the component's emits — a caller's listener becomes a native DOM listener`),
    ]
      .join('\n'))
    .join('\n')

  console.log(
    [
      report,
      `MISMATCHES: ${findings.length}   CONTEXTS CHECKED: ${checked.length}`,
    ]
      .filter(it => it !== '')
      .join('\n\n')
  )

  nodeProcess.exitCode = findings.length > 0
    ? 1
    : 0
}
