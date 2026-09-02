/**
 * [INPUT]: 依赖 load-swagger.cjs 的标准化 OpenAPI schema，以及 src/api/request.ts 的 requestData 约定
 * [OUTPUT]: 生成 src/api/generated 下的 API 函数、DTO/参数类型，以及 meta 下的枚举和下拉选项
 * [POS]: script 的 API 代码生成器，将后端 OpenAPI 描述转换为当前 React 模板可直接使用的 TypeScript API
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md、react-data、typescript 与 code-comments Skill
 * [TIME]: 2026-09-02 02:28:27
 */
const fs = require('node:fs')
const path = require('node:path')
const { ensureDir, loadSwagger } = require('./load-swagger.cjs')

const OUTPUT_DIR = path.resolve(__dirname, '../src/api/generated')
const TYPES_DIR = path.join(OUTPUT_DIR, 'types')
const META_DIR = path.join(OUTPUT_DIR, 'meta')
const HTTP_METHODS = new Set(['get', 'post', 'put', 'delete', 'patch'])
const MODULE_PREFIXES = new Set(['api', 'temp', 'v1', 'v2', 'v3'])

function formatTime(date = new Date()) {
  const pad = value => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function generatedHeader({ input, output, pos }) {
  return `/**
 * [INPUT]: ${input}
 * [OUTPUT]: ${output}
 * [POS]: ${pos}
 * [PROTOCOL]: 自动生成文件；修改 OpenAPI 或 script 生成器后重新生成，不直接手改
 * [TIME]: ${formatTime()}
 */`
}

function toKebabCase(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^A-Za-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase()
}

function toPascalCase(value) {
  return String(value || '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function toCamelCase(value) {
  const pascal = toPascalCase(value)
  return pascal ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : 'request'
}

function refName(schema) {
  return schema?.$ref?.split('/').pop() || null
}

function tsString(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function resolveType(schema) {
  if (!schema) return 'unknown'
  if (schema.$ref) return refName(schema)
  if (schema.enum?.length) return schema.enum.map(tsString).join(' | ')
  if (schema.oneOf?.length) return schema.oneOf.map(resolveType).join(' | ')
  if (schema.anyOf?.length) return schema.anyOf.map(resolveType).join(' | ')
  if (schema.allOf?.length) return schema.allOf.map(resolveType).join(' & ')
  if (schema.type === 'array') return `${resolveType(schema.items)}[]`
  if (schema.type === 'integer' || schema.type === 'number') return 'number'
  if (schema.type === 'boolean') return 'boolean'
  if (schema.type === 'string') return 'string'
  if (schema.type === 'object') {
    return schema.additionalProperties ? `Record<string, ${resolveType(schema.additionalProperties)}>` : 'Record<string, unknown>'
  }
  return 'unknown'
}

function collectRefs(schema, schemas, result = new Set()) {
  if (!schema || typeof schema !== 'object') return result

  const name = refName(schema)
  if (name && !result.has(name)) {
    result.add(name)
    collectRefs(schemas[name], schemas, result)
  }

  for (const value of Object.values(schema)) {
    if (Array.isArray(value)) value.forEach(item => collectRefs(item, schemas, result))
    else if (value && typeof value === 'object') collectRefs(value, schemas, result)
  }
  return result
}

function moduleNameFromUrl(url) {
  const segments = url.split('/').filter(Boolean)
  while (segments.length > 1 && MODULE_PREFIXES.has(segments[0].toLowerCase())) segments.shift()
  return toKebabCase(segments[0] || 'common') || 'common'
}

function actionName(operation, url, method, moduleName) {
  const suffix = toPascalCase(moduleName)
  const suffixCandidates = [suffix, suffix.endsWith('s') ? suffix.slice(0, -1) : suffix]
    .filter(Boolean)
    .map(item => item.toLowerCase())
  const hasModuleName = name => suffixCandidates.some(item => name.toLowerCase().includes(item))

  if (operation.operationId) {
    const normalized = toCamelCase(operation.operationId.replace(/Using(?:GET|POST|PUT|DELETE|PATCH)$/i, ''))
    return hasModuleName(normalized) ? normalized : `${normalized}${suffix}`
  }

  const segments = url.split('/').filter(Boolean).filter(segment => !/^\{.+\}$/.test(segment))
  const action = toCamelCase(segments.at(-1) || method)
  return hasModuleName(action) ? action : `${action}${suffix}`
}

function requestBodySchema(requestBody) {
  if (!requestBody?.content) return null
  return requestBody.content['application/json']?.schema
    || requestBody.content['*/*']?.schema
    || Object.values(requestBody.content).find(item => item?.schema)?.schema
    || null
}

function responseSchema(operation) {
  const response = operation.responses?.['200'] || operation.responses?.['201'] || operation.responses?.['204']
  if (!response?.content) return null
  return response.content['application/json']?.schema
    || response.content['*/*']?.schema
    || Object.values(response.content).find(item => item?.schema)?.schema
    || null
}

function propertyComment(description) {
  return description ? ` /** ${String(description).replace(/\*\//g, '* /')} */` : ''
}

function generateSchema(name, schema) {
  const description = schema?.description ? `/** ${String(schema.description).replace(/\*\//g, '* /')} */\n` : ''
  if (schema?.enum?.length) return `${description}export type ${name} = ${resolveType(schema)}`

  const required = new Set(schema?.required || [])
  const lines = [`${description}export interface ${name} {`]
  for (const [propertyName, property] of Object.entries(schema?.properties || {})) {
    const optional = required.has(propertyName) ? '' : '?'
    lines.push(`  ${propertyName}${optional}: ${resolveType(property)}${propertyComment(property.description)}`)
  }
  lines.push('}')
  return lines.join('\n')
}

function paramsInterfaceName(functionName) {
  return `${functionName.charAt(0).toUpperCase()}${functionName.slice(1)}Params`
}

function generateParamsInterface(name, queryParams, schemas, schemaNames) {
  const lines = [`/** ${name} 请求参数 */`, `export interface ${name} {`]
  for (const param of queryParams) {
    collectRefs(param.schema, schemas, schemaNames)
    lines.push(`  ${param.name}${param.required ? '' : '?'}: ${resolveType(param.schema)}${propertyComment(param.description)}`)
  }
  lines.push('}')
  return lines.join('\n')
}

function buildUrl(url, pathParams) {
  let result = url
  for (const param of pathParams) result = result.replace(`{${param.name}}`, `\${${param.name}}`)
  return result
}

function createModuleContext() {
  return {
    functions: [],
    params: new Map(),
    schemaNames: new Set(),
    usedTypes: new Set(),
  }
}

function generateOperation(url, method, operation, moduleName, schemas, context) {
  const functionName = actionName(operation, url, method, moduleName)
  const pathParams = (operation.parameters || []).filter(param => param.in === 'path')
  const queryParams = (operation.parameters || []).filter(param => param.in === 'query')
  const bodySchema = requestBodySchema(operation.requestBody)
  const resultSchema = responseSchema(operation)
  const args = []

  for (const param of pathParams) {
    collectRefs(param.schema, schemas, context.schemaNames)
    args.push(`${param.name}: ${resolveType(param.schema)}`)
  }

  if (bodySchema) {
    collectRefs(bodySchema, schemas, context.schemaNames)
    const bodyType = resolveType(bodySchema)
    if (/^[A-Z]/.test(bodyType)) context.usedTypes.add(bodyType.replace(/\[\]$/, ''))
    args.push(`data: ${bodyType}`)
  }

  if (queryParams.length) {
    const typeName = paramsInterfaceName(functionName)
    context.params.set(typeName, generateParamsInterface(typeName, queryParams, schemas, context.schemaNames))
    context.usedTypes.add(typeName)
    args.push(`params: ${typeName}`)
  }

  collectRefs(resultSchema, schemas, context.schemaNames)
  const returnType = resultSchema ? resolveType(resultSchema) : 'void'
  const returnRef = refName(resultSchema)
  if (returnRef) context.usedTypes.add(returnRef)

  const requestLines = [`    url: \`${buildUrl(url, pathParams)}\`,`, `    method: '${method.toUpperCase()}',`]
  if (bodySchema) requestLines.push('    data,')
  if (queryParams.length) requestLines.push('    params,')

  context.functions.push(`/** ${operation.summary || functionName} */
export function ${functionName}(${args.join(', ')}): Promise<${returnType}> {
  return requestData<${returnType}>({
${requestLines.join('\n')}
  })
}`)
}

function generateTypesFile(moduleName, context, schemas) {
  const blocks = [...context.schemaNames]
    .sort()
    .map(name => generateSchema(name, schemas[name]))
    .filter(Boolean)

  for (const code of context.params.values()) blocks.push(code)

  return `${generatedHeader({
    input: `由 OpenAPI 的 ${moduleName} schema、请求参数与响应模型生成`,
    output: `对外提供 ${moduleName} 模块的 DTO 与请求参数类型`,
    pos: 'src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束',
  })}\n\n${blocks.join('\n\n')}\n`
}

function generateApiFile(moduleName, context) {
  const imports = [...context.usedTypes]
    .filter(name => context.params.has(name) || context.schemaNames.has(name))
    .sort()
  let typeImport = ''
  if (imports.length) {
    const inline = `import type { ${imports.join(', ')} } from './types/${moduleName}'`
    typeImport = inline.length <= 100
      ? `${inline}\n`
      : `import type {\n${imports.map(name => `  ${name},`).join('\n')}\n} from './types/${moduleName}'\n`
  }

  return `${generatedHeader({
    input: `由 OpenAPI 的 ${moduleName} paths 生成，并依赖 @/api/request 的 requestData`,
    output: `对外提供 ${moduleName} 模块的类型安全 API 请求函数`,
    pos: 'src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用',
  })}\n${typeImport}import { requestData } from '@/api/request'\n\n${context.functions.join('\n\n')}\n`
}

function collectEnums(schemas) {
  const result = []
  const signatures = new Set()

  for (const [schemaName, schema] of Object.entries(schemas)) {
    for (const [propertyName, property] of Object.entries(schema?.properties || {})) {
      if (!property.enum?.length) continue

      // 相同值集合只生成一份，避免多个 DTO 重复产生完全一致的前端枚举
      const signature = property.enum.map(String).sort().join('\0')
      if (signatures.has(signature)) continue
      signatures.add(signature)

      result.push({
        typeName: `${schemaName}${toPascalCase(propertyName)}`,
        values: property.enum,
        description: property.description || `${schemaName}.${propertyName}`,
      })
    }
  }
  return result
}

function enumKey(value, index) {
  const key = String(value).replace(/[^A-Za-z0-9_$]/g, '_').replace(/^([0-9])/, '_$1')
  return key || `VALUE_${index + 1}`
}

function writeEnumFiles(schemas) {
  const enums = collectEnums(schemas)
  if (!enums.length) return

  const enumBlocks = enums.map(item => {
    const entries = item.values.map((value, index) => `  ${enumKey(value, index)}: ${tsString(value)},`).join('\n')
    return `/** ${item.description} */\nexport const ${item.typeName}Enum = {\n${entries}\n} as const\n\nexport type ${item.typeName} = (typeof ${item.typeName}Enum)[keyof typeof ${item.typeName}Enum]`
  })

  const enumContent = `${generatedHeader({
    input: '由 OpenAPI schema 中的 enum 字段生成',
    output: '对外提供后端枚举对应的常量对象与字面量联合类型',
    pos: 'src/api/generated/meta 的自动生成枚举文件，为页面和表单提供稳定枚举值',
  })}\n\n${enumBlocks.join('\n\n')}\n`
  fs.writeFileSync(path.join(META_DIR, 'enums.ts'), enumContent, 'utf-8')

  const imports = enums.map(item => `${item.typeName}Enum`).join(', ')
  const optionBlocks = enums.map(item => {
    const rows = item.values.map((value, index) => `  { label: ${tsString(value)}, value: ${item.typeName}Enum.${enumKey(value, index)} },`).join('\n')
    return `/** ${item.description} 下拉选项 */\nexport const ${item.typeName}Options = [\n${rows}\n] as const`
  })
  const optionsContent = `${generatedHeader({
    input: '依赖 ./enums.ts 的自动生成枚举常量',
    output: '对外提供 Select、Radio、Checkbox 可直接使用的 label/value 选项',
    pos: 'src/api/generated/meta 的自动生成选项文件，与 enums.ts 保持一一对应',
  })}\nimport { ${imports} } from './enums'\n\n${optionBlocks.join('\n\n')}\n`
  fs.writeFileSync(path.join(META_DIR, 'options.ts'), optionsContent, 'utf-8')
}

async function main() {
  const { schema, version } = await loadSwagger()
  const schemas = schema.components?.schemas || {}
  const modules = new Map()

  for (const [url, methods] of Object.entries(schema.paths || {})) {
    const moduleName = moduleNameFromUrl(url)
    if (!modules.has(moduleName)) modules.set(moduleName, createModuleContext())
    const context = modules.get(moduleName)

    for (const [method, operation] of Object.entries(methods || {})) {
      if (!HTTP_METHODS.has(method.toLowerCase()) || !operation) continue
      generateOperation(url, method, operation, moduleName, schemas, context)
    }
  }

  ensureDir(TYPES_DIR)
  ensureDir(META_DIR)
  for (const [moduleName, context] of modules) {
    fs.writeFileSync(path.join(TYPES_DIR, `${moduleName}.ts`), generateTypesFile(moduleName, context, schemas), 'utf-8')
    fs.writeFileSync(path.join(OUTPUT_DIR, `${moduleName}.ts`), generateApiFile(moduleName, context), 'utf-8')
    console.log(`✅ ${moduleName}: ${context.functions.length} 个接口`)
  }

  writeEnumFiles(schemas)
  console.log(`🎉 API 生成完成（${version === 'v2' ? 'Swagger 2.0' : 'OpenAPI 3.x'}）`)
}

main().catch(error => {
  console.error(`❌ ${error.message}`)
  process.exitCode = 1
})
