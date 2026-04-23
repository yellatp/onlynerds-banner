const BRANDFETCH_KEY = '4ZCe5dD0ca-6neU8_EgAFAmFRzb67Vn9rSzrt6BCrY3R2tMByyQRRg1jieIoyQ2XmSDlY_qBYCd3DEbCbT-bJg'

function guessDomain(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+(inc|corp|llc|ltd|co\.?|group|technologies|technology|systems|solutions|software|labs|studio|studios|digital|networks|network|media|interactive)\b/g, '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '') + '.com'
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
}

function toDashSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function probeImage(url: string): Promise<boolean> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload  = () => resolve(true)
    img.onerror = () => resolve(false)
    img.crossOrigin = 'anonymous'
    img.src = url
  })
}

export type ResolvedLogo = { url: string; source: string }

// Ensure SI CDN URLs render white on dark backgrounds
export function whiteIcon(url: string): string {
  if (url.includes('cdn.simpleicons.org') && !url.match(/\/[0-9a-fA-F]{6}(\/[0-9a-fA-F]{6})?$/)) {
    return url + '/ffffff'
  }
  return url
}

async function fetchBrandfetchLogo(query: string): Promise<ResolvedLogo | null> {
  try {
    const domain = guessDomain(query)
    const res = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
      headers: { Authorization: `Bearer ${BRANDFETCH_KEY}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    const logos: Array<{ theme?: string; formats?: Array<{ format: string; src: string }> }> = data.logos ?? []
    const sorted = [...logos].sort((a, b) =>
      a.theme === 'dark' && b.theme !== 'dark' ? -1 : b.theme === 'dark' ? 1 : 0
    )
    for (const group of sorted) {
      for (const fmt of group.formats ?? []) {
        if (fmt.src && (fmt.format === 'svg' || fmt.format === 'png')) {
          if (await probeImage(fmt.src)) return { url: fmt.src, source: 'Brandfetch' }
        }
      }
    }
  } catch {
    // CORS or network failure — fall through
  }
  return null
}

// Local brand overrides — prepended to search results when query matches
const LOCAL_BRANDS: Record<string, ResolvedLogo[]> = {
  alphonso:   [
    { url: '/AlphonsoAI_logo.svg',    source: 'AlphonsoAI (SVG)'  },
    { url: '/Alphonso_logo.png',      source: 'AlphonsoAI (PNG)'  },
    { url: '/Alphonso_logo_big.png',  source: 'AlphonsoAI (Big)'  },
  ],
  alphonsoai: [
    { url: '/AlphonsoAI_logo.svg',    source: 'AlphonsoAI (SVG)'  },
    { url: '/Alphonso_logo.png',      source: 'AlphonsoAI (PNG)'  },
    { url: '/Alphonso_logo_big.png',  source: 'AlphonsoAI (Big)'  },
  ],
  onlynerds: [
    { url: '/OnlyNerds-Logo.png',     source: 'OnlyNerds'         },
    { url: '/OnlyNerds.png',          source: 'OnlyNerds (icon)'  },
  ],
}

// Returns ALL found logos across all sources (for the picker UI)
export async function searchAllSources(query: string): Promise<ResolvedLogo[]> {
  if (!query.trim()) return []

  // Return local brand assets immediately for known brands
  const key = toSlug(query)
  if (LOCAL_BRANDS[key]) return LOCAL_BRANDS[key]

  const slug     = toSlug(query)
  const slugDash = toDashSlug(query)

  const candidates: ResolvedLogo[] = [
    { url: `https://cdn.simpleicons.org/${slug}/ffffff`,                                                             source: 'Simple Icons'  },
    { url: `https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/${slugDash}.svg`,                             source: 'Brand Logos'   },
    { url: `https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/${slug}.svg`,                                 source: 'Brand Logos'   },
    { url: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`,                       source: 'Devicon'       },
    { url: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-plain.svg`,                          source: 'Devicon'       },
    { url: `https://www.vectorlogo.zone/logos/${slugDash}/${slugDash}-icon.svg`,                                     source: 'VectorLogo'    },
    { url: `https://www.vectorlogo.zone/logos/${slug}/${slug}-icon.svg`,                                             source: 'VectorLogo'    },
  ]

  // Probe all CDNs + Brandfetch in parallel
  const [cdnProbes, brandfetchResult] = await Promise.all([
    Promise.all(candidates.map(async c => (await probeImage(c.url)) ? c : null)),
    fetchBrandfetchLogo(query),
  ])

  const cdnFound = cdnProbes.filter(Boolean) as ResolvedLogo[]

  // Deduplicate by source label (keep first of each)
  const seen = new Set<string>()
  const deduped = cdnFound.filter(r => {
    if (seen.has(r.source)) return false
    seen.add(r.source)
    return true
  })

  return brandfetchResult ? [brandfetchResult, ...deduped] : deduped
}

// Single best-match resolver used during automatic resolution
export async function resolveLogoUrl(query: string): Promise<ResolvedLogo | null> {
  const all = await searchAllSources(query)
  return all[0] ?? null
}
