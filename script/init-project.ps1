<#
[INPUT]: 依赖项目根目录的 package.json、index.html，以及可选的 -ProjectTitle 参数
[OUTPUT]: 根据当前文件夹名初始化 package name，并同步浏览器页面标题
[POS]: script 的模板初始化工具，用于复制模板后的首次项目命名，不修改业务页面和目录结构
#>

$ErrorActionPreference = "Stop"

try {
  [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  $OutputEncoding = [Console]::OutputEncoding
} catch {
  # 控制台编码失败只影响输出显示，不影响文件以 UTF-8 写入
}

function Get-CliArgValue {
  param(
    [AllowEmptyCollection()]
    [string[]] $ArgList,
    [string[]] $Names
  )

  for ($i = 0; $i -lt $ArgList.Count; $i++) {
    $current = $ArgList[$i]
    foreach ($name in $Names) {
      if ($current -eq $name -and ($i + 1) -lt $ArgList.Count) {
        return $ArgList[$i + 1]
      }

      $prefix = "$name="
      if ($current.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $current.Substring($prefix.Length)
      }
    }
  }

  return $null
}

function ConvertTo-KebabCase([string] $Name) {
  $value = $Name -replace '[\\/_\s]+', '-'
  $value = $value -creplace '([a-z0-9])([A-Z])', '$1-$2'
  return ($value.ToLower() -replace '-+', '-' -replace '^-|-$', '')
}

function ConvertTo-TitleCase([string] $Name) {
  $parts = ($Name -split '[-_\s]+' | Where-Object { $_ })
  return ($parts | ForEach-Object {
      if ($_.Length -le 1) { $_.ToUpper() }
      else { $_.Substring(0, 1).ToUpper() + $_.Substring(1).ToLower() }
    }) -join ' '
}

function Set-FileContentUtf8([string] $FilePath, [string] $Content) {
  [System.IO.File]::WriteAllText($FilePath, $Content, [System.Text.UTF8Encoding]::new($false))
}

$argList = @($args | Where-Object { $_ -ne '--' })
$projectTitleArg = Get-CliArgValue -ArgList $argList -Names @('-ProjectTitle', '--ProjectTitle', 'ProjectTitle')
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$folderName = Split-Path $root -Leaf
$projectName = ConvertTo-KebabCase $folderName
$projectTitle = if ([string]::IsNullOrWhiteSpace($projectTitleArg)) {
  ConvertTo-TitleCase $folderName
} else {
  $projectTitleArg.Trim()
}

Write-Host "=== Init React template ===" -ForegroundColor Cyan
Write-Host "package=$projectName  title=$projectTitle`n"

$changes = 0

$packageFile = Join-Path $root 'package.json'
if (Test-Path -LiteralPath $packageFile) {
  $packageContent = [System.IO.File]::ReadAllText($packageFile, [System.Text.UTF8Encoding]::new($false))
  $updatedPackage = [regex]::Replace(
    $packageContent,
    '"name"\s*:\s*"[^"]+"',
    "`"name`": `"$projectName`"",
    1
  )

  if ($updatedPackage -ne $packageContent) {
    Set-FileContentUtf8 $packageFile $updatedPackage
    $changes++
    Write-Host '  ok package.json name' -ForegroundColor Green
  }
}

$indexFile = Join-Path $root 'index.html'
if (Test-Path -LiteralPath $indexFile) {
  $indexContent = [System.IO.File]::ReadAllText($indexFile, [System.Text.UTF8Encoding]::new($false))
  $safeTitle = $projectTitle.Replace('$', '$$')
  $updatedIndex = [regex]::Replace($indexContent, '<title>[\s\S]*?</title>', "<title>$safeTitle</title>", 1)

  if ($updatedIndex -ne $indexContent) {
    Set-FileContentUtf8 $indexFile $updatedIndex
    $changes++
    Write-Host '  ok index.html title' -ForegroundColor Green
  }
}

Write-Host "`n=== Done ($changes changes) ===" -ForegroundColor Green
Write-Host 'Optional: pnpm init:project -- -ProjectTitle 中文标题' -ForegroundColor Yellow
