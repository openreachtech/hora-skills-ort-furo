#!/usr/bin/env node
'use strict'

/**
 * uiux-audit — token compliance validator (shared with the uiux-forge generator)
 *
 * Scans generated UI files for hardcoded design values that should be tokens.
 * Run it on the file(s) you just generated as part of the self-verify step:
 *
 *   node scripts/validate-tokens.cjs <file-or-dir> [more files...]
 *
 * Exit code 0 = clean, 1 = violations found (machine-checkable guardrail).
 *
 * What it flags:
 *   - Hex colors            #fff, #A1B2C3 (incl. inside Tailwind arbitrary values)
 *   - Raw color functions   rgb(), rgba(), hsl(), hsla(), oklch() literals
 *   - Tailwind arbitrary px/rem/color values   mt-[13px], text-[15px], bg-[#123456]
 *   - Inline style pixel values                style={{ margin: '13px' }}
 *
 * What it deliberately allows:
 *   - Token SOURCE files (tailwind.config.*, *tokens*.json) — raw values belong there
 *   - CSS custom property DEFINITIONS (lines like `--color-primary: #2563EB;`)
 *   - var(--...) usages, currentColor, transparent, inherit
 *   - 0, 1px (hairlines), and 100%/vh/vw sizing
 *   - Lines annotated with token-ok (line comment or block comment) — explicit, visible opt-out
 */

const fs = require('fs')
const path = require('path')

const SCAN_EXT = new Set(['.tsx', '.jsx', '.ts', '.js', '.vue', '.svelte', '.html', '.css'])
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage'])
const TOKEN_SOURCE_FILE = /(tailwind\.config\.(js|ts|cjs|mjs)|tokens?[^/]*\.(json|js|ts))$/ui
const CSS_VAR_DEF = /^\s*--[\w-]+\s*:/u
const OPT_OUT = /token-ok/u

const CHECKS = [
  {
    name: 'hex color',
    regex: /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/ug,
    hint: 'map to a color token (Tailwind theme color or CSS var)',
  },
  {
    name: 'raw color function',
    regex: /\b(?:rgba?|hsla?|oklch)\(\s*[\d.]/ug,
    hint: 'map to a color token; derive hover/active states from the base token',
  },
  {
    name: 'arbitrary Tailwind length',
    regex: /\b[\w-]+-\[\d+(?:\.\d+)?(?:px|rem|em)\]/ug,
    hint: 'use the spacing/type scale (e.g. mt-3, text-sm) instead of a magic number',
    allow: /\[(?:0|1)px\]/u,
  },
  {
    name: 'inline style length',
    regex: /(?:margin|padding|gap|top|left|right|bottom|width|height|fontSize|borderRadius)\s*:\s*['"]?\d{2,}px/ug,
    hint: 'use scale utilities or a token-backed CSS var',
  },
]

function walk (
  target,
  files
) {
  const stat = fs.statSync(target)
  if (stat.isFile()) {
    if (SCAN_EXT.has(path.extname(target))) {
      files.push(target)
    }

    return
  }
  for (const entry of fs.readdirSync(target)) {
    if (IGNORE_DIRS.has(entry)) {
      continue
    }
    walk(path.join(target, entry), files)
  }
}

function scanFile (file) {
  if (TOKEN_SOURCE_FILE.test(file)) {
    return []
  } // token sources legitimately hold raw values
  const violations = []
  const lines = fs.readFileSync(file, 'utf8')
    .split('\n')
  lines.forEach((line, i) => {
    if (CSS_VAR_DEF.test(line) || OPT_OUT.test(line)) {
      return
    }
    if (line.includes('var(--')) {
      // still scan the rest of the line, but strip var() usages first
      line = line.replace(/var\(--[\w-]+\)/ug, '')
    }
    for (const check of CHECKS) {
      const matches = line.match(check.regex) || []
      for (const m of matches) {
        if (check.allow && check.allow.test(m)) {
          continue
        }
        violations.push({ file, line: i + 1, match: m, name: check.name, hint: check.hint })
      }
    }
  })

  return violations
}

const targets = process.argv.slice(2)
if (targets.length === 0) {
  console.error('Usage: node validate-tokens.cjs <file-or-dir> [more...]')
  process.exit(2)
}

const files = []
for (const t of targets) {
  if (!fs.existsSync(t)) {
    console.error(`Not found: ${t}`)
    process.exit(2)
  }
  walk(t, files)
}

let all = []
for (const f of files) {
  all = all.concat(scanFile(f))
}

if (all.length === 0) {
  console.log(`✅ Token compliance: clean (${files.length} file${files.length === 1
    ? ''
    : 's'} scanned)`)
  process.exit(0)
}

console.log(`❌ ${all.length} hardcoded value${all.length === 1
  ? ''
  : 's'} found:\n`)
for (const v of all) {
  console.log(`  ${v.file}:${v.line}  [${v.name}]  ${v.match}`)
  console.log(`      ↳ ${v.hint}`)
}
console.log('\nFix these (or annotate a deliberate exception with `token-ok`) before shipping.')
process.exit(1)
