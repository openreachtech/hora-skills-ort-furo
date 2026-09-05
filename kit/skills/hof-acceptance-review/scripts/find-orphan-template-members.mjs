#!/usr/bin/env node

/*
 * Find `context.<member>` references in a template that the paired Context class does not define.
 *
 * In this architecture a `.vue` file holds no logic: every expression in the template reads a member of a
 * Context class. That makes the join between the two mechanically checkable — and it is a join nothing else
 * checks. A renamed method, a member that moved to another context, a typo: the template still compiles,
 * lint still passes, and the unit tests still pass because they call the context directly and never render
 * the template. The screen throws at runtime, or silently renders nothing where a value was meant to be.
 *
 * The class chain is walked through `extends`, including into `node_modules`, so members inherited from the
 * framework base are not reported.
 *
 * Usage:
 *   node find-orphan-template-members.mjs [project-root]
 *
 * Exit codes:
 *   0  every reference resolves
 *   1  at least one reference does not resolve
 *   2  the project does not look like a Vue project with paired Context classes — nothing was checked
 */

import fs from 'node:fs'
import path from 'node:path'
import nodeProcess from 'node:process'

const PROJECT_PATH = path.resolve(nodeProcess.argv[2] ?? '.')

const SEARCH_DIRECTORY_NAMES = [
  'pages',
  'components',
  'layouts',
]

/*
 * `const context = SomethingContext.create(` — the one binding a template's `context` to a class.
 */
const CONTEXT_BINDING_PATTERN = /const\s+context\s*=\s*(?<className>[A-Za-z0-9_]+)\s*\n?\s*\.?\s*create/u

const IMPORT_PATTERN_OF = className =>
  new RegExp(`import\\s+${className}\\s+from\\s+'(?<source>[^']+)'`, 'u')

const EXTENDS_PATTERN = /class\s+[A-Za-z0-9_]+\s+extends\s+(?<parentName>[A-Za-z0-9_]+)/u

const NAMED_IMPORT_PATTERN_OF = className =>
  new RegExp(`import\\s*\\{[^}]*\\b${className}\\b[^}]*\\}\\s*from\\s+'(?<source>[^']+)'`, 'su')

const TEMPLATE_PATTERN = /<template>(?<body>[\s\S]*)<\/template>/u

const CONTEXT_MEMBER_PATTERN = /\bcontext\s*\.\s*(?<member>[A-Za-z0-9_$]+)/gu

const PROPERTY_ASSIGNMENT_PATTERN = /^\s*this\.(?<name>[A-Za-z0-9_$]+)\s*=/gmu

const INSTANCE_GETTER_PATTERN = /^ {2}get\s+(?<name>[A-Za-z0-9_$]+)\s*\(/gmu

const INSTANCE_METHOD_PATTERN = /^ {2}(?:async\s+)?(?<name>[A-Za-z0-9_$]+)\s*\(/gmu

const NON_MEMBER_NAMES = new Set([
  'constructor',
  'if',
  'for',
  'while',
  'switch',
  'catch',
  'return',
])

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
 * Resolve an import specifier to a file on disk.
 *
 * @param {{
 *   source: string
 *   fromPath: string
 * }} params - Parameters.
 * @returns {string | null} Absolute path, or null when it cannot be resolved.
 */
function resolveSourcePath ({
  source,
  fromPath,
}) {
  const candidates = source.startsWith('~/') || source.startsWith('@/')
    ? [path.join(PROJECT_PATH, source.slice(2))]
    : source.startsWith('.')
      ? [path.resolve(path.dirname(fromPath), source)]
      : [
          path.join(PROJECT_PATH, 'node_modules', source, 'index.js'),
          path.join(PROJECT_PATH, 'node_modules', source),
        ]

  return candidates
    .flatMap(candidate => [
      candidate,
      `${candidate}.js`,
      path.join(candidate, 'index.js'),
    ])
    .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
    ?? null
}

/**
 * Read the names a class body defines.
 *
 * @param {{
 *   source: string
 * }} params - Parameters.
 * @returns {Array<string>} Member names.
 */
function extractOwnMemberNames ({
  source,
}) {
  return [
    PROPERTY_ASSIGNMENT_PATTERN,
    INSTANCE_GETTER_PATTERN,
    INSTANCE_METHOD_PATTERN,
  ]
    .flatMap(pattern => [
      ...source.matchAll(pattern),
    ])
    .map(matched => String(matched.groups?.name))
    .filter(name => !NON_MEMBER_NAMES.has(name))
}

/**
 * Read the names a class and everything it extends define.
 *
 * A barrel such as `@openreachtech/furo-nuxt` re-exports its bases, so the specifier may resolve to an
 * index that only re-exports. That is treated as the end of the chain rather than a failure: the members it
 * would have contributed are covered by the framework allowlist a caller passes in.
 *
 * @param {{
 *   classPath: string
 *   className: string
 *   seenPaths: Set<string>
 * }} params - Parameters.
 * @returns {Array<string>} Member names.
 */
function extractInheritedMemberNames ({
  classPath,
  className,
  seenPaths,
}) {
  if (!classPath || seenPaths.has(classPath)) {
    return []
  }

  seenPaths.add(classPath)

  const source = fs.readFileSync(classPath, 'utf8')
  const ownNames = extractOwnMemberNames({ source })

  const parentName = source.match(EXTENDS_PATTERN)
    ?.groups
    ?.parentName
  if (!parentName) {
    return ownNames
  }

  const parentSource = source.match(IMPORT_PATTERN_OF(parentName))
    ?.groups
    ?.source
    ?? source.match(NAMED_IMPORT_PATTERN_OF(parentName))
      ?.groups
      ?.source
  if (!parentSource) {
    return ownNames
  }

  const parentPath = resolveSourcePath({
    source: parentSource,
    fromPath: classPath,
  })

  return [
    ...ownNames,
    ...extractInheritedMemberNames({
      classPath: parentPath,
      className: parentName,
      seenPaths,
    }),
  ]
}

/**
 * Find the Context class a template's `context` is bound to.
 *
 * @param {{
 *   componentPath: string
 *   source: string
 * }} params - Parameters.
 * @returns {{ className: string, classPath: string } | null} The class, or null when there is none.
 */
function resolveBoundContext ({
  componentPath,
  source,
}) {
  const className = source.match(CONTEXT_BINDING_PATTERN)
    ?.groups
    ?.className
  if (!className) {
    return null
  }

  const importedSource = source.match(IMPORT_PATTERN_OF(className))
    ?.groups
    ?.source
  if (!importedSource) {
    return null
  }

  const classPath = resolveSourcePath({
    source: importedSource,
    fromPath: componentPath,
  })
  if (!classPath) {
    return null
  }

  return {
    className,
    classPath,
  }
}

/*
 * Members every Context inherits from the framework base. Listed rather than parsed because the base lives
 * behind a barrel export whose chain cannot be followed by reading files alone.
 */
const FRAMEWORK_MEMBER_NAMES = new Set([
  'props',
  'componentContext',
  'emit',
  'expose',
  'slots',
  'attrs',
  'watch',
  'Ctor',
  'EMIT_EVENT_NAME',
  'setupComponent',
])

const componentPaths = SEARCH_DIRECTORY_NAMES
  .flatMap(directoryName => collectFilePaths({
    directoryPath: path.join(PROJECT_PATH, directoryName),
    extension: '.vue',
  }))

const checked = componentPaths
  .map(componentPath => {
    const source = fs.readFileSync(componentPath, 'utf8')

    const bound = resolveBoundContext({
      componentPath,
      source,
    })
    if (!bound) {
      return null
    }

    const templateBody = source.match(TEMPLATE_PATTERN)
      ?.groups
      ?.body
      ?? ''

    const memberNames = new Set([
      ...extractInheritedMemberNames({
        classPath: bound.classPath,
        className: bound.className,
        seenPaths: new Set(),
      }),
      ...FRAMEWORK_MEMBER_NAMES,
    ])

    const referenced = [
      ...new Set(
        [
          ...templateBody.matchAll(CONTEXT_MEMBER_PATTERN),
        ]
          .map(matched => String(matched.groups?.member))
      ),
    ]

    return {
      componentPath,
      className: bound.className,
      orphans: referenced.filter(name => !memberNames.has(name)),
    }
  })
  .filter(Boolean)

if (checked.length === 0) {
  console.log('NOT APPLICABLE: no .vue file binds `context` to a Context class here.')

  nodeProcess.exitCode = 2
} else {
  const findings = checked
    .filter(it => it.orphans.length > 0)

  const report = findings
    .map(it => [
      `  ${path.relative(PROJECT_PATH, it.componentPath)}`,
      ...it.orphans
        .map(name => `    context.${name}  <- not defined on ${it.className} or anything it extends`),
    ]
      .join('\n'))
    .join('\n')

  console.log(
    [
      report,
      `ORPHAN MEMBERS: ${findings.reduce((total, it) => total + it.orphans.length, 0)}   COMPONENTS CHECKED: ${checked.length}`,
    ]
      .filter(it => it !== '')
      .join('\n\n')
  )

  nodeProcess.exitCode = findings.length > 0
    ? 1
    : 0
}
