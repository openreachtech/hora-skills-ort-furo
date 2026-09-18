#!/usr/bin/env node

/*
 * Reconcile the specification against the operations the product exposes.
 *
 * What the API layer exposes is the contract of what the product can do, and it is machine-readable. So a
 * scenario nobody wrote does not have to be noticed: it shows up as a difference — an operation with a
 * client built for it and no scenario naming it under `Covers`.
 *
 * What it can see: the operation folders under the client directories — a query, a mutation, a subscription
 * or a REST call alike — and the headings and fields of the flow files. What it cannot see: whether a scenario is worth running, whether its steps are performable,
 * or whether the operation it covers is the one it actually exercises. Those are readings, not comparisons.
 *
 * Three comparisons, each withheld rather than answered where its input could not be read:
 *
 *   uncovered-operations   every operation against the union of every active scenario's `Covers`
 *   stale-exclusions       every flow exclusion and index coverage gap against that same operation set
 *   duplicate-identifiers  every scenario identifier against the others, across all flow files
 *
 * A shape this script does not recognise is reported as unrecognised, never as a finding. No project has
 * carried an `ai/specs/e2e/` yet, so the labels below are unproven — and reading `Covers` as empty because
 * a label moved would report every operation as uncovered, which is worse than reporting nothing. Whenever
 * one comparison is withheld, the exit code is 2 for the whole run: a partial reconciliation reported as
 * findings reads as a complete one.
 *
 * Usage:
 *   node check-scenario-coverage.mjs [project-root]
 *
 * Exit codes:
 *   0  every comparison ran, and each came back clean
 *   1  every comparison ran, and at least one found something
 *   2  at least one comparison could not be made — nothing here is a pass
 */

import fs from 'node:fs'
import path from 'node:path'
import nodeProcess from 'node:process'

const PROJECT_PATH = path.resolve(nodeProcess.argv[2] ?? '.')

/*
 * Where the specification lives, and where the operations it is reconciled against live. Both are
 * conventions of the project layout rather than of any library, so they are stated here and nowhere else
 * in this script.
 */
const SPECIFICATION_DIRECTORY_NAME = path.join('ai', 'specs', 'e2e')
const INDEX_FILE_NAME = 'index.md'

const CLIENT_DIRECTORY_NAMES = [
  path.join('app', 'graphql', 'client'),
  path.join('app', 'restfulapi'),
]

/*
 * One operation is a folder named after the field it calls, holding a trio of classes. The base classes sit
 * loose in the parent folder rather than in one of their own, so skipping the classes named `Base…` is what
 * leaves the operation folders and nothing else.
 *
 * A subscription's trio is led by a Subscriber rather than a Launcher, and a subscription is an operation a
 * scenario can cover. Reading only `Launcher.js` walked past every one of them — measured against a real
 * frontend, 16 operations where there are 19 — and a subscription no scenario covered then came back clean
 * rather than reported, which is the one failure here that says nothing at all.
 */
const ENTRY_CLASS_FILE_SUFFIXES = [
  'Launcher.js',
  'Subscriber.js',
]
const BASE_CLASS_NAME_PREFIX = 'Base'

/*
 * The labels of the schema. These are a contract rather than a convenience: the identifier lives in the
 * heading and the operations live under `Covers`, and renaming either makes the scenario invisible here.
 */
const SCENARIO_HEADING_PATTERN = /^### +(?<identifier>[A-Za-z]+-\d+)/mu

/*
 * A heading of any depth whose text opens with an identifier. Counting these is what notices a heading
 * that moved rather than one that is absent: `#### APP-01` matches no split on `### `, so the scenario
 * disappears from the parse while leaving the file looking merely short.
 */
const SCENARIO_HEADING_ANY_DEPTH_PATTERN = /^#{1,6} +(?<identifier>[A-Za-z]+-\d+)/gmu
const COVERS_FIELD_PATTERN = /^- +\*\*Covers\*\*:(?<operations>.*)$/mu
const STATUS_FIELD_PATTERN = /^- +\*\*Status\*\*: *(?<status>.+)$/mu
const BACKTICKED_NAME_PATTERN = /`(?<name>[^`]+)`/gu
const OPERATION_TABLE_ROW_PATTERN = /^\| *`(?<operation>[^`]+)` *\|(?<reason>[^|]*)\|/gmu

const SCENARIO_HEADING_MARKER = '### '
const EXCLUSION_HEADING = '## Excluded from this flow'
const COVERAGE_GAPS_HEADING = '## Coverage gaps'
const RETIRED_STATUS_PREFIX = 'retired'

/**
 * Read a file, treating anything unreadable as absent.
 *
 * Nothing in this script throws. An uncaught exception exits 1, which is the code for findings, so a crash
 * would arrive indistinguishable from a reconciliation that found something.
 *
 * @param {{
 *   filePath: string
 * }} params - Parameters.
 * @returns {string | null} The contents, or null where it could not be read.
 */
function readFileOrNull ({
  filePath,
}) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
}

/**
 * List the entries of a directory, treating anything unreadable as empty.
 *
 * @param {{
 *   directoryPath: string
 *   recursive?: boolean
 * }} params - Parameters.
 * @returns {Array<string>} Entry paths relative to the directory.
 */
function readDirectoryEntries ({
  directoryPath,
  recursive = false,
}) {
  try {
    return fs.readdirSync(directoryPath, { recursive })
      .map(entryPath => String(entryPath))
  } catch {
    return []
  }
}

/**
 * Collect the operations the product exposes, by the folder each one lives in.
 *
 * @returns {Array<string>} Operation identifiers, as `Covers` spells them.
 */
function readOperationNames () {
  return CLIENT_DIRECTORY_NAMES
    .flatMap(directoryName => {
      const directoryPath = path.join(PROJECT_PATH, directoryName)

      return readDirectoryEntries({ directoryPath, recursive: true })
        .filter(entryPath => ENTRY_CLASS_FILE_SUFFIXES
          .some(suffix => path.basename(entryPath)
            .endsWith(suffix)))
        .filter(entryPath => !path.basename(entryPath)
          .startsWith(BASE_CLASS_NAME_PREFIX))
        .map(entryPath => path.basename(path.dirname(entryPath)))
    })
    .filter((name, index, names) => names.indexOf(name) === index)
}

/**
 * Split one flow file into its scenarios, and read the three fields this reconciliation rests on.
 *
 * The heading count is returned alongside, because a file whose headings outnumber the scenarios parsed out
 * of it is a file this script no longer understands — which is a condition to report, not a set of gaps.
 *
 * @param {{
 *   source: string
 * }} params - Parameters.
 * @returns {{
 *   headingCount: number
 *   scenarios: Array<{ identifier: string, status: string | null, covers: Array<string> | null }>
 * }} What the file yielded.
 */
function readScenarios ({
  source,
}) {
  const blocks = source
    .split(new RegExp(`^${SCENARIO_HEADING_MARKER}`, 'mu'))
    .slice(1)

  return {
    headingCount: [
      ...source.matchAll(SCENARIO_HEADING_ANY_DEPTH_PATTERN),
    ]
      .length,
    scenarios: blocks
      .map(block => `${SCENARIO_HEADING_MARKER}${block}`)
      .map(block => ({
        identifier: SCENARIO_HEADING_PATTERN.exec(block)?.groups?.identifier ?? null,
        status: STATUS_FIELD_PATTERN.exec(block)?.groups?.status?.trim() ?? null,
        covers: readCovers({ block }),
      }))
      .filter(scenario => scenario.identifier !== null),
  }
}

/**
 * Read one scenario's `Covers` list.
 *
 * Absent and empty are kept apart: null says the label was not found at all, and an empty array says it was
 * found holding nothing. The first is a condition, the second is the scenario's own doing.
 *
 * @param {{
 *   block: string
 * }} params - Parameters.
 * @returns {Array<string> | null} The operations named, or null where the label is absent.
 */
function readCovers ({
  block,
}) {
  const matched = COVERS_FIELD_PATTERN.exec(block)
  if (matched === null) {
    return null
  }

  return [
    ...String(matched.groups?.operations)
      .matchAll(BACKTICKED_NAME_PATTERN),
  ]
    .map(it => String(it.groups?.name)
      .trim())
}

/**
 * Read an operation table standing under one heading — a flow's exclusions, or the index's coverage gaps.
 *
 * @param {{
 *   source: string
 *   heading: string
 *   filePath: string
 * }} params - Parameters.
 * @returns {{
 *   isPresent: boolean
 *   rows: Array<{ operation: string, reason: string, filePath: string }>
 * }} Whether the heading is there, and what stood under it.
 */
function readOperationTable ({
  source,
  heading,
  filePath,
}) {
  const headingIndex = source.indexOf(heading)
  if (headingIndex < 0) {
    return {
      isPresent: false,
      rows: [],
    }
  }

  const [section] = source
    .slice(headingIndex + heading.length)
    .split(/^## /mu)

  return {
    isPresent: true,
    rows: [
      ...section.matchAll(OPERATION_TABLE_ROW_PATTERN),
    ]
      .map(matched => ({
        operation: String(matched.groups?.operation)
          .trim(),
        reason: String(matched.groups?.reason)
          .trim(),
        filePath,
      }))
      .filter(row => row.operation !== 'Operation'),
  }
}

/**
 * Resolve the exit code from what the run could and could not settle.
 *
 * A withheld comparison outranks a finding. The findings are still printed, but the code says the
 * reconciliation was partial — reported as `1`, it would read as the whole of what there is to fix.
 *
 * @param {{
 *   withheldCheckCount: number
 *   findingCount: number
 * }} params - Parameters.
 * @returns {number} 0 clean, 1 findings, 2 a comparison was withheld.
 */
function resolveExitCode ({
  withheldCheckCount,
  findingCount,
}) {
  if (withheldCheckCount > 0) {
    return 2
  }

  if (findingCount > 0) {
    return 1
  }

  return 0
}

const entryClassLabel = ENTRY_CLASS_FILE_SUFFIXES
  .map(suffix => `*${suffix}`)
  .join(' or ')

const specificationPath = path.join(PROJECT_PATH, SPECIFICATION_DIRECTORY_NAME)

const flowFileNames = readDirectoryEntries({ directoryPath: specificationPath })
  .filter(entryName => entryName.endsWith('.md'))
  .filter(entryName => entryName !== INDEX_FILE_NAME)
  .toSorted()

const operationNames = readOperationNames()

const conditions = []
const findings = []

const flowFiles = flowFileNames
  .map(fileName => ({
    fileName,
    source: readFileOrNull({ filePath: path.join(specificationPath, fileName) }),
  }))

flowFiles
  .filter(it => it.source === null)
  .forEach(it => {
    conditions.push(`${SPECIFICATION_DIRECTORY_NAME}/${it.fileName} could not be read`)
  })

const readableFlowFiles = flowFiles
  .filter(it => it.source !== null)
  .map(it => ({
    fileName: it.fileName,
    source: String(it.source),
    ...readScenarios({ source: String(it.source) }),
  }))

const scenarios = readableFlowFiles
  .flatMap(it => it.scenarios
    .map(scenario => ({ ...scenario, fileName: it.fileName })))

const activeScenarios = scenarios
  .filter(it => it.status === null || !it.status.startsWith(RETIRED_STATUS_PREFIX))

readableFlowFiles
  .filter(it => it.headingCount > it.scenarios.length)
  .forEach(it => {
    conditions.push(
      `${SPECIFICATION_DIRECTORY_NAME}/${it.fileName} holds ${it.headingCount} scenario headings and ${it.scenarios.length} parsed — the heading shape has moved`
    )
  })

activeScenarios
  .filter(it => it.status === null)
  .forEach(it => {
    conditions.push(
      `${SPECIFICATION_DIRECTORY_NAME}/${it.fileName} ${it.identifier} carries no Status — retired cannot be told from active`
    )
  })

if (activeScenarios.length > 0 && activeScenarios.every(it => it.covers === null)) {
  conditions.push(
    'no active scenario carries a Covers label — the label has moved, and every operation would read as uncovered'
  )
}

/*
 * An empty set of covered operations cannot be told apart from a parse that failed, and asserting a gap
 * against it reports the whole product as unspecified. So the universe has to be non-empty before any
 * operation is called uncovered.
 */
if (flowFileNames.length > 0 && activeScenarios.length === 0) {
  conditions.push(
    `no active scenario was parsed out of ${flowFileNames.length} flow file(s) — nothing could be compared against`
  )
}

if (activeScenarios.some(it => it.covers !== null)) {
  activeScenarios
    .filter(it => it.covers === null)
    .forEach(it => {
      conditions.push(
        `${SPECIFICATION_DIRECTORY_NAME}/${it.fileName} ${it.identifier} carries no Covers label`
      )
    })
}

const exclusionTables = readableFlowFiles
  .map(it => readOperationTable({
    source: it.source,
    heading: EXCLUSION_HEADING,
    filePath: `${SPECIFICATION_DIRECTORY_NAME}/${it.fileName}`,
  }))

const indexSource = readFileOrNull({ filePath: path.join(specificationPath, INDEX_FILE_NAME) })

const coverageGapsTable = indexSource === null
  ? { isPresent: false, rows: [] }
  : readOperationTable({
    source: indexSource,
    heading: COVERAGE_GAPS_HEADING,
    filePath: `${SPECIFICATION_DIRECTORY_NAME}/${INDEX_FILE_NAME}`,
  })

const operationTables = [
  ...exclusionTables,
  coverageGapsTable,
]

operationTables
  .filter(table => table.isPresent && table.rows.length === 0)
  .forEach(() => {
    conditions.push(
      'an exclusion or coverage-gaps heading stands over no rows this script could read — the table shape has moved'
    )
  })

const accountedFor = operationTables
  .flatMap(table => table.rows)

const isSpecificationReadable = flowFileNames.length > 0
  && readableFlowFiles.length === flowFileNames.length

const isSpecificationDirectoryThere = fs.existsSync(specificationPath)

if (!isSpecificationDirectoryThere) {
  conditions.push(`${SPECIFICATION_DIRECTORY_NAME} is not there — nothing was reconciled`)
}

if (isSpecificationDirectoryThere && flowFileNames.length === 0) {
  conditions.push(`${SPECIFICATION_DIRECTORY_NAME} holds no flow file beside ${INDEX_FILE_NAME}`)
}

if (operationNames.length === 0) {
  conditions.push(
    `no ${entryClassLabel} found under ${CLIENT_DIRECTORY_NAMES.join(' or ')} — the operations could not be enumerated`
  )
}

const canCompareAgainstOperations = operationNames.length > 0
  && isSpecificationReadable
  && conditions.length === 0

if (canCompareAgainstOperations) {
  const coveredNames = new Set(
    activeScenarios.flatMap(it => it.covers ?? [])
  )
  const accountedForNames = new Set(
    accountedFor.map(it => it.operation)
  )

  operationNames
    .filter(name => !coveredNames.has(name))
    .filter(name => !accountedForNames.has(name))
    .forEach(name => {
      findings.push(`  ${name}\n    no scenario covers it, and it is neither excluded nor recorded as a gap`)
    })

  accountedFor
    .filter(it => !operationNames.includes(it.operation))
    .forEach(it => {
      findings.push(`  ${it.operation}\n    named in ${it.filePath}, and the operation is no longer there`)
    })
}

if (isSpecificationReadable) {
  const identifiers = scenarios.map(it => it.identifier)

  identifiers
    .filter((identifier, index) => identifiers.indexOf(identifier) !== index)
    .filter((identifier, index, duplicated) => duplicated.indexOf(identifier) === index)
    .map(identifier => ({
      identifier,
      holders: scenarios
        .filter(it => it.identifier === identifier)
        .map(it => it.fileName),
    }))
    .forEach(it => {
      findings.push(`  ${it.identifier}\n    the identifier is used ${it.holders.length} times — ${it.holders.join(', ')}`)
    })
}

const performedChecks = [
  canCompareAgainstOperations
    ? 'uncovered-operations'
    : null,
  canCompareAgainstOperations
    ? 'stale-exclusions'
    : null,
  isSpecificationReadable
    ? 'duplicate-identifiers'
    : null,
]
  .filter(it => it !== null)

const withheldChecks = [
  'uncovered-operations',
  'stale-exclusions',
  'duplicate-identifiers',
]
  .filter(it => !performedChecks.includes(it))

const performedLabel = performedChecks.length > 0
  ? performedChecks.join(', ')
  : 'none'

const withheldLabel = withheldChecks.length > 0
  ? withheldChecks.join(', ')
  : 'none'

nodeProcess.stdout.write(
  [
    findings.join('\n\n'),
    conditions
      .map(it => `WITHHELD: ${it}`)
      .join('\n'),
    `OPERATIONS: ${operationNames.length}   SCENARIOS: ${scenarios.length}   ACTIVE: ${activeScenarios.length}   ACCOUNTED FOR: ${accountedFor.length}   FINDINGS: ${findings.length}`,
    `PERFORMED: ${performedLabel}   WITHHELD: ${withheldLabel}`,
  ]
    .filter(it => it !== '')
    .join('\n\n')
    .concat('\n')
)

nodeProcess.exitCode = resolveExitCode({
  withheldCheckCount: withheldChecks.length,
  findingCount: findings.length,
})
