import { useState, useMemo } from 'react'
import { SKILLS, SKILL_CATEGORIES } from '@data/skills'
import type { Skill, SkillCategory } from '@data/skills'
import { whiteIcon } from '../lib/logoResolver'
import LogoSearchPicker from './LogoSearchPicker'

type Props = {
  selected: Skill[]
  onChange: (skills: Skill[]) => void
  max: number
  wide?: boolean
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? 'var(--tan-dim)' : 'transparent',
    border: `0.5px solid ${active ? 'var(--tan-mid)' : 'var(--border)'}`,
    borderRadius: 4,
    color: active ? 'var(--tan)' : 'var(--muted)',
    fontFamily: 'var(--mono)',
    fontSize: 8,
    letterSpacing: '0.1em',
    padding: '4px 9px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  }
}

const inp: React.CSSProperties = {
  background: 'var(--surface2)',
  border: '0.5px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text)',
  fontFamily: 'var(--mono)',
  fontSize: 12,
  padding: '8px 11px',
  outline: 'none',
  width: '100%',
}

const lbl: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: '0.18em',
  color: 'var(--muted)',
  textTransform: 'uppercase' as const,
  fontFamily: 'var(--mono)',
  display: 'block',
  marginBottom: 5,
}

export default function SkillPicker({ selected, onChange, max, wide = false }: Props) {
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState<SkillCategory | 'all'>('all')

  // Custom skill state
  const [customName,      setCustomName]      = useState('')
  const [customIconQuery, setCustomIconQuery] = useState('')
  const [customIconUrl,   setCustomIconUrl]   = useState('')

  const filtered = useMemo(() => SKILLS.filter(s => {
    const matchCat = category === 'all' || s.category === category
    const matchQ   = !query || s.label.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  }), [query, category])

  const isSel  = (s: Skill) => selected.some(x => x.id === s.id)
  const atMax  = selected.length >= max
  const cols   = wide ? 9 : 5

  const toggle = (skill: Skill) => {
    if (isSel(skill)) {
      onChange(selected.filter(s => s.id !== skill.id))
    } else if (!atMax) {
      onChange([...selected, skill])
    }
  }

  const addCustom = () => {
    if (!customName.trim() || atMax) return
    const id = `custom-${customName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const skill: Skill = {
      id,
      label: customName,
      category: 'tool',
      iconUrl: customIconUrl || '',
      color: '#C79A6F',
    }
    onChange([...selected, skill])
    setCustomName('')
    setCustomIconQuery('')
    setCustomIconUrl('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const result = ev.target?.result as string
      setCustomIconUrl(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Search + category row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Filter skills..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ ...inp, width: 200, flexShrink: 0 }}
        />
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setCategory('all')} style={pillStyle(category === 'all')}>ALL</button>
          {SKILL_CATEGORIES.map(c => (
            <button type="button" key={c.id} onClick={() => setCategory(c.id)} style={pillStyle(category === c.id)}>
              {c.label.toUpperCase()}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)', whiteSpace: 'nowrap' }}>
          {filtered.length} skills
        </span>
      </div>

      {/* Predefined skill grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 6,
        maxHeight: wide ? 240 : 200,
        overflowY: 'auto',
        paddingRight: 4,
      }}>
        {filtered.map(skill => {
          const sel      = isSel(skill)
          const disabled = atMax && !sel
          const iconSrc  = whiteIcon(skill.iconUrl)
          return (
            <button
              type="button"
              key={skill.id}
              onClick={() => toggle(skill)}
              disabled={disabled}
              title={skill.label}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: sel ? 'rgba(199,154,111,0.09)' : 'var(--surface2)',
                border: `0.5px solid ${sel ? 'var(--tan)' : 'var(--border)'}`,
                borderRadius: 7,
                padding: wide ? '9px 5px' : '7px 4px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.35 : 1,
                position: 'relative',
                transition: 'border-color 0.12s, background 0.12s',
              }}
            >
              {sel && (
                <span style={{ position: 'absolute', top: 2, right: 3, fontSize: 7, color: 'var(--tan)' }}>✓</span>
              )}
              {iconSrc ? (
                <img
                  src={iconSrc}
                  alt={skill.label}
                  width={wide ? 22 : 18}
                  height={wide ? 22 : 18}
                  style={{ objectFit: 'contain' }}
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
                />
              ) : (
                <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)', textAlign: 'center' }}>
                  {skill.label.slice(0, 2)}
                </span>
              )}
              <span style={{
                fontSize: wide ? 8 : 7, color: 'var(--muted)', letterSpacing: 0.2,
                textAlign: 'center', lineHeight: 1.2, fontFamily: 'var(--mono)',
              }}>
                {skill.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Custom skill section */}
      <div style={{
        background: 'var(--surface2)', border: '0.5px solid var(--border)',
        borderRadius: 8, padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <span style={{ fontSize: 9, color: 'var(--tan)', letterSpacing: '0.25em', fontFamily: 'var(--mono)' }}>
          ADD CUSTOM SKILL
        </span>

        {/* Skill name */}
        <div>
          <span style={lbl}>Skill Name</span>
          <input
            type="text"
            placeholder="e.g. React, Python, Figma..."
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            style={inp}
          />
        </div>

        {/* Icon search — multi-result picker */}
        <LogoSearchPicker
          query={customIconQuery}
          onQueryChange={q => { setCustomIconQuery(q); if (!q) setCustomIconUrl('') }}
          selectedUrl={customIconUrl}
          onSelect={url => setCustomIconUrl(url)}
          placeholder="Search icon across CDNs..."
        />

        {/* URL paste + file upload row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'end' }}>
          <div>
            <span style={lbl}>Or paste icon URL / data URL</span>
            <input
              type="text"
              placeholder="https://... or data:image/..."
              value={customIconUrl}
              onChange={e => setCustomIconUrl(e.target.value)}
              style={inp}
            />
          </div>
          <div>
            <span style={lbl}>Upload PNG / SVG</span>
            <input
              type="file"
              accept="image/svg+xml,image/png,image/jpeg,image/webp"
              aria-label="Upload custom skill icon"
              title="Upload a PNG or SVG icon for this skill"
              onChange={handleFileUpload}
              style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Preview + add row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Icon preview on dark bg */}
          <div style={{
            width: 44, height: 44, flexShrink: 0,
            background: '#07090C', border: '0.5px solid var(--border)',
            borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {customIconUrl ? (
              <img
                src={customIconUrl}
                alt={customName || 'icon'}
                width={28} height={28}
                style={{ objectFit: 'contain' }}
                onError={e => { (e.target as HTMLImageElement).style.opacity = '0.1' }}
              />
            ) : (
              <span style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--mono)', opacity: 0.5 }}>ICON</span>
            )}
          </div>

          <button
            type="button"
            onClick={addCustom}
            disabled={!customName.trim() || atMax}
            style={{
              background: !customName.trim() || atMax ? 'var(--surface)' : 'var(--tan-dim)',
              border: `0.5px solid ${!customName.trim() || atMax ? 'var(--border)' : 'var(--tan-mid)'}`,
              borderRadius: 6, color: !customName.trim() || atMax ? 'var(--muted)' : 'var(--tan)',
              fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.15em',
              padding: '9px 18px',
              cursor: !customName.trim() || atMax ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Add Skill
          </button>

          {!customIconUrl && customName && (
            <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)', lineHeight: 1.6 }}>
              No icon — will show label text on banner
            </span>
          )}
        </div>
      </div>

      {atMax && (
        <p style={{ fontSize: 9, color: 'var(--tan)', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>
          Max {max} skills reached. Remove one to add another.
        </p>
      )}
    </div>
  )
}
