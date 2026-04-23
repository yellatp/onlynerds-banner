import { useState, useRef } from 'react'
import { searchAllSources } from '../lib/logoResolver'
import type { ResolvedLogo } from '../lib/logoResolver'

type Props = {
  query: string
  onQueryChange: (q: string) => void
  selectedUrl: string
  onSelect: (url: string, source: string) => void
  placeholder?: string
}

const lbl: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: '0.18em',
  color: 'var(--muted)',
  textTransform: 'uppercase',
  fontFamily: 'var(--mono)',
  display: 'block',
  marginBottom: 5,
}

export default function LogoSearchPicker({ query, onQueryChange, selectedUrl, onSelect, placeholder }: Props) {
  const [results,   setResults]   = useState<ResolvedLogo[]>([])
  const [searching, setSearching] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (q: string) => {
    onQueryChange(q)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!q.trim()) { setResults([]); setSearching(false); return }
    setSearching(true)
    timerRef.current = setTimeout(async () => {
      const found = await searchAllSources(q)
      setResults(found)
      setSearching(false)
    }, 400)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="text"
          placeholder={placeholder ?? 'Search by name (e.g. stripe, github)...'}
          value={query}
          onChange={e => handleChange(e.target.value)}
          style={{
            background: '#07090C', border: '0.5px solid var(--border)',
            borderRadius: 6, color: 'var(--text)', fontFamily: 'var(--mono)',
            fontSize: 12, padding: '8px 11px', outline: 'none', flex: 1,
          }}
        />
        {searching && (
          <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)', whiteSpace: 'nowrap' }}>
            Searching...
          </span>
        )}
      </div>

      {/* Results grid */}
      {results.length > 0 && (
        <div>
          <span style={{ ...lbl, color: 'var(--tan)', marginBottom: 8 }}>
            {results.length} source{results.length > 1 ? 's' : ''} found — click to select
          </span>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {results.map((r, i) => {
              const isSel = selectedUrl === r.url
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelect(r.url, r.source)}
                  title={`${r.source}\n${r.url}`}
                  style={{
                    background: isSel ? 'var(--tan-dim)' : '#07090C',
                    border: `1px solid ${isSel ? 'var(--tan)' : 'var(--border)'}`,
                    borderRadius: 8, padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    transition: 'border-color 0.12s',
                    minWidth: 64,
                  }}
                >
                  <img
                    src={r.url}
                    alt={r.source}
                    width={30} height={30}
                    style={{ objectFit: 'contain', display: 'block' }}
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0.15' }}
                  />
                  <span style={{
                    fontSize: 7,
                    color: isSel ? 'var(--tan)' : 'var(--muted)',
                    fontFamily: 'var(--mono)',
                    letterSpacing: '0.06em',
                    textAlign: 'center',
                    lineHeight: 1.3,
                    maxWidth: 60,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {r.source.replace(' (white)', '').toUpperCase()}
                  </span>
                  {isSel && (
                    <span style={{ fontSize: 7, color: 'var(--tan)', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>
                      SELECTED
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {!searching && query.trim() && results.length === 0 && (
        <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>
          No icon found from any source — paste a URL or upload a file below
        </span>
      )}
    </div>
  )
}
