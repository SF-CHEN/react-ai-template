/**
 * [INPUT]: 依赖 load-swagger.cjs 提供的标准化 OpenAPI schema
 * [OUTPUT]: 生成 src/api/generated/meta/api.md，汇总数据模型和接口清单
 * [POS]: script 的 API 文档生成器，为 AI 与开发者提供后端接口上下文
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md、react-data 与 code-comments Skill
 * [TIME]: 2026-09-02 02:28:27
 */
const fs = require('node:fs')
const path = require('node:path')
const { ensureDirForFile, loadSwagger } = require('./load-swagger.cjs')

const OUTPUT_FILE = path.resolve(__dirname, '../src/api/generated/meta/api.md')
const HTTP_METHODS = new Set(['get', 'post', 'put', 'delete', 'patch'])

function resolveType(schema) {
  if (!schema) return 'unknown'
  if (schema.$ref) return schema.$ref.split('/').pop()
  if (schema.enum?.length) return schema.enum.map(value => JSON.stringify(value)).join(' | ')
  if (schema.oneOf?.length) return schema.oneOf.map(resolveType).join(' | ')
  if (schema.allOf?.length) return schema.allOf.map(resolveType).join(' & ')
  if (schema.type === 'array') return `${resolveType(schema.items)}[]`
  if (schema.type === 'integer' || schema.type === 'number') return 'number'
  if (schema.type === 'boolean') return 'boolean'
  if (schema.type === 'string') return 'string'
  return 'Record<string, unknown>'
}

function requestBodySchema(requestBody) {
  return requestBody?.content?.['application/json']?.schema
    || requestBody?.content?.['*/*']?.schema
    || null
}

function responseSchema(operation) {
  const response = operation.responses?.['200'] || operation.responses?.['201'] || operation.responses?.['204']
  return response?.content?.['application/json']?.schema
    || response?.content?.['*/*']?.schema
    || null
}

async function main() {
  const { schema, version } = await loadSwagger()
  const schemas = schema.components?.schemas || {}
  const lines = [
    `# ${schema.info?.title || 'API'} 接口文档`,
    '',
    `> 版本：${schema.info?.version || '-'}`,
    `> 规范：${version === 'v2' ? 'Swagger 2.0（已归一化）' : 'OpenAPI 3.x'}`,
    '> 此文件由 script/doc.cjs 自动生成，用于 AI 与开发者快速理解后端接口。',
    '',
    '## 数据模型',
    '',
  ]

  for (const [name, model] of Object.entries(schemas)) {
    lines.push(`### ${name}`, '')
    if (model.description) lines.push(model.description, '')
    lines.push('| 字段 | 类型 | 必填 | 说明 |', '| --- | --- | --- | --- |')
    const required = new Set(model.required || [])
    for (const [field, config] of Object.entries(model.properties || {})) {
      lines.push(`| \`${field}\` | \`${resolveType(config)}\` | ${required.has(field) ? '是' : '否'} | ${config.description || '-'} |`)
    }
    lines.push('')
  }

  lines.push('## 接口列表', '')
  for (const [url, methods] of Object.entries(schema.paths || {})) {
    for (const [method, operation] of Object.entries(methods || {})) {
      if (!HTTP_METHODS.has(method.toLowerCase()) || !operation) continue

      lines.push(`### ${operation.summary || operation.operationId || `${method.toUpperCase()} ${url}`}`, '')
      lines.push(`- **Method**: \`${method.toUpperCase()}\``)
      lines.push(`- **URL**: \`${url}\``)

      const params = operation.parameters || []
      if (params.length) {
        lines.push('- **Parameters**:')
        for (const param of params) {
          lines.push(`  - \`${param.name}\` (${param.in}): \`${resolveType(param.schema)}\`${param.required ? '，必填' : ''}${param.description ? ` — ${param.description}` : ''}`)
        }
      }

      const body = requestBodySchema(operation.requestBody)
      if (body) lines.push(`- **Request Body**: \`${resolveType(body)}\``)
      const response = responseSchema(operation)
      lines.push(`- **Response**: \`${response ? resolveType(response) : 'void'}\``, '')
    }
  }

  ensureDirForFile(OUTPUT_FILE)
  fs.writeFileSync(OUTPUT_FILE, `${lines.join('\n').trim()}\n`, 'utf-8')
  console.log(`🎉 API 文档已生成: ${path.relative(process.cwd(), OUTPUT_FILE)}`)
}

main().catch(error => {
  console.error(`❌ ${error.message}`)
  process.exitCode = 1
})
