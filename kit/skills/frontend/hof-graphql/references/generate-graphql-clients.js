#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { parse, Kind } from 'graphql'

const DEFAULT_OUTPUT_PATH = 'app/graphql/client'
const ROOT_OPERATION_TYPES = new Map([
  ['Query', 'query'],
  ['Mutation', 'mutation'],
])

const DEFAULT_SELECTION_DEPTH = 10
const OPERATION_DIRECTORY_NAMES = new Map([
  ['query', 'queries'],
  ['mutation', 'mutations'],
])

const BUILTIN_SCALAR_NAMES = new Set([
  'Int',
  'Float',
  'String',
  'Boolean',
  'ID',
])

main()

function main () {
  const {
    selectionDepth,
    forceOverwrite,
    inputPaths,
    operationNames,
    outputPath,
  } = parseArguments(process.argv.slice(2))
  const schemaFilePaths = collectSchemaFilePaths(inputPaths)
  const schema = buildSchemaIndex(schemaFilePaths)
  const writeSummary = {
    createdClientCount: 0,
    skippedClientCount: 0,
  }

  fs.mkdirSync(outputPath, { recursive: true })

  generateOperationClients({
    forceOverwrite,
    operationNames,
    selectionDepth,
    schema,
    outputPath,
    operationTypeName: 'Query',
    writeSummary,
  })

  generateOperationClients({
    forceOverwrite,
    operationNames,
    selectionDepth,
    schema,
    outputPath,
    operationTypeName: 'Mutation',
    writeSummary,
  })

  process.stdout.write(`Generated ${writeSummary.createdClientCount} GraphQL client(s) in ${outputPath} from ${schemaFilePaths.length} schema file(s).`)

  if (writeSummary.skippedClientCount > 0) {
    process.stdout.write(` Skipped ${writeSummary.skippedClientCount} existing client(s). Use -f to overwrite.`)
  }

  process.stdout.write('\n')
}

function parseArguments (argv) {
  let forceOverwrite = false
  const inputPaths = []
  const operationNames = new Set()
  let outputPath = DEFAULT_OUTPUT_PATH
  let selectionDepth = DEFAULT_SELECTION_DEPTH

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]

    if (argument === '--force' || argument === '-f') {
      forceOverwrite = true
      continue
    }

    if (argument === '--out' || argument === '-o') {
      outputPath = argv[index + 1]

      if (!outputPath) {
        exitWithUsage('Missing value for --out.')
      }

      index += 1
      continue
    }

    if (argument === '--depth' || argument === '-d') {
      const rawSelectionDepth = argv[index + 1]

      if (!rawSelectionDepth) {
        exitWithUsage('Missing value for --depth.')
      }

      if (!/^\d+$/.test(rawSelectionDepth)) {
        exitWithUsage(`Invalid value for --depth: ${rawSelectionDepth}. Expected a non-negative integer.`)
      }

      selectionDepth = Number.parseInt(rawSelectionDepth, 10)
      index += 1
      continue
    }

    if (argument === '--target' || argument === '-t') {
      const startIndex = index + 1

      while (argv[index + 1] && !argv[index + 1].startsWith('-')) {
        operationNames.add(argv[index + 1])
        index += 1
      }

      if (index < startIndex) {
        exitWithUsage('Missing value for --target.')
      }

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

  return {
    selectionDepth,
    forceOverwrite,
    inputPaths,
    operationNames,
    outputPath: path.resolve(outputPath),
  }
}

function exitWithUsage (message) {
  const usage = [
    message,
    '',
    'Usage:',
    '  hectici gqlclients <schema-path ...> [--target <name ...>] [--out <output-directory>] [--depth <number>] [--force]',
    '',
    'Examples:',
    '  hectici gqlclients server/graphql/schemas',
    '  hectici gqlclients server/graphql/schemas/customer --out app/graphql/client',
    '  hectici gqlclients server/graphql/schemas/customer --depth 10 --out app/graphql/client',
    '  hectici gqlclients server/graphql/schemas/customer --target user users --out app/graphql/client',
    '  hectici gqlclients server/graphql/schemas/customer --out app/graphql/client --force',
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

function buildSchemaIndex (schemaFilePaths) {
  const schema = {
    objectTypes: new Map(),
    inputTypes: new Map(),
    enumTypes: new Map(),
    scalarTypes: new Set(BUILTIN_SCALAR_NAMES),
  }

  for (const schemaFilePath of schemaFilePaths) {
    const schemaSource = fs.readFileSync(schemaFilePath, 'utf8')
    const parsedDocument = parse(schemaSource, { noLocation: true })

    for (const definition of parsedDocument.definitions) {
      if (definition.kind === Kind.SCALAR_TYPE_DEFINITION) {
        schema.scalarTypes.add(definition.name.value)
        continue
      }

      if (definition.kind === Kind.ENUM_TYPE_DEFINITION) {
        schema.enumTypes.set(definition.name.value, definition)
        continue
      }

      if (definition.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
        mergeObjectLikeDefinition(schema.inputTypes, definition)
        continue
      }

      if (definition.kind === Kind.OBJECT_TYPE_DEFINITION) {
        mergeObjectLikeDefinition(schema.objectTypes, definition)
      }
    }
  }

  return schema
}

function mergeObjectLikeDefinition (targetMap, definition) {
  const existingDefinition = targetMap.get(definition.name.value)

  if (!existingDefinition) {
    targetMap.set(definition.name.value, {
      ...definition,
      fields: [...(definition.fields ?? [])],
    })
    return
  }

  const existingFieldsByName = new Map(existingDefinition.fields.map((field) => [field.name.value, field]))

  for (const field of definition.fields ?? []) {
    const existingField = existingFieldsByName.get(field.name.value)

    if (!existingField) {
      existingDefinition.fields.push(field)
      existingFieldsByName.set(field.name.value, field)
      continue
    }

    if (printTypeNode(existingField.type) !== printTypeNode(field.type)) {
      throw new Error(`Field type mismatch for ${definition.name.value}.${field.name.value}.`)
    }
  }
}

function generateOperationClients ({
  forceOverwrite,
  operationNames,
  selectionDepth,
  schema,
  outputPath,
  operationTypeName,
  writeSummary,
}) {
  const operationType = schema.objectTypes.get(operationTypeName)

  if (!operationType) {
    return
  }

  const operationKind = ROOT_OPERATION_TYPES.get(operationTypeName)
  const operationRootDirectory = path.join(outputPath, OPERATION_DIRECTORY_NAMES.get(operationKind))

  fs.mkdirSync(operationRootDirectory, { recursive: true })

  for (const operationField of operationType.fields ?? []) {
    if (operationNames.size > 0 && !operationNames.has(operationField.name.value)) {
      continue
    }

    const operationMetadata = buildOperationMetadata({
      operationKind,
      operationFieldName: operationField.name.value,
    })

    const operationDirectoryPath = path.join(operationRootDirectory, operationMetadata.directoryName)

    fs.mkdirSync(operationDirectoryPath, { recursive: true })

    const payloadFilePath = path.join(
      operationDirectoryPath,
      `${operationMetadata.classBaseName}${operationMetadata.classSuffix}GraphqlPayload.js`,
    )
    const capsuleFilePath = path.join(
      operationDirectoryPath,
      `${operationMetadata.classBaseName}${operationMetadata.classSuffix}GraphqlCapsule.js`,
    )
    const launcherFilePath = path.join(
      operationDirectoryPath,
      `${operationMetadata.classBaseName}${operationMetadata.classSuffix}GraphqlLauncher.js`,
    )

    const wasWritten = writeGeneratedFile(payloadFilePath, renderPayloadFile({
      selectionDepth,
      schema,
      operationField,
      operationMetadata,
    }), {
      forceOverwrite,
    })
    writeGeneratedFile(capsuleFilePath, renderCapsuleFile({
      schema,
      operationField,
      operationMetadata,
    }), {
      forceOverwrite,
    })
    writeGeneratedFile(launcherFilePath, renderLauncherFile({
      operationMetadata,
    }), {
      forceOverwrite,
    })

    if (wasWritten) {
      writeSummary.createdClientCount += 1
      continue
    }

    writeSummary.skippedClientCount += 1
  }
}

function writeGeneratedFile (filePath, content, {
  forceOverwrite,
}) {
  if (!forceOverwrite && fs.existsSync(filePath)) {
    return false
  }

  fs.writeFileSync(filePath, content)
  return true
}

function buildOperationMetadata ({
  operationKind,
  operationFieldName,
}) {
  const normalizedFieldName = operationKind === 'mutation'
    ? singularizeTrailingToken(operationFieldName)
    : operationFieldName

  const classBaseName = toPascalCase(normalizedFieldName)
  const classSuffix = operationKind === 'query'
    ? 'Query'
    : 'Mutation'

  return {
    operationKind,
    originalFieldName: operationFieldName,
    normalizedFieldName,
    classBaseName,
    classSuffix,
    operationName: `${classBaseName}${classSuffix}`,
    directoryName: toCamelCase(normalizedFieldName),
  }
}

function renderPayloadFile ({
  selectionDepth,
  schema,
  operationField,
  operationMetadata,
}) {
  const requestVariablesTypeName = `${operationMetadata.operationName}RequestVariables`
  const variableDefinitions = renderOperationVariableDefinitions(operationField.arguments ?? [])
  const selectionSet = renderFieldSelection({
    schema,
    fieldName: operationMetadata.originalFieldName,
    typeNode: operationField.type,
    depth: selectionDepth,
    ancestry: [],
    indentLevel: 4,
    argumentDefinitions: operationField.arguments ?? [],
  })
  const requestVariablesTypedef = renderRequestVariablesTypedef({
    requestVariablesTypeName,
    operationField,
  })

  return [
    "import BaseAppGraphqlPayload from '~/app/graphql/client/BaseAppGraphqlPayload.js'",
    '',
    '/**',
    ` * ${operationMetadata.operationName.replace(/(Query|Mutation)$/, '')} ${operationMetadata.operationKind} payload.`,
    ' *',
    ` * @extends {BaseAppGraphqlPayload<${requestVariablesTypeName}>}`,
    ' */',
    `export default class ${operationMetadata.operationName}GraphqlPayload extends BaseAppGraphqlPayload {`,
    '  /** @override */',
    '  static get document () {',
    '    return /* GraphQL */ `',
    `      ${operationMetadata.operationKind} ${operationMetadata.operationName}${variableDefinitions} {`,
    selectionSet,
    '      }',
    '    `',
    '  }',
    '}',
    '',
    '/**',
    requestVariablesTypedef,
    ' */',
    '',
  ].join('\n')
}

function renderCapsuleFile ({
  schema,
  operationField,
  operationMetadata,
}) {
  const responseContentTypeName = `${operationMetadata.operationName}ResponseContent`
  const responseTypeName = getNamedTypeName(operationField.type)
  const responseType = schema.objectTypes.get(responseTypeName)
  const rootGetterName = `${operationMetadata.originalFieldName}ValueHash`
  const topLevelGetters = renderTopLevelResultGetters({
    schema,
    responseType,
    rootGetterName,
  })

  return [
    "import BaseAppGraphqlCapsule from '~/app/graphql/client/BaseAppGraphqlCapsule.js'",
    '',
    '/**',
    ` * ${operationMetadata.operationName.replace(/(Query|Mutation)$/, '')} ${operationMetadata.operationKind} graphql capsule.`,
    ' *',
    ` * @extends {BaseAppGraphqlCapsule<${responseContentTypeName}>}`,
    ' */',
    `export default class ${operationMetadata.operationName}GraphqlCapsule extends BaseAppGraphqlCapsule {`,
    '  /**',
    `   * get: ${rootGetterName}`,
    '   *',
    `   * @returns {schema.graphql.${responseTypeName} | null}`,
    '   */',
    `  get ${rootGetterName} () {`,
    '    return this.content',
    `      ?.${operationMetadata.originalFieldName}`,
    '      ?? null',
    '  }',
    topLevelGetters ? '' : null,
    topLevelGetters,
    '}',
    '',
    '/**',
    ' * @typedef {{',
    ` *   ${operationMetadata.originalFieldName}: schema.graphql.${responseTypeName}`,
    ` * }} ${responseContentTypeName}`,
    ' */',
    '',
  ]
    .filter((line) => line !== null)
    .join('\n')
}

function renderTopLevelResultGetters ({
  schema,
  responseType,
  rootGetterName,
}) {
  if (!responseType) {
    return ''
  }

  const getters = (responseType.fields ?? []).map((field) => renderTopLevelGetter({
    schema,
    field,
    rootGetterName,
  }))

  return getters.join('\n\n')
}

function renderTopLevelGetter ({
  schema,
  field,
  rootGetterName,
}) {
  const baseReturnType = toJsdocType({
    schema,
    typeNode: field.type,
  })
  const isArrayFallback = isListType(field.type)
  const returnType = isArrayFallback
    ? baseReturnType
    : `${baseReturnType} | null`
  const defaultValue = isArrayFallback
    ? '[]'
    : 'null'

  return [
    '  /**',
    `   * get: ${field.name.value}`,
    '   *',
    `   * @returns {${returnType}}`,
    '   */',
    `  get ${field.name.value} () {`,
    `    return this.${rootGetterName}`,
    `      ?.${field.name.value}`,
    `      ?? ${defaultValue}`,
    '  }',
  ].join('\n')
}

function renderLauncherFile ({
  operationMetadata,
}) {
  return [
    "import BaseAppGraphqlLauncher from '~/app/graphql/client/BaseAppGraphqlLauncher.js'",
    '',
    `import ${operationMetadata.operationName}GraphqlPayload from './${operationMetadata.operationName}GraphqlPayload.js'`,
    `import ${operationMetadata.operationName}GraphqlCapsule from './${operationMetadata.operationName}GraphqlCapsule.js'`,
    '',
    '/**',
    ` * ${operationMetadata.operationName.replace(/(Query|Mutation)$/, '')} ${operationMetadata.operationKind} graphql launcher.`,
    ' *',
    ' * @extends {BaseAppGraphqlLauncher}',
    ' */',
    `export default class ${operationMetadata.operationName}GraphqlLauncher extends BaseAppGraphqlLauncher {`,
    '  /** @override */',
    '  static get Payload () {',
    `    return ${operationMetadata.operationName}GraphqlPayload`,
    '  }',
    '',
    '  /** @override */',
    '  static get Capsule () {',
    `    return ${operationMetadata.operationName}GraphqlCapsule`,
    '  }',
    '}',
    '',
  ].join('\n')
}

function renderOperationVariableDefinitions (argumentDefinitions) {
  if (argumentDefinitions.length === 0) {
    return ''
  }

  const variableDefinitions = argumentDefinitions
    .map((argument) => `$${argument.name.value}: ${printTypeNode(argument.type)}`)
    .join(', ')

  return ` (${variableDefinitions})`
}

function renderRequestVariablesTypedef ({
  requestVariablesTypeName,
  operationField,
}) {
  const argumentDefinitions = operationField.arguments ?? []

  if (argumentDefinitions.length === 0) {
    return ` * @typedef {{}} ${requestVariablesTypeName}`
  }

  return [
    ' * @typedef {{',
    ...argumentDefinitions.map((argument) => {
      const optionalMarker = isNonNullType(argument.type)
        ? ''
        : '?'

      return ` *   ${argument.name.value}${optionalMarker}: schema.graphql.${getNamedTypeName(argument.type)}`
    }),
    ` * }} ${requestVariablesTypeName}`,
  ].join('\n')
}

function renderFieldSelection ({
  schema,
  fieldName,
  typeNode,
  depth,
  ancestry,
  indentLevel,
  argumentDefinitions = [],
}) {
  const namedTypeName = getNamedTypeName(typeNode)
  const indent = '  '.repeat(indentLevel)
  const argumentSelection = renderArgumentSelection(argumentDefinitions)

  if (isLeafType(schema, namedTypeName)) {
    return `${indent}${fieldName}${argumentSelection}`
  }

  const nestedFields = renderNestedSelections({
    schema,
    typeName: namedTypeName,
    depth,
    ancestry,
    indentLevel: indentLevel + 1,
  })

  if (!nestedFields.length) {
    return `${indent}${fieldName}${argumentSelection}`
  }

  return [
    `${indent}${fieldName}${argumentSelection} {`,
    ...nestedFields,
    `${indent}}`,
  ].join('\n')
}

function renderNestedSelections ({
  schema,
  typeName,
  depth,
  ancestry,
  indentLevel,
}) {
  const objectType = schema.objectTypes.get(typeName)

  if (!objectType) {
    return []
  }

  const nextAncestry = [...ancestry, typeName]

  return (objectType.fields ?? [])
    .filter((field) => shouldIncludeField({
      schema,
      field,
      depth,
      ancestry: nextAncestry,
    }))
    .map((field) => renderFieldSelection({
      schema,
      fieldName: field.name.value,
      typeNode: field.type,
      depth: depth - 1,
      ancestry: nextAncestry,
      indentLevel,
      argumentDefinitions: field.arguments ?? [],
    }))
}

function shouldIncludeField ({
  schema,
  field,
  depth,
  ancestry,
}) {
  const namedTypeName = getNamedTypeName(field.type)

  if (isLeafType(schema, namedTypeName)) {
    return true
  }

  if (depth <= 0) {
    return false
  }

  return !ancestry.includes(namedTypeName)
}

function renderArgumentSelection (argumentDefinitions) {
  if (argumentDefinitions.length === 0) {
    return ''
  }

  const argumentSelection = argumentDefinitions
    .map((argument) => `${argument.name.value}: $${argument.name.value}`)
    .join(', ')

  return ` (${argumentSelection})`
}

function isLeafType (schema, typeName) {
  return schema.scalarTypes.has(typeName) || schema.enumTypes.has(typeName)
}

function getNamedTypeName (typeNode) {
  if (typeNode.kind === Kind.NON_NULL_TYPE || typeNode.kind === Kind.LIST_TYPE) {
    return getNamedTypeName(typeNode.type)
  }

  return typeNode.name.value
}

function isNonNullType (typeNode) {
  return typeNode.kind === Kind.NON_NULL_TYPE
}

function isListType (typeNode) {
  if (typeNode.kind === Kind.NON_NULL_TYPE) {
    return isListType(typeNode.type)
  }

  return typeNode.kind === Kind.LIST_TYPE
}

function toJsdocType ({
  schema,
  typeNode,
}) {
  if (typeNode.kind === Kind.NON_NULL_TYPE) {
    return toJsdocType({
      schema,
      typeNode: typeNode.type,
    })
  }

  if (typeNode.kind === Kind.LIST_TYPE) {
    return `Array<${toJsdocType({
      schema,
      typeNode: typeNode.type,
    })}>`
  }

  if (BUILTIN_SCALAR_NAMES.has(typeNode.name.value)) {
    return builtinScalarToJsdocType(typeNode.name.value)
  }

  return `schema.graphql.${typeNode.name.value}`
}

function builtinScalarToJsdocType (scalarName) {
  if (scalarName === 'Int' || scalarName === 'Float') {
    return 'number'
  }

  if (scalarName === 'Boolean') {
    return 'boolean'
  }

  return 'string'
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

function singularizeTrailingToken (name) {
  const tokens = splitNameIntoTokens(name)

  if (tokens.length === 0) {
    return name
  }

  const nextTokens = [...tokens]
  const lastToken = nextTokens.at(-1)

  nextTokens[nextTokens.length - 1] = singularizeToken(lastToken)

  return toCamelCaseFromTokens(nextTokens)
}

function singularizeToken (token) {
  if (!token || token.length <= 1) {
    return token
  }

  if (token.endsWith('ies')) {
    return `${token.slice(0, -3)}y`
  }

  if (token.endsWith('sses')) {
    return token.slice(0, -2)
  }

  if (token.endsWith('ses')) {
    return token.slice(0, -2)
  }

  if (token.endsWith('s') && !token.endsWith('ss')) {
    return token.slice(0, -1)
  }

  return token
}

function toPascalCase (value) {
  return splitNameIntoTokens(value)
    .map((token) => `${token.charAt(0).toUpperCase()}${token.slice(1)}`)
    .join('')
}

function toCamelCase (value) {
  return toCamelCaseFromTokens(splitNameIntoTokens(value))
}

function toCamelCaseFromTokens (tokens) {
  return tokens
    .map((token, index) => {
      if (index === 0) {
        return token
      }

      return `${token.charAt(0).toUpperCase()}${token.slice(1)}`
    })
    .join('')
}

function splitNameIntoTokens (value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toLowerCase() + token.slice(1))
}
