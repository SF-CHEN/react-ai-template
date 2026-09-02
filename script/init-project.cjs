/**
 * [INPUT]: 依赖当前项目目录名、package.json、index.html、AppLayout.tsx 和可选的 --title 参数
 * [OUTPUT]: 对外提供模板初始化脚本，更新包名和界面标题
 * [POS]: script 层的项目初始化工具，用于从模板创建新项目后的最小必要重命名
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-02 08:40:00
 */
const fs = require('node:fs')
const path = require('node:path')

const PROJECT_ROOT = path.resolve(__dirname, '..')

function toKebabCase(value) {
  return String(value || '')
    .replace(/[\\/_\s]+/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function toTitle(value) {
  return String(value || '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getArgValue(names) {
  const args = process.argv.slice(2).filter((arg) => arg !== '--')

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    for (const name of names) {
      if (arg === name && args[i + 1]) return args[i + 1]
      if (arg.startsWith(`${name}=`)) return arg.slice(name.length + 1)
    }
  }

  return ''
}

function formatTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    ' ',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
    ':',
    pad(date.getSeconds()),
  ].join('')
}

function refreshL3Time(content) {
  return content.replace(/\[TIME\]:\s*[^\r\n]+/, `[TIME]: ${formatTime()}`)
}

function updatePackageName(projectName) {
  const filePath = path.join(PROJECT_ROOT, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  if (pkg.name === projectName) return false

  pkg.name = projectName
  fs.writeFileSync(filePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf-8')
  return true
}

function updateHtmlTitle(projectTitle) {
  const filePath = path.join(PROJECT_ROOT, 'index.html')
  if (!fs.existsSync(filePath)) return false

  const content = fs.readFileSync(filePath, 'utf-8')
  const next = refreshL3Time(content.replace(/<title>[\s\S]*?<\/title>/, `<title>${projectTitle}</title>`))
  if (next === content) return false

  fs.writeFileSync(filePath, next, 'utf-8')
  return true
}

function updateLayoutTitle(projectTitle) {
  const filePath = path.join(PROJECT_ROOT, 'src/layouts/AppLayout.tsx')
  if (!fs.existsSync(filePath)) return false

  const content = fs.readFileSync(filePath, 'utf-8')
  const next = refreshL3Time(
    content.replace(
      /(<div className="truncate text-sm font-semibold">)[\s\S]*?(<\/div>)/,
      `$1${projectTitle}$2`,
    ),
  )
  if (next === content) return false

  fs.writeFileSync(filePath, next, 'utf-8')
  return true
}

function main() {
  const folderName = path.basename(PROJECT_ROOT)
  const projectName = toKebabCase(folderName)
  const titleArg = getArgValue(['--title', '--project-title', '-ProjectTitle'])
  const projectTitle = titleArg.trim() || toTitle(folderName)

  const changes = [
    updatePackageName(projectName),
    updateHtmlTitle(projectTitle),
    updateLayoutTitle(projectTitle),
  ].filter(Boolean).length

  console.log(`项目名: ${projectName}`)
  console.log(`项目标题: ${projectTitle}`)
  console.log(`完成: ${changes} 处修改`)
}

main()
