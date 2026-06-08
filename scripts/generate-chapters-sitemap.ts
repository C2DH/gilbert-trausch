import { mkdir, readdir, readFile, writeFile } from 'fs/promises'
import { basename, dirname, resolve } from 'path'

type Chapter = {
  id?: number | string
  slug?: string
  updated_at?: string
}

type SitemapEntry = {
  path: string
  updated_at?: string
  priority: number
}

type EnvMap = Record<string, string>

function parseEnvContent(content: string): EnvMap {
  const env: EnvMap = {}

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) {
      continue
    }

    const key = match[1]
    let value = match[2].trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    env[key] = value
  }

  return env
}

async function loadEnvFile(envPath: string): Promise<EnvMap> {
  try {
    const content = await readFile(envPath, 'utf8')
    return parseEnvContent(content)
  } catch {
    return {}
  }
}

function normalizeHost(rawHost: string): string {
  return rawHost.replace(/\/+$/, '')
}

function parseDate(dateInput?: string): string {
  if (!dateInput) {
    return new Date().toISOString().slice(0, 10)
  }

  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }

  return date.toISOString().slice(0, 10)
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function matchesChapterJson(filePath: string): boolean {
  return (
    /(^|\/)chapters?[^/]*\.json$/i.test(filePath) ||
    /(^|\/)chapter[^/]*\.json$/i.test(filePath) ||
    /\/chapter\/[^/]+\.json$/i.test(filePath)
  )
}

function isChapterDetailJson(filePath: string): boolean {
  return /\/chapter\/[^/]+\.json$/i.test(filePath)
}

async function listFilesRecursively(rootDir: string): Promise<string[]> {
  const dirEntries = await readdir(rootDir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of dirEntries) {
    const fullPath = resolve(rootDir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursively(fullPath)))
      continue
    }

    files.push(fullPath)
  }

  return files
}

function chapterFromUnknown(item: unknown): Chapter | null {
  if (!item || typeof item !== 'object') {
    return null
  }

  const record = item as Record<string, unknown>
  const slug = typeof record.slug === 'string' ? record.slug : undefined
  const updatedAt =
    typeof record.updated_at === 'string' ? record.updated_at : undefined
  const id =
    typeof record.id === 'string' || typeof record.id === 'number'
      ? record.id
      : undefined

  if (!slug && id === undefined) {
    return null
  }

  return {
    id,
    slug,
    updated_at: updatedAt,
  }
}

function extractChapters(payload: unknown): Chapter[] {
  if (Array.isArray(payload)) {
    return payload
      .map(chapterFromUnknown)
      .filter((chapter): chapter is Chapter => chapter !== null)
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const root = payload as Record<string, unknown>

  if (Array.isArray(root.data)) {
    return root.data
      .map(chapterFromUnknown)
      .filter((chapter): chapter is Chapter => chapter !== null)
  }

  const chapters = root.chapters
  if (chapters && typeof chapters === 'object') {
    const nested = chapters as Record<string, unknown>
    if (Array.isArray(nested.data)) {
      return nested.data
        .map(chapterFromUnknown)
        .filter((chapter): chapter is Chapter => chapter !== null)
    }
  }

  return []
}

function chapterPath(chapter: Chapter): string | null {
  if (chapter.slug) {
    return `/chapter/${encodeURIComponent(chapter.slug)}`
  }

  if (chapter.id !== undefined && chapter.id !== null) {
    return `/chapter/${encodeURIComponent(String(chapter.id))}`
  }

  return null
}

function chapterToEntry(chapter: Chapter): SitemapEntry | null {
  const path = chapterPath(chapter)
  if (!path) {
    return null
  }

  return {
    path,
    updated_at: chapter.updated_at,
    priority: 0.7,
  }
}

function extractSlideEntries(
  payload: unknown,
  filePath: string,
): SitemapEntry[] {
  if (!payload || typeof payload !== 'object') {
    return []
  }

  const root = payload as Record<string, unknown>
  const data =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : null

  if (!data || !Array.isArray(data.slides)) {
    return []
  }

  const fallbackSlug = basename(filePath, '.json')
  const slug =
    typeof data.slug === 'string' && data.slug.trim()
      ? data.slug.trim()
      : fallbackSlug

  if (!slug) {
    return []
  }

  const chapterUpdatedAt =
    typeof data.updated_at === 'string' ? data.updated_at : undefined

  return data.slides
    .map((slide): SitemapEntry | null => {
      if (!slide || typeof slide !== 'object') {
        return null
      }

      const slideRecord = slide as Record<string, unknown>
      const slideId =
        typeof slideRecord.id === 'string' || typeof slideRecord.id === 'number'
          ? slideRecord.id
          : undefined

      if (slideId === undefined) {
        return null
      }

      const slideUpdatedAt =
        typeof slideRecord.updated_at === 'string'
          ? slideRecord.updated_at
          : chapterUpdatedAt

      return {
        path: `/chapter/${encodeURIComponent(slug)}?index=${encodeURIComponent(String(slideId))}`,
        updated_at: slideUpdatedAt,
        priority: 0.6,
      }
    })
    .filter((entry): entry is SitemapEntry => entry !== null)
}

function toTimestamp(dateInput?: string): number {
  if (!dateInput) {
    return 0
  }

  const timestamp = Date.parse(dateInput)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function buildSitemap(entries: SitemapEntry[], host: string): string {
  const urls = entries
    .map((entry) => {
      const loc = `${host}${entry.path}`
      const lastmod = parseDate(entry.updated_at)

      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${entry.priority.toFixed(1)}</priority>\n  </url>`
    })
    .filter((xml): xml is string => xml !== null)
    .join('\n\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${urls}\n\n</urlset>\n`
}

async function main(): Promise<void> {
  const root = process.cwd()
  const inputDir = resolve(root, process.argv[2] ?? 'public/api')
  const outputPath = resolve(
    root,
    process.argv[3] ?? 'public/sitemap-chapters.xml',
  )
  const envPath = resolve(root, '.env')

  const envFromFile = await loadEnvFile(envPath)
  const host = normalizeHost(process.env.HOST ?? envFromFile.HOST ?? '')

  if (!host) {
    throw new Error(
      'HOST is missing. Add HOST in .env or export HOST in your shell environment.',
    )
  }

  const allFiles = await listFilesRecursively(inputDir)
  const chapterFiles = allFiles.filter(matchesChapterJson)

  const allEntries: SitemapEntry[] = []

  for (const filePath of chapterFiles) {
    const raw = await readFile(filePath, 'utf8')
    const payload = JSON.parse(raw) as unknown

    const chapters = extractChapters(payload)
    for (const chapter of chapters) {
      const entry = chapterToEntry(chapter)
      if (entry) {
        allEntries.push(entry)
      }
    }

    if (isChapterDetailJson(filePath)) {
      allEntries.push(...extractSlideEntries(payload, filePath))
    }
  }

  const uniqueByPath = new Map<string, SitemapEntry>()
  for (const entry of allEntries) {
    const existing = uniqueByPath.get(entry.path)
    if (!existing) {
      uniqueByPath.set(entry.path, entry)
      continue
    }

    if (toTimestamp(entry.updated_at) > toTimestamp(existing.updated_at)) {
      existing.updated_at = entry.updated_at
    }
  }

  const dedupedEntries = Array.from(uniqueByPath.values())
  const sitemap = buildSitemap(dedupedEntries, host)

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, sitemap, 'utf8')

  console.log(
    `Generated ${outputPath} with ${dedupedEntries.length} chapter URLs from ${chapterFiles.length} chapter JSON files.`,
  )
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Failed to generate chapter sitemap: ${message}`)
  process.exitCode = 1
})
