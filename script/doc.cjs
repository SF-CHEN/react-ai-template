/**
 * [INPUT]: 依赖 load-swagger.cjs 提供的 OpenAPI 归一化结果和 schema / path 元数据
 * [OUTPUT]: 对外生成 src/api/generated/api.md，供开发者和 AI 快速查阅接口与数据模型
 * [POS]: script 层的 API 文档生成器，与 generate-api.cjs 共享同一 Swagger/OpenAPI 输入
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-02 08:40:00
 */
const fs = require('node:fs')
const path = require('node:path')
const { ensureDirForFile, loadSwagger } = require('./load-swagger.cjs')

const OUTPUT_FILE = path.resolve(__dirname, '../src/api/generated/api.md')
const HTTP_METHODS = new Set(['get', 'post', 'put', 'delete', 'patch'])

function typeName(schema) {
  if (!schema) return 'unknown'
  if (schema.$ref) return schema.$ref.split('/').pop()
  if (schema.enum) return schema.enum.map((value) => JSON.stringify(value)).join(' | ')
  if (schema.type === 'array') return `${typeName(schema.items)}[]`
  if (schema.type === 'integer' || schema.type === 'number') return 'number'
  if (schema.type === 'boolean') return 'boolean'
  if (schema.type === 'string') return 'string'
  if (schema.type === 'object') return 'Record<string, unknown>'
  return 'unknown'
}

function requestBodySchema(operation) {
  const content = operation.requestBody?.content
  if (!content) return null
  return content['application/json']?.schema || content['*/*']?.schema || Object.values(content).find((item) => item?.schema)?.schema || null
}

function responseSchema(operation) {
  const response = operation.responses?.['200'] || operation.responses?.['201'] || operation.responses?.['204']
  if (!response?.content) return null
  return response.content['application/json']?.schema || response.content['*/*']?.schema || null
}

async function main() {
  const { schema, version } = await loadSwagger()
  const schemas = schema.components?.schemas || {}
  const lines = [
    `# ${schema.info?.title || 'API Document'}`,
    '',
    `> 版本: ${schema.info?.version || '-'}`,
    `> 规范: ${version === 'v2' ? 'Swagger 2.0（已归一化）' : 'OpenAPI 3.x'}`,
    '> 此文件由脚本生成，供开发者和 AI 快速理解接口；不要手动维护。',
    '',
    '## 数据模型',
    '',
  ]

  for (const [name, model] of Object.entries(schemas)) {
    lines.push(`### ${name}`, '', '```ts', `interface ${name} {`)
    const required = new Set(model.required || [])
    for (const [propName, propSchema] of Object.entries(model.properties || {})) {
      const optional = required.has(propName) ? '' : '?'
      const description = propSchema.description ? ` // ${String(propSchema.description).replace(/\s+/g, ' ')}` : ''
      lines.push(`  ${propName}${optional}: ${typeName(propSchema)}${description}`)
    }
    lines.push('}', '```', '')
  }

  lines.push('## 接口列表', '')
  const groups = new Map()

  for (const [url, pathItem] of Object.entries(schema.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem || {})) {
      if (!HTTP_METHODS.has(method.toLowerCase()) || !operation || typeof operation !== 'object') continue
      const tag = operation.tags?.[0] || '其他'
      if (!groups.has(tag)) groups.set(tag, [])
      groups.get(tag).push({ url, method, operation })
    }
  }

  for (const [tag, endpoints] of groups) {
    lines.push(`### ${tag}`, '')
    for (const { url, method, operation } of endpoints) {
      lines.push(`#### ${operation.summary || url}`, '', `- Method: \`${method.toUpperCase()}\``, `- URL: \`${url}\``)

      const params = operation.parameters || []
      if (params.length) {
        lines.push('- Parameters:')
        for (const param of params) {
          lines.push(`  - \`${param.name}\` (${param.in}): ${typeName(param.schema)} ${param.required ? 'Required' : 'Optional'}`)
        }
      }

      const body = requestBodySchema(operation)
      if (body) lines.push(`- Request Body: \`${typeName(body)}\``)

      const response = responseSchema(operation)
      lines.push(`- Response: \`${response ? typeName(response) : 'void'}\``, '')
    }
  }

  ensureDirForFile(OUTPUT_FILE)
  fs.writeFileSync(OUTPUT_FILE, `${lines.join('\n')}\n`, 'utf-8')
  console.log(`✅ API 文档已生成: ${path.relative(process.cwd(), OUTPUT_FILE)}`)
}

main().catch((error) => {
  console.error(`❌ API 文档生成失败: ${error.message}`)
  process.exitCode = 1
})
