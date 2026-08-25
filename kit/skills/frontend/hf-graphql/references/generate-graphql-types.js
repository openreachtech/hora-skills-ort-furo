#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

import { parse, Kind } from 'graphql'

const DEFAULT_OUTPUT_PATH = 'types/graphql-schema.d.ts'
const ROOT_TYPE_NAMES = new Set([
  'Query',
  'Mutation',
  'Subscription',
])

const BUILTIN_SCALAR_MAP = new Map([
  ['Int', { type: 'number' }],
  ['Float', { type: 'number' }],
  ['String', { type: 'string' }],
  ['Boolean', { type: 'boolean' }],
  ['ID', { type: 'string' }],
])

const CUSTOM_SCALAR_MAP = new Map([
  ['BigNumber', { type: 'string' }],
  ['DateTime', { type: 'string' }],
  ['Upload', { type: 'File' }],
  ['DateOnly', { type: 'string', comment: 'YYYY-MM-DD' }],
])

main()

function main () {
  const { inputPaths, outputPath } = parseArguments(process.argv.slice(2))
  const schemaFilePaths = collectSchemaFilePaths(inputPaths)
  const definitions = collectDefinitions(schemaFilePaths)
  const outputContent = renderTypeFile(definitions)

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, outputContent)

  process.stdout.write(`Generated ${outputPath} from ${schemaFilePaths.length} schema file(s).\n`)
}

function parseArguments (argv) {
  const inputPaths = []
  let outputPath = DEFAULT_OUTPUT_PATH

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]

    if (argument === '--out' || argument === '-o') {
      outputPath = argv[index + 1]

      if (!outputPath) {
        exitWithUsage('Missing value for --out.')
      }

      index += 1
      continue
    }

    if (argument.startsWith('-')) {
      exitWithUsage(`Unknown option: ${argument}`)
    }

    inputPaths.push(argument)
  }

  if (inputPaths.length === 0) {
    exitWithUsage('At least one schema file or directory path is required.')
  }

  return { inputPaths, outputPath: path.resolve(outputPath) }
}

function exitWithUsage (message) {
  const usage = [
    message,
    '',
    'Usage:',
    '  hectici gqltypes <schema-path ...> [--out <output-file>]',
    '',
    'Examples:',
    '  hectici gqltypes server/graphql/schemas',
    '  hectici gqltypes server/graphql/schemas/customer server/graphql/common.graphql --out types/graphql-schema.d.ts',
  ].join('\n')

  process.stderr.write(`${usage}\n`)
  process.exit(1)
}

function collectSchemaFilePaths (inputPaths) {
  const collected = new Set()

  for (const inputPath of inputPaths) {
    const resolvedPath = path.resolve(inputPath)

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Schema path does not exist: ${inputPath}`)
    }

    const stats = fs.statSync(resolvedPath)

    if (stats.isDirectory()) {
      collectFilesFromDirectory(resolvedPath, collected)
      continue
    }

    if (stats.isFile() && resolvedPath.endsWith('.graphql')) {
      collected.add(resolvedPath)
      continue
    }

    throw new Error(`Unsupported schema path: ${inputPath}`)
  }

  const filePaths = Array.from(collected).sort((left, right) => left.localeCompare(right))

  if (filePaths.length === 0) {
    throw new Error('No .graphql files were found in the provided paths.')
  }

  return filePaths
}

function collectFilesFromDirectory (directoryPath, collected) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      collectFilesFromDirectory(fullPath, collected)
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.graphql')) {
      collected.add(fullPath)
    }
  }
}

function collectDefinitions (schemaFilePaths) {
  const definitions = []
  const mergedByName = new Map()

  for (const schemaFilePath of schemaFilePaths) {
    const schemaSource = fs.readFileSync(schemaFilePath, 'utf8')
    const parsedDocument = parse(schemaSource, { noLocation: true })

    for (const definition of parsedDocument.definitions) {
      if (!isSupportedDefinition(definition)) {
        continue
      }

      if (ROOT_TYPE_NAMES.has(definition.name.value)) {
        continue
      }

      const mergedDefinition = upsertDefinition(definition, mergedByName, definitions)

      if (definition.kind === Kind.OBJECT_TYPE_DEFINITION || definition.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
        mergeFields(mergedDefinition, definition)
      }

      if (definition.kind === Kind.ENUM_TYPE_DEFINITION) {
        mergeEnumValues(mergedDefinition, definition)
      }
    }
  }

  return definitions
}

function isSupportedDefinition (definition) {
  return [
    Kind.SCALAR_TYPE_DEFINITION,
    Kind.ENUM_TYPE_DEFINITION,
    Kind.OBJECT_TYPE_DEFINITION,
    Kind.INPUT_OBJECT_TYPE_DEFINITION,
  ].includes(definition.kind)
}

function upsertDefinition (definition, mergedByName, definitions) {
  const definitionName = definition.name.value
  const existingDefinition = mergedByName.get(definitionName)

  if (!existingDefinition) {
    const nextDefinition = cloneDefinition(definition)
    mergedByName.set(definitionName, nextDefinition)
    definitions.push(nextDefinition)
    return nextDefinition
  }

  if (existingDefinition.kind !== definition.kind) {
    throw new Error(`Definition kind mismatch for ${definitionName}.`)
  }

  return existingDefinition
}

function cloneDefinition (definition) {
  if (definition.kind === Kind.ENUM_TYPE_DEFINITION) {
    return {
      kind: definition.kind,
      name: definition.name.value,
      values: [...(definition.values ?? [])],
    }
  }

  if (definition.kind === Kind.OBJECT_TYPE_DEFINITION || definition.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
    return {
      kind: definition.kind,
      name: definition.name.value,
      fields: [...(definition.fields ?? [])],
    }
  }

  return {
    kind: definition.kind,
    name: definition.name.value,
  }
}

function mergeFields (targetDefinition, sourceDefinition) {
  const existingByName = new Map((targetDefinition.fields ?? []).map((field) => [field.name.value, field]))

  for (const field of sourceDefinition.fields ?? []) {
    const existingField = existingByName.get(field.name.value)

    if (!existingField) {
      targetDefinition.fields.push(field)
      existingByName.set(field.name.value, field)
      continue
    }

    if (printTypeNode(existingField.type) !== printTypeNode(field.type)) {
      throw new Error(`Field type mismatch for ${targetDefinition.name}.${field.name.value}.`)
    }
  }
}

function mergeEnumValues (targetDefinition, sourceDefinition) {
  const existingValues = new Set((targetDefinition.values ?? []).map((value) => value.name.value))

  for (const value of sourceDefinition.values ?? []) {
    if (existingValues.has(value.name.value)) {
      continue
    }

    targetDefinition.values.push(value)
    existingValues.add(value.name.value)
  }
}

function renderTypeFile (definitions) {
  const orderedDefinitions = orderDefinitionsForRender(definitions)
  const lines = [
    'export {}',
    '',
    'declare global {',
    '  namespace schema.graphql {',
  ]

  for (const definition of orderedDefinitions) {
    lines.push(...renderDefinition(definition))
    lines.push('')
  }

  if (lines.at(-1) === '') {
    lines.pop()
  }

  lines.push('  }')
  lines.push('}')
  lines.push('')

  return lines.join('\n')
}

function orderDefinitionsForRender (definitions) {
  const typeDefinitions = definitions.filter((definition) => {
    return definition.kind === Kind.SCALAR_TYPE_DEFINITION || definition.kind === Kind.ENUM_TYPE_DEFINITION
  })
  const interfaceDefinitions = definitions.filter((definition) => {
    return definition.kind === Kind.OBJECT_TYPE_DEFINITION || definition.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION
  })

  return [
    ...typeDefinitions,
    ...interfaceDefinitions,
  ]
}

function renderDefinition (definition) {
  if (definition.kind === Kind.SCALAR_TYPE_DEFINITION) {
    return renderScalar(definition)
  }

  if (definition.kind === Kind.ENUM_TYPE_DEFINITION) {
    return renderEnum(definition)
  }

  return renderInterface(definition)
}

function renderScalar (definition) {
  const scalarConfig = BUILTIN_SCALAR_MAP.get(definition.name) ?? CUSTOM_SCALAR_MAP.get(definition.name) ?? { type: 'unknown' }
  const comment = scalarConfig.comment ? ` // ${scalarConfig.comment}` : ''

  return [`    type ${definition.name} = ${scalarConfig.type}${comment}`]
}

function renderEnum (definition) {
  const enumValues = (definition.values ?? []).map((value) => `'${value.name.value}'`).join(' | ')
  return [`    type ${definition.name} = ${enumValues || 'never'}`]
}

function renderInterface (definition) {
  const lines = [`    interface ${definition.name} {`]

  for (const field of definition.fields ?? []) {
    const { type, isOptional } = toTypeScriptType(field.type)
    const optionalMarker = isOptional ? '?' : ''

    lines.push(`      ${field.name.value}${optionalMarker}: ${type}`)
  }

  lines.push('    }')
  return lines
}

function toTypeScriptType (typeNode) {
  if (typeNode.kind === Kind.NON_NULL_TYPE) {
    const innerType = toTypeScriptType(typeNode.type)
    return {
      type: innerType.type,
      isOptional: false,
    }
  }

  if (typeNode.kind === Kind.LIST_TYPE) {
    const innerType = toTypeScriptType(typeNode.type)
    return {
      type: `Array<${innerType.type}>`,
      isOptional: true,
    }
  }

  if (typeNode.kind === Kind.NAMED_TYPE) {
    const scalarConfig = BUILTIN_SCALAR_MAP.get(typeNode.name.value)

    return {
      type: scalarConfig?.type ?? typeNode.name.value,
      isOptional: true,
    }
  }

  throw new Error(`Unsupported type node kind: ${typeNode.kind}`)
}

function printTypeNode (typeNode) {
  if (typeNode.kind === Kind.NON_NULL_TYPE) {
    return `${printTypeNode(typeNode.type)}!`
  }

  if (typeNode.kind === Kind.LIST_TYPE) {
    return `[${printTypeNode(typeNode.type)}]`
  }

  return typeNode.name.value
}
