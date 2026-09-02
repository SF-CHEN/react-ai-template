/**
 * [INPUT]: 依赖 load-swagger.cjs 提供的 OpenAPI 归一化结果、Node.js 文件系统和当前项目 API 目录约定
 * [OUTPUT]: 对外生成 src/api/generated 下的 API 函数、类型、枚举和下拉选项
 * [POS]: script 层的 API 代码生成器，把 Swagger/OpenAPI 转换为当前 React 模板可直接使用的 TypeScript 代码
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-02 08:40:00
 */
const fs = require('node:fs')
const path = require('node:path')
const { ensureDir, loadSwagger } = require('./load-swagger.cjs')

const OUTPUT_DIR = path.resolve(__dirname, '../src/api/generated')
const GENERATED_START = '/* <generated> */'
const GENERATED_END = '/* </generated> */'
const HTTP_METHODS = new Set(['get', 'post', 'put', 'delete', 'patch'])
const VERSION_SEGMENTS = new Set(['api', 'v1', 'v2', 'v3'])

function toKebabCase(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function toCamelCase(value) {
  return String(value || '').replace(/[-_](\w)/g, (_, char) => char.toUpperCase())
}

function toPascalCase(value) {
  const camel = toCamelCase(value)
  return camel ? camel.charAt(0).toUpperCase() + camel.slice(1) : ''
}

function moduleNameFromUrl(url) {
  const segments = url.split('/').filter(Boolean)
  while (segments.length > 1 && VERSION_SEGMENTS.has(segments[0].toLowerCase())) {
    segments.shift()
  }
  return toKebabCase(segments[0] || 'common') || 'common'
}

function actionNameFromUrl(url, method) {
  const segments = url
    .split('/')
    .filter(Boolean)
    .filter((segment) => !/^\{.+\}$/.test(segment))

  let action = toCamelCase(segments.at(-1) || method)
  const methodName = method.toLowerCase()

  if (/\{[^}]+\}/.test(url) && !action.toLowerCase().startsWith(methodName)) {
    action = methodName + action.charAt(0).toUpperCase() + action.slice(1)
  }

  return action.replace(/[^\w$]/g, '') || methodName
}

function buildFunctionName(url, method, moduleName) {
  const action = actionNameFromUrl(url, method)
  const moduleSuffix = toPascalCase(moduleName)
  return action.toLowerCase().includes(moduleSuffix.toLowerCase())
    ? action
    : `${action}${moduleSuffix}`
}

function resolveTsType(schema) {
  if (!schema) return 'unknown'
  if (schema.$ref) return schema.$ref.split('/').pop()
  if (schema.enum) return schema.enum.map((value) => JSON.stringify(value)).join(' | ')
  if (schema.type === 'array') return `${resolveTsType(schema.items)}[]`
  if (schema.type === 'integer' || schema.type === 'number') return 'number'
  if (schema.type === 'boolean') return 'boolean'
  if (schema.type === 'string') return 'string'
  if (schema.type === 'object') {
    return schema.additionalProperties
      ? `Record<string, ${resolveTsType(schema.additionalProperties)}>`
      : 'Record<string, unknown>'
  }
  if (schema.allOf?.length) return schema.allOf.map(resolveTsType).join(' & ')
  if (schema.oneOf?.length) return schema.oneOf.map(resolveTsType).join(' | ')
  if (schema.anyOf?.length) return schema.anyOf.map(resolveTsType).join(' | ')
  return 'unknown'
}

function extractRequestSchema(requestBody) {
  const content = requestBody?.content
  if (!content) return null
  const preferred = ['application/json', '*/*', 'multipart/form-data', 'application/x-www-form-urlencoded']
  for (const mediaType of preferred) {
    if (content[mediaType]?.schema) return content[mediaType].schema
  }
  return Object.values(content).find((item) => item?.schema)?.schema || null
}

function successResponseSchema(operation) {
  const response = operation.responses?.['200'] || operation.responses?.['201'] || operation.responses?.['204']
  if (!response?.content) return null
  return response.content['application/json']?.schema || response.content['*/*']?.schema || null
}

function isResultWrapper(name) {
  return name === 'Result' || /^Result[A-Z]/.test(name)
}

function unwrapResponse(schema, schemas) {
  if (!schema) return 'void'
  if (!schema.$ref) return resolveTsType(schema)

  const refName = schema.$ref.split('/').pop()
  if (!isResultWrapper(refName)) return refName

  const dataSchema = schemas[refName]?.properties?.data
  if (!dataSchema) return 'void'
  if (!dataSchema.$ref && !dataSchema.type && !dataSchema.items && !dataSchema.properties) return 'void'
  if (dataSchema.type === 'object' && !dataSchema.$ref && !dataSchema.properties && !dataSchema.additionalProperties) return 'void'
  return resolveTsType(dataSchema)
}

function collectRefs(schema, schemas, result = new Set()) {
  if (!schema || typeof schema !== 'object') return result

  if (schema.$ref) {
    const name = schema.$ref.split('/').pop()
    if (!isResultWrapper(name) && !result.has(name)) {
      result.add(name)
      collectRefs(schemas[name], schemas, result)
    } else if (isResultWrapper(name)) {
      collectRefs(schemas[name]?.properties?.data, schemas, result)
    }
    return result
  }

  if (schema.items) collectRefs(schema.items, schemas, result)
  if (schema.properties) Object.values(schema.properties).forEach((item) => collectRefs(item, schemas, result))
  if (schema.allOf) schema.allOf.forEach((item) => collectRefs(item, schemas, result))
  if (schema.oneOf) schema.oneOf.forEach((item) => collectRefs(item, schemas, result))
  if (schema.anyOf) schema.anyOf.forEach((item) => collectRefs(item, schemas, result))
  return result
}

function safeDescription(value) {
  return String(value || '').replace(/\*\//g, '* /').replace(/\s+/g, ' ').trim()
}

function propDescription(name, schema) {
  if (schema?.description) return safeDescription(schema.description)
  const defaults = {
    id: '主键 ID',
    name: '名称',
    total: '总条数',
    records: '数据列表',
    current: '当前页码',
    size: '每页条数',
    createdAt: '创建时间',
    updatedAt: '更新时间',
  }
  return defaults[name] || ''
}

function generateType(name, schema) {
  if (!schema) return ''
  if (schema.enum) {
    return `export type ${name} = ${resolveTsType(schema)}`
  }

  const required = new Set(schema.required || [])
  const lines = []
  if (schema.description) lines.push(`/** ${safeDescription(schema.description)} */`)
  lines.push(`export interface ${name} {`)

  for (const [propName, propSchema] of Object.entries(schema.properties || {})) {
    const optional = required.has(propName) ? '' : '?'
    const description = propDescription(propName, propSchema)
    const comment = description ? ` /** ${description} */` : ''
    lines.push(`  ${propName}${optional}: ${resolveTsType(propSchema)}${comment}`)
  }

  lines.push('}')
  return lines.join('\n')
}

function queryParamsType(functionName, queryParams) {
  if (!queryParams.length) return null
  const name = `${toPascalCase(functionName)}Params`
  const lines = [`export interface ${name} {`]
  for (const param of queryParams) {
    const optional = param.required ? '' : '?'
    const description = param.description ? ` /** ${safeDescription(param.description)} */` : ''
    lines.push(`  ${param.name}${optional}: ${resolveTsType(param.schema)}${description}`)
  }
  lines.push('}')
  return { name, code: lines.join('\n') }
}

function buildUrlTemplate(url, pathParams) {
  let result = url
  for (const param of pathParams) {
    result = result.replace(`{${param.name}}`, `\${${param.name}}`)
  }
  return result
}

function generateFunction(url, method, operation, moduleName, schemas, context) {
  const functionName = buildFunctionName(url, method, moduleName)
  const pathParams = (operation.parameters || []).filter((param) => param.in === 'path')
  const queryParams = (operation.parameters || []).filter((param) => param.in === 'query')
  const requestSchema = extractRequestSchema(operation.requestBody)
  const responseSchema = successResponseSchema(operation)
  const returnType = unwrapResponse(responseSchema, schemas)
  const args = []

  for (const param of pathParams) {
    args.push(`${param.name}: ${resolveTsType(param.schema)}`)
    collectRefs(param.schema, schemas, context.schemaNames)
  }

  if (requestSchema) {
    const bodyType = resolveTsType(requestSchema)
    args.push(`data: ${bodyType}`)
    collectRefs(requestSchema, schemas, context.schemaNames)
  }

  const paramsType = queryParamsType(functionName, queryParams)
  if (paramsType) {
    context.paramTypes.set(paramsType.name, paramsType.code)
    args.push(`params: ${paramsType.name}`)
    queryParams.forEach((param) => collectRefs(param.schema, schemas, context.schemaNames))
  }

  collectRefs(responseSchema, schemas, context.schemaNames)

  const configLines = [`    url: \`${buildUrlTemplate(url, pathParams)}\``, `    method: '${method.toUpperCase()}'`]
  if (requestSchema) configLines.push('    data')
  if (queryParams.length) configLines.push('    params')

  const summary = safeDescription(operation.summary || '')
  const comment = summary ? `// ${summary}\n` : ''
  return `${comment}export function ${functionName}(${args.join(', ')}): Promise<${returnType}> {\n  return requestData<${returnType}>({\n${configLines.join(',\n')}\n  })\n}`
}

function customSection(existing) {
  const index = existing.indexOf(GENERATED_END)
  if (index < 0) return ''
  return existing.slice(index + GENERATED_END.length).trimStart()
}

function generatedFile({ imports = [], body, existing = '', customHint }) {
  const custom = existing ? customSection(existing) : ''
  return [
    '/** 由 script/generate-api.cjs 维护；生成区域请勿手改；生成文件豁免 L3。 */',
    '',
    ...imports,
    imports.length ? '' : null,
    GENERATED_START,
    body.trim(),
    GENERATED_END,
    '',
    custom || customHint,
    '',
  ]
    .filter((item) => item !== null && item !== undefined)
    .join('\n')
}

function writeModule(moduleName, context, schemas) {
  const typeFile = path.join(OUTPUT_DIR, `${moduleName}.types.ts`)
  const apiFile = path.join(OUTPUT_DIR, `${moduleName}.ts`)

  const typeBlocks = [...context.schemaNames]
    .sort()
    .map((name) => generateType(name, schemas[name]))
    .filter(Boolean)

  for (const [, code] of [...context.paramTypes].sort(([a], [b]) => a.localeCompare(b))) {
    typeBlocks.push(code)
  }

  fs.writeFileSync(
    typeFile,
    `/** 由 script/generate-api.cjs 自动生成，请勿手动修改；生成文件豁免 L3。 */\n\n${typeBlocks.join('\n\n')}\n`,
    'utf-8',
  )

  const importedTypes = new Set([...context.schemaNames, ...context.paramTypes.keys()])
  const imports = []
  if (importedTypes.size) {
    imports.push(`import type { ${[...importedTypes].sort().join(', ')} } from './${moduleName}.types'`)
  }
  imports.push("import { requestData } from '@/api/request'")

  const existing = fs.existsSync(apiFile) ? fs.readFileSync(apiFile, 'utf-8') : ''
  fs.writeFileSync(
    apiFile,
    generatedFile({
      imports,
      body: context.functions.join('\n\n'),
      existing,
      customHint: '// 自定义 API 包装请写在此下方，重新生成时不会覆盖',
    }),
    'utf-8',
  )

  console.log(`✅ ${moduleName}: API + 类型`)
}

function collectEnumDefinitions(schemas) {
  const result = []
  const seen = new Set()

  for (const [schemaName, schema] of Object.entries(schemas)) {
    for (const [propName, propSchema] of Object.entries(schema.properties || {})) {
      if (!Array.isArray(propSchema.enum) || !propSchema.enum.length) continue

      // 同一字段名 + 同一组值通常表示同一业务枚举，避免在多个 DTO 中重复生成
      const signature = `${propName}\0${propSchema.enum.map(String).sort().join('\0')}`
      if (seen.has(signature)) continue
      seen.add(signature)

      const name = `${schemaName}${toPascalCase(propName)}`
      result.push({
        name,
        constName: `${name}Enum`,
        values: propSchema.enum,
        description: safeDescription(propSchema.description || `${schemaName}.${propName}`),
      })
    }
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
}

function writeEnumFiles(schemas) {
  const definitions = collectEnumDefinitions(schemas)
  const enumBody = definitions
    .map((item) => {
      const entries = item.values.map((value) => `  ${String(value).replace(/[^\w$]/g, '_')}: ${JSON.stringify(value)},`).join('\n')
      return `/** ${item.description} */\nexport const ${item.constName} = {\n${entries}\n} as const\n\nexport type ${item.name} = (typeof ${item.constName})[keyof typeof ${item.constName}]`
    })
    .join('\n\n')

  const enumsFile = path.join(OUTPUT_DIR, 'enums.ts')
  const existingEnums = fs.existsSync(enumsFile) ? fs.readFileSync(enumsFile, 'utf-8') : ''
  fs.writeFileSync(
    enumsFile,
    generatedFile({
      body: enumBody || '// 当前 OpenAPI 未发现可生成的枚举字段',
      existing: existingEnums,
      customHint: '// 自定义枚举请写在此下方，重新生成时不会覆盖',
    }),
    'utf-8',
  )

  const optionImports = definitions.length
    ? [`import { ${definitions.map((item) => item.constName).join(', ')} } from './enums'`]
    : []
  const optionBody = definitions
    .map((item) => {
      const optionsName = `${item.name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase()}_OPTIONS`
      const rows = item.values
        .map((value) => {
          const key = String(value).replace(/[^\w$]/g, '_')
          return `  { label: ${JSON.stringify(String(value))}, value: ${item.constName}.${key} },`
        })
        .join('\n')
      return `export const ${optionsName} = [\n${rows}\n] as const`
    })
    .join('\n\n')

  const optionsFile = path.join(OUTPUT_DIR, 'options.ts')
  const existingOptions = fs.existsSync(optionsFile) ? fs.readFileSync(optionsFile, 'utf-8') : ''
  fs.writeFileSync(
    optionsFile,
    generatedFile({
      imports: optionImports,
      body: optionBody || '// 当前 OpenAPI 未发现可生成的下拉选项',
      existing: existingOptions,
      customHint: '// 需要中文 label 或业务专用选项时，在此处新增自定义 options',
    }),
    'utf-8',
  )
}

async function main() {
  const { schema, version } = await loadSwagger()
  const schemas = schema.components?.schemas || {}
  const modules = new Map()

  for (const [url, pathItem] of Object.entries(schema.paths || {})) {
    const moduleName = moduleNameFromUrl(url)
    if (!modules.has(moduleName)) {
      modules.set(moduleName, {
        functions: [],
        schemaNames: new Set(),
        paramTypes: new Map(),
      })
    }

    const context = modules.get(moduleName)
    for (const [method, operation] of Object.entries(pathItem || {})) {
      if (!HTTP_METHODS.has(method.toLowerCase()) || !operation || typeof operation !== 'object') continue
      context.functions.push(generateFunction(url, method, operation, moduleName, schemas, context))
    }
  }

  ensureDir(OUTPUT_DIR)
  for (const [moduleName, context] of modules) {
    writeModule(moduleName, context, schemas)
  }
  writeEnumFiles(schemas)

  console.log(`🎉 API 生成完成（${version === 'v2' ? 'Swagger 2.0' : 'OpenAPI 3.x'}）`)
}

main().catch((error) => {
  console.error(`❌ API 生成失败: ${error.message}`)
  process.exitCode = 1
})
