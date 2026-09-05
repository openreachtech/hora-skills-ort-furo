#!/usr/bin/env node
'use strict'

/**
 * uiux-audit — WCAG contrast checker (graded)
 *
 * Computes exact WCAG 2.x contrast ratios and reports them on a graded ladder
 * (BLOCKER / FAIL / RISK / PASS / HARSH / EXEMPT) instead of binary pass-fail,
 * so audits can distinguish "illegal", "fragile", "healthy", and "compliant but
 * uncomfortably harsh".
 *
 * Usage (pairs as fg:bg hex, with or without #):
 *   node scripts/contrast-check.cjs "1C1B18:FFFFFF" "FFFFFF:0F6B54:text" ...
 *
 * Per-pair kind suffix (default: text):
 *   :text      body text            floor 4.5:1
 *   :large     large text           floor 3:1   (>=24px, or >=19px bold)
 *   :ui        UI boundary/icon     floor 3:1   (when it identifies the control)
 *   :focus     focus indicator      floor 3:1   (failure reports as BLOCKER)
 *   :disabled  disabled control     WCAG-exempt (reported EXEMPT, never a finding)
 *   :decor     decorative border    exempt from 1.4.11 (dividers, table lines, card
 *              outlines) — reports QUIET; low contrast here is the modern default.
 *              Use :ui instead when the boundary is the control's only identifier.
 *
 * Flags:
 *   --aaa    audit at AAA floors (7:1 text / 4.5:1 large) — use when the client
 *            context escalates the target (older users, outdoor use, high stakes)
 *
 * Ladder (text kinds):
 *   BLOCKER  < 3:1 body text (unreadable for many users)   exit-affecting
 *   FAIL     below the floor                               exit-affecting
 *   RISK     floor .. floor+10% (margin eaten by rendering) informational
 *   PASS     healthy band
 *   HARSH    > 18:1 (text only) — compliant but flag halation/glare comfort
 *            for large reading areas; advisory, never a violation
 *
 * Exit code: 1 if any BLOCKER/FAIL, else 0.
 */

function hexToRgb (hex) {
  let h = hex.replace(/^#/u, '')
    .trim()
  if (h.length === 3) {
    h = h.split('')
      .map(it => it + it)
      .join('')
  }
  if (!/^[0-9a-fA-F]{6}$/u.test(h)) {
    return null
  }

  return [0, 2, 4].map(it => parseInt(h.slice(it, it + 2), 16) / 255)
}

function luminance (rgb) {
  const f = c => (c <= 0.03928
    ? c / 12.92
    : Math.pow((c + 0.055) / 1.055, 2.4))
  const [r, g, b] = rgb.map(f)

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio (fg, bg) {
  const [l1, l2] = [luminance(fg), luminance(bg)].toSorted((alpha, beta) => beta - alpha)

  return (l1 + 0.05) / (l2 + 0.05)
}

const args = process.argv.slice(2)
const aaa = args.includes('--aaa')
const pairs = args.filter(it => it !== '--aaa')

const FLOORS = aaa
  ? { text: 7.0, large: 4.5, ui: 3.0, focus: 3.0 }
  : { text: 4.5, large: 3.0, ui: 3.0, focus: 3.0 }
const HARSH_ABOVE = 18.0 // text kinds only; advisory
const RISK_MARGIN = 1.10 // floor..floor*1.10 = at-risk band

if (pairs.length === 0) {
  console.error('Usage: node contrast-check.cjs [--aaa] "fg:bg[:text|large|ui|focus|disabled]" ...')
  process.exit(2)
}

let hardFail = 0
for (const arg of pairs) {
  const parts = arg.split(':')
  const [fgHex, bgHex] = parts
  const kind = ['text', 'large', 'ui', 'focus', 'disabled', 'decor'].includes(parts[2])
    ? parts[2]
    : 'text'
  const fg = hexToRgb(fgHex || '')
  const bg = hexToRgb(bgHex || '')
  const label = `#${(fgHex || '').replace('#', '')} on #${(bgHex || '').replace('#', '')}`
  if (!fg || !bg) {
    console.log(`??       invalid pair: ${arg}`)
    hardFail++

    continue
  }
  const r = ratio(fg, bg)
  const rs = `${r.toFixed(2)
    .padStart(6)}:1`

  if (kind === 'disabled') {
    console.log(`EXEMPT   ${rs}  (disabled control — WCAG-exempt; low contrast here is the design working)  ${label}`)

    continue
  }

  if (kind === 'decor') {
    const quiet = r <= 1.6
    console.log(`QUIET    ${rs}  (decorative border — 1.4.11-exempt; ${quiet
      ? 'within the modern hairline range (~1.1–1.6:1)'
      : 'heavier than the quiet default — fine if a bold style (Neobrutalism, Retro, …) or darker borders were requested; otherwise a craft note, not a contrast finding'})  ${label}`)

    continue
  }

  const floor = FLOORS[kind]
  let status, note
  if (r < floor) {
    if (kind === 'focus') {
      status = 'BLOCKER'
      note = `focus indicator below ${floor}:1 — keyboard users cannot see where they are`
    } else if (kind === 'text' && r < 3.0) {
      status = 'BLOCKER'
      note = `body text below 3:1 — unreadable for many users (floor ${floor}:1)`
    } else {
      status = 'FAIL'
      note = `below the ${floor}:1 ${kind} floor${aaa
        ? ' (AAA target)'
        : ''}`
    }
    hardFail++
  } else if (r < floor * RISK_MARGIN) {
    status = 'RISK'
    note = `passes on paper but within 10% of the ${floor}:1 floor — anti-aliasing/gradients/rendering can push it under; verify rendered or add headroom`
  } else if ((kind === 'text' || kind === 'large') && r > HARSH_ABOVE) {
    status = 'HARSH'
    note = 'compliant, but over large reading areas this extreme (near black-on-white) risks halation/glare for astigmatic, light-sensitive, and dyslexic readers — consider softening toward near-black/near-white; NEVER fix by going below the floor'
  } else {
    status = 'PASS'
    note = `${kind}, floor ${floor}:1`
  }
  console.log(`${status.padEnd(8)} ${rs}  (${note})  ${label}`)
}

process.exit(hardFail > 0
  ? 1
  : 0)
