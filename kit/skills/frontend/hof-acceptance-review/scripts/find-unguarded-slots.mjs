#!/usr/bin/env node

/*
 * Find components that take a visibility prop and render their slot regardless of it.
 *
 * A dialog, drawer or popover is usually kept in the DOM and shown by other means — `showModal()`, a class,
 * a `hidden` attribute. Its *content* has no reason to be there while it is closed, and rendering it anyway
 * breaks every caller at a distance: a caller's slot legitimately reads state that only exists once the
 * thing is open — a form draft held as `null` until then is the ordinary shape of it — and evaluating that
 * expression while closed throws on mount.
 *
 * The failure belongs to the container, not to the caller, which is why it is checked here. It is invisible
 * to a unit test of either half, and on a client-rendered app the route still answers 200 while the screen
 * is blank.
 *
 * Usage:
 *   node find-unguarded-slots.mjs [project-root]
 *
 * Exit codes:
 *   0  every slot in a component with a visibility prop is gated on it
 *   1  at least one is not
 *   2  no component here takes a visibility prop — nothing was checked
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

/*
 * Names that mean "this thing is currently on screen". A component holding one is responsible for what it
 * renders while the answer is false.
 */
const VISIBILITY_PROP_PATTERN = /^ {4}(?<name>(?:is|has|should)(?:Shown|Showing|Open|Opened|Visible|Expanded|Active))\s*:\s*\{/gmu

const TEMPLATE_PATTERN = /<template>(?<body>[\s\S]*)<\/template>/u

const SLOT_PATTERN = /<slot\b(?<attributes>[^>]*)>/gu

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
 * Read the visibility props a component declares.
 *
 * @param {{
 *   source: string
 * }} params - Parameters.
 * @returns {Array<string>} Prop names.
 */
function extractVisibilityPropNames ({
  source,
}) {
  return [
    ...source.matchAll(VISIBILITY_PROP_PATTERN),
  ]
    .map(matched => String(matched.groups?.name))
}

/**
 * Check whether a slot, or something wrapping it, is gated on one of the visibility props.
 *
 * Everything before the slot is inspected rather than the enclosing element alone: a `v-if` on any ancestor
 * keeps the slot out of the render, and the ancestor is what carries it in practice.
 *
 * @param {{
 *   templateBody: string
 *   slotIndex: number
 *   propNames: Array<string>
 * }} params - Parameters.
 * @returns {boolean} true: the slot cannot render while hidden.
 */
function isGatedSlot ({
  templateBody,
  slotIndex,
  propNames,
}) {
  const preceding = templateBody.slice(0, slotIndex)

  return propNames
    .some(propName => new RegExp(`v-if\\s*=\\s*"[^"]*\\b${propName}\\b`, 'u')
      .test(preceding))
}

const componentPaths = SEARCH_DIRECTORY_NAMES
  .flatMap(directoryName => collectFilePaths({
    directoryPath: path.join(PROJECT_PATH, directoryName),
    extension: '.vue',
  }))

const checked = componentPaths
  .map(componentPath => {
    const source = fs.readFileSync(componentPath, 'utf8')

    const propNames = extractVisibilityPropNames({ source })
    if (propNames.length === 0) {
      return null
    }

    const templateBody = source.match(TEMPLATE_PATTERN)
      ?.groups
      ?.body
      ?? ''

    const unguarded = [
      ...templateBody.matchAll(SLOT_PATTERN),
    ]
      .filter(matched => !String(matched.groups?.attributes).includes('v-if'))
      .filter(matched => !isGatedSlot({
        templateBody,
        slotIndex: matched.index ?? 0,
        propNames,
      }))

    return {
      componentPath,
      propNames,
      unguardedCount: unguarded.length,
    }
  })
  .filter(Boolean)

if (checked.length === 0) {
  console.log('NOT APPLICABLE: no component here declares a visibility prop.')

  nodeProcess.exitCode = 2
} else {
  const findings = checked
    .filter(it => it.unguardedCount > 0)

  const report = findings
    .map(it => [
      `  ${path.relative(PROJECT_PATH, it.componentPath)}`,
      `    renders its slot whether or not ${it.propNames.join(' / ')} is true`,
      '    a caller reading state that exists only while open throws on mount',
    ]
      .join('\n'))
    .join('\n')

  console.log(
    [
      report,
      `UNGUARDED SLOTS: ${findings.length}   COMPONENTS CHECKED: ${checked.length}`,
    ]
      .filter(it => it !== '')
      .join('\n\n')
  )

  nodeProcess.exitCode = findings.length > 0
    ? 1
    : 0
}
