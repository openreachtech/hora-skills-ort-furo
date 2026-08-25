#!/usr/bin/env node

/*
 * Find every place the application hands a string to the browser as markup.
 *
 * Rendering markup from a value is how stored cross-site scripting arrives, and the value does not have to
 * look like user input for that to be true. Search highlighting is the classic case: the fragments come back
 * from a search engine, which by default does not escape what it wraps — so the text a user typed into a
 * field that got indexed is returned as markup and rendered as markup.
 *
 * Every occurrence is reported. There is no comment that makes one safe: a comment asserting the value is
 * trusted is exactly what sits above the ones that are not, and it is written by the same person who did not
 * check. If an occurrence is genuinely required, record it as an accepted decision in the project
 * declaration where it will be read again next time, not as a comment in the file.
 *
 * Usage:
 *   node find-unsafe-html.mjs [project-root]
 *
 * Exit codes:
 *   0  nothing renders a string as markup
 *   1  at least one place does
 *   2  nothing here could be scanned — nothing was checked
 */

import fs from 'node:fs'
import path from 'node:path'
import nodeProcess from 'node:process'

const PROJECT_PATH = path.resolve(nodeProcess.argv[2] ?? '.')

const SEARCH_DIRECTORY_NAMES = [
  'app',
  'components',
  'composables',
  'layouts',
  'middleware',
  'pages',
  'plugins',
  'stores',
]

const SCANNED_EXTENSIONS = [
  '.vue',
  '.js',
  '.ts',
]

/*
 * Each pattern names one way to turn a string into markup. `dangerouslySetInnerHTML` is included so the check
 * keeps its meaning in a project that renders with a different library.
 */
const MARKUP_PATTERNS = [
  {
    label: 'v-html',
    pattern: /\bv-html\b/u,
  },
  {
    label: 'innerHTML',
    pattern: /\.innerHTML\s*=/u,
  },
  {
    label: 'outerHTML',
    pattern: /\.outerHTML\s*=/u,
  },
  {
    label: 'insertAdjacentHTML',
    pattern: /\.insertAdjacentHTML\s*\(/u,
  },
  {
    label: 'dangerouslySetInnerHTML',
    pattern: /dangerouslySetInnerHTML/u,
  },
]

/**
 * Blank out the parts of a source that are commentary.
 *
 * A convention that forbids something gets written about, and the prose naming it sits in the file next to the
 * code that avoids it. Matching the word inside that prose reports the note explaining the fix as the defect
 * it warns against. Lines are preserved so the numbers a reader is given still point at the right place.
 *
 * @param {{
 *   source: string
 * }} params - Parameters.
 * @returns {Array<string>} Lines, with commentary removed.
 */
function stripCommentary ({
  source,
}) {
  const state = {
    isInsideBlock: false,
  }

  return source
    .split('\n')
    .map(line => {
      const opensBlock = /\/\*|<!--/u.test(line)
      const closesBlock = /\*\/|-->/u.test(line)

      const wasInsideBlock = state.isInsideBlock
      state.isInsideBlock = state.isInsideBlock
        ? !closesBlock
        : opensBlock && !closesBlock

      if (wasInsideBlock || opensBlock) {
        return ''
      }

      return line
        .replace(/\/\/.*$/u, '')
    })
}

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
    .filter(entryPath => SCANNED_EXTENSIONS
      .some(extension => entryPath.endsWith(extension)))
}

const filePaths = SEARCH_DIRECTORY_NAMES
  .flatMap(directoryName => collectFilePaths({
    directoryPath: path.join(PROJECT_PATH, directoryName),
  }))

if (filePaths.length === 0) {
  console.log(`NOT APPLICABLE: no ${SCANNED_EXTENSIONS.join(' / ')} file found under ${SEARCH_DIRECTORY_NAMES.join(', ')}.`)

  nodeProcess.exitCode = 2
} else {
  const findings = filePaths
    .flatMap(filePath => stripCommentary({
      source: fs.readFileSync(filePath, 'utf8'),
    })
      .flatMap((line, index) => MARKUP_PATTERNS
        .filter(it => it.pattern.test(line))
        .map(it => ({
          filePath,
          lineNumber: index + 1,
          label: it.label,
        }))))

  const report = findings
    .map(it => `  ${path.relative(PROJECT_PATH, it.filePath)}:${it.lineNumber}\n    ${it.label} — renders a string as markup; the value's origin has to be argued, not assumed`)
    .join('\n')

  console.log(
    [
      report,
      `MARKUP SINKS: ${findings.length}   FILES SCANNED: ${filePaths.length}`,
    ]
      .filter(it => it !== '')
      .join('\n\n')
  )

  nodeProcess.exitCode = findings.length > 0
    ? 1
    : 0
}
