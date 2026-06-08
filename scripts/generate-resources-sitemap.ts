import { mkdir, readFile, writeFile } from 'fs/promises'
import { dirname, resolve } from 'path'

type Resource = {
  id?: number | string
  updated_at?: string
}

type ResourcesPayload = {
  resources?: {
    data?: Resource[]
  }
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

function normalizeHost(rawHost: string): string {
  return rawHost.replace(/\/+$/, '')
}

function buildSitemap(resources: Resource[], host: string): string {
  const urls = resources
    .filter((resource) => resource.id !== undefined && resource.id !== null)
    .map((resource) => {
      const id = String(resource.id)
      const loc = `${host}/resources/${encodeURIComponent(id)}`
      const lastmod = parseDate(resource.updated_at)

      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    })
    .join('\n\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${urls}\n\n</urlset>\n`
}

async function main(): Promise<void> {
  const root = process.cwd()
  const inputPath = resolve(
    root,
    process.argv[2] ?? 'public/api/resources.json',
  )
  const outputPath = resolve(
    root,
    process.argv[3] ?? 'public/sitemap-resources.xml',
  )
  const envPath = resolve(root, '.env')

  const envFromFile = await loadEnvFile(envPath)
  const host = normalizeHost(process.env.HOST ?? envFromFile.HOST ?? '')

  if (!host) {
    throw new Error(
      'HOST is missing. Add HOST in .env or export HOST in your shell environment.',
    )
  }

  const rawInput = await readFile(inputPath, 'utf8')
  const payload = JSON.parse(rawInput) as ResourcesPayload
  const resources = payload.resources?.data ?? []

  const uniqueById = new Map<string, Resource>()
  for (const resource of resources) {
    if (resource.id === undefined || resource.id === null) {
      continue
    }

    uniqueById.set(String(resource.id), resource)
  }

  const dedupedResources = Array.from(uniqueById.values())
  const sitemap = buildSitemap(dedupedResources, host)

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, sitemap, 'utf8')

  console.log(
    `Generated ${outputPath} with ${dedupedResources.length} resource URLs.`,
  )
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Failed to generate resource sitemap: ${message}`)
  process.exitCode = 1
})
