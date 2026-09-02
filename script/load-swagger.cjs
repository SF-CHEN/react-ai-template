/**
 * [INPUT]: 依赖 Node.js http/https、项目 .env 以及 Swagger 2.0 / OpenAPI 3.x JSON 文档
 * [OUTPUT]: 对外提供 loadSwagger、版本识别、Swagger v2 归一化和 schema 名清洗能力
 * [POS]: script 层的 OpenAPI 读取与兼容层，为 API 代码和文档生成器提供统一输入
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-02 08:40:00
 */
const fs = require('node:fs')
const http = require('node:http')
const https = require('node:https')
const path = require('node:path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const DEFAULT_FILE = path.resolve(__dirname, 'api.json')

const SCHEMA_NAME_MAP = {
  对象: '',
  实体: 'Entity',
  中间数据: 'ExchangeData',
  分页查询实体类: 'PageQuerySo',
  字典表实体: 'DictEntity',
  文件分片对象: 'FileChunk',
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

function ensureDirForFile(filePath) {
  ensureDir(path.dirname(filePath))
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  for (const rawLine of fs.readFileSync(filePath, 'utf-8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const index = line.indexOf('=')
    if (index < 0) continue

    const key = line.slice(0, index).trim()
    let value = line.slice(index + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

function loadProjectEnv() {
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  loadEnvFile(path.join(PROJECT_ROOT, `.env.${mode}`))
  loadEnvFile(path.join(PROJECT_ROOT, '.env'))
}

function parseArgs() {
  loadProjectEnv()
  const args = process.argv.slice(2)
  let url = (process.env.SWAGGER_URL || '').trim()
  let file = (process.env.SWAGGER_FILE || '').trim()

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg === '--url' && args[i + 1]) url = args[++i]
    else if (arg.startsWith('--url=')) url = arg.slice(6)
    else if (arg === '--file' && args[i + 1]) file = args[++i]
    else if (arg.startsWith('--file=')) file = arg.slice(7)
    else if (!arg.startsWith('-')) {
      if (/^https?:\/\//i.test(arg)) url = arg
      else file = arg
    }
  }

  return {
    url,
    file: file
      ? path.isAbsolute(file)
        ? file
        : path.resolve(process.cwd(), file)
      : DEFAULT_FILE,
  }
}

function fetchJson(url, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error('Swagger 重定向次数过多'))

  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    client
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          const nextUrl = new URL(response.headers.location, url).toString()
          response.resume()
          fetchJson(nextUrl, redirectCount + 1).then(resolve, reject)
          return
        }
        if (response.statusCode !== 200) {
          response.resume()
          reject(new Error(`请求 Swagger 失败 (${response.statusCode}): ${url}`))
          return
        }

        let body = ''
        response.setEncoding('utf-8')
        response.on('data', (chunk) => (body += chunk))
        response.on('end', () => {
          try {
            resolve(JSON.parse(body))
          } catch {
            reject(new Error(`Swagger 响应不是有效 JSON: ${url}`))
          }
        })
      })
      .on('error', reject)
  })
}

function detectSwaggerVersion(schema) {
  if (schema?.swagger === '2.0') return 'v2'
  if (typeof schema?.openapi === 'string' && schema.openapi.startsWith('3')) return 'v3'
  throw new Error('无法识别 Swagger/OpenAPI 版本，需要 swagger: "2.0" 或 openapi: "3.x"')
}

function sanitizeTypeName(rawName) {
  let name = String(rawName || '').trim()
  let previous = ''

  while (name !== previous && name.includes('«')) {
    previous = name
    name = name.replace(/([^«»]+)«([^«»]+)»/g, (_, outer, inner) => `${outer}${sanitizeTypeName(inner)}`)
  }

  for (const [from, to] of Object.entries(SCHEMA_NAME_MAP)) {
    name = name.split(from).join(to)
  }
  name = name.replace(/[^\w$]/g, '')
  if (!name) name = 'UnknownSchema'
  if (!/^[A-Za-z_$]/.test(name)) name = `T${name}`
  return name
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function rewriteRefs(value, nameMap) {
  if (!value || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map((item) => rewriteRefs(item, nameMap))

  const result = {}
  for (const [key, item] of Object.entries(value)) {
    if (key === '$ref' && typeof item === 'string') {
      const match = item.match(/^#\/(?:definitions|components\/schemas)\/(.+)$/)
      result[key] = match
        ? `#/components/schemas/${nameMap.get(match[1]) || sanitizeTypeName(match[1])}`
        : item
    } else {
      result[key] = rewriteRefs(item, nameMap)
    }
  }
  return result
}

function normalizeParameter(param) {
  if (param.in === 'body' || param.schema) return param
  const schema = {}
  for (const key of ['type', 'format', 'items', 'enum', '$ref']) {
    if (param[key] !== undefined) schema[key] = param[key]
  }
  return { ...param, schema: Object.keys(schema).length ? schema : { type: 'string' } }
}

function normalizeV2Operation(operation) {
  const parameters = []
  let requestBody = null

  for (const param of operation.parameters || []) {
    if (param.in === 'body') {
      requestBody = {
        required: param.required !== false,
        description: param.description,
        content: { 'application/json': { schema: param.schema || { type: 'object' } } },
      }
    } else {
      parameters.push(normalizeParameter(param))
    }
  }

  const responses = {}
  for (const [code, response] of Object.entries(operation.responses || {})) {
    responses[code] = response?.schema
      ? {
          ...response,
          content: {
            'application/json': { schema: response.schema },
            '*/*': { schema: response.schema },
          },
        }
      : response
    if (responses[code]?.schema) delete responses[code].schema
  }

  return { ...operation, parameters, ...(requestBody ? { requestBody } : {}), responses }
}

function normalizeSwaggerV2(raw) {
  const cloned = clone(raw)
  const nameMap = new Map(Object.keys(cloned.definitions || {}).map((name) => [name, sanitizeTypeName(name)]))
  const rewritten = rewriteRefs(cloned, nameMap)
  const schemas = {}

  for (const [name, schema] of Object.entries(rewritten.definitions || {})) {
    schemas[nameMap.get(name) || sanitizeTypeName(name)] = schema
  }

  const paths = {}
  for (const [url, pathItem] of Object.entries(rewritten.paths || {})) {
    paths[url] = {}
    for (const [method, operation] of Object.entries(pathItem || {})) {
      paths[url][method] = method === 'parameters' || method.startsWith('x-')
        ? operation
        : normalizeV2Operation(operation)
    }
  }

  return {
    openapi: '3.0.0',
    info: rewritten.info || { title: 'API', version: '1.0.0' },
    paths,
    components: { schemas, securitySchemes: rewritten.securityDefinitions || {} },
    tags: rewritten.tags || [],
  }
}

function normalizeOpenApiV3(raw) {
  const cloned = clone(raw)
  const names = Object.keys(cloned.components?.schemas || {})
  const nameMap = new Map(names.map((name) => [name, sanitizeTypeName(name)]))
  const rewritten = rewriteRefs(cloned, nameMap)
  const schemas = {}

  for (const [name, schema] of Object.entries(rewritten.components?.schemas || {})) {
    schemas[nameMap.get(name) || sanitizeTypeName(name)] = schema
  }

  return {
    ...rewritten,
    components: { ...(rewritten.components || {}), schemas },
  }
}

function normalizeSwagger(raw) {
  const version = detectSwaggerVersion(raw)
  return {
    version,
    schema: version === 'v2' ? normalizeSwaggerV2(raw) : normalizeOpenApiV3(raw),
  }
}

async function loadSwagger() {
  const { url, file } = parseArgs()
  let rawSchema

  if (url) {
    rawSchema = await fetchJson(url)
    ensureDirForFile(DEFAULT_FILE)
    fs.writeFileSync(DEFAULT_FILE, `${JSON.stringify(rawSchema, null, 2)}\n`, 'utf-8')
    console.log(`🌐 已拉取 Swagger: ${url}`)
  } else {
    if (!fs.existsSync(file)) {
      throw new Error(`未找到 Swagger 文件: ${file}\n请配置 SWAGGER_URL，或使用 --url / --file`)
    }
    rawSchema = JSON.parse(fs.readFileSync(file, 'utf-8'))
    console.log(`📄 读取本地文档: ${path.relative(process.cwd(), file)}`)
  }

  const normalized = normalizeSwagger(rawSchema)
  console.log(`🔎 识别文档版本: ${normalized.version === 'v2' ? 'Swagger 2.0' : 'OpenAPI 3.x'}`)
  return { ...normalized, file, rawSchema }
}

module.exports = {
  DEFAULT_FILE,
  detectSwaggerVersion,
  ensureDir,
  ensureDirForFile,
  loadSwagger,
  normalizeSwagger,
  parseArgs,
  sanitizeTypeName,
}
