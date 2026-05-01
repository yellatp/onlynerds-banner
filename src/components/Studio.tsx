import { useState, useRef } from 'react'
import type { BannerConfig, LogoEntry } from './types'
import LogoSearchPicker from './LogoSearchPicker'
import BannerCanvas from './BannerCanvas'
import SkillPicker from './SkillPicker'
import ExportPanel from './ExportPanel'
import TemplateGrid from './TemplateGrid'
import { TEMPLATES, FORMATS, FONT_OPTIONS, FONT_WEIGHTS } from '@data/templates'
import type { BannerTemplate, CanvasFormat, FontOption, PatternId } from '@data/templates'
// LogoPlacement removed — placement is now semantic: current=top-right, past=bottom-right
import type { Skill } from '@data/skills'

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT: BannerConfig = {
  format:        FORMATS[0],
  template:      TEMPLATES[0],
  pattern:       'grid',
  accentColor:   '#C79A6F',
  name:          'Your Name',
  role:          'Software Engineer',
  team:          '',
  tagline:       'Building things that matter.',
  nameFont:      FONT_OPTIONS[0],
  roleFont:      FONT_OPTIONS[0],
  teamFont:      FONT_OPTIONS[0],
  taglineFont:   FONT_OPTIONS[0],
  nameWeight:    700,
  roleWeight:    400,
  teamWeight:    400,
  taglineWeight: 300,
  nameSize:      44,
  roleSize:      13,
  teamSize:      11,
  taglineSize:   10,
  skills:        [],
  maxSkills:     10,
  showSkillLabels: true,
  logos:         [],
  logoSize:      130,
  gitUsername:   '',
  gitPlatform:   'github',
  showGitBadge:  false,
  showLinkedInZone: false,
  patternOpacity: 0.18,
}

// ─── Shared primitives ────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  background: 'var(--surface2)',
  border: '0.5px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text)',
  fontFamily: 'var(--mono)',
  fontSize: 13,
  padding: '8px 11px',
  outline: 'none',
  width: '100%',
}

const sel: React.CSSProperties = {
  ...inp,
  fontSize: 12,
  cursor: 'pointer',
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

const secLabel: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: '0.35em',
  color: 'var(--tan)',
  textTransform: 'uppercase',
  fontFamily: 'var(--mono)',
  marginBottom: 16,
  display: 'block',
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span style={lbl}>{label}</span>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ borderTop: '0.5px solid var(--border)', margin: '4px 0' }} />
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} style={{
      display: 'flex', alignItems: 'center', gap: 9,
      background: 'transparent', border: 'none', cursor: 'pointer',
      padding: 0, color: value ? 'var(--tan)' : 'var(--muted)',
      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em',
    }}>
      <span style={{
        width: 30, height: 16, borderRadius: 8,
        background: value ? 'var(--tan)' : 'var(--surface2)',
        border: '0.5px solid var(--border2)',
        position: 'relative', flexShrink: 0, transition: 'background 0.2s',
        display: 'inline-block',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: value ? 15 : 2,
          width: 12, height: 12, borderRadius: '50%',
          background: value ? '#1a1a1a' : 'rgba(232,228,222,0.3)',
          transition: 'left 0.2s',
        }} />
      </span>
      {label}
    </button>
  )
}

/** Generate size options from 5 to 60 */
const SIZE_OPTIONS = Array.from({ length: 56 }, (_, i) => i + 5)

/** One row: font family dropdown + weight dropdown + size dropdown */
function TextStyleRow({
  label, textValue, onText,
  font, onFont,
  weight, onWeight,
  size, onSize,
  placeholder,
}: {
  label: string
  textValue: string
  onText: (v: string) => void
  font: FontOption
  onFont: (f: FontOption) => void
  weight: number
  onWeight: (w: number) => void
  size: number
  onSize: (s: number) => void
  placeholder?: string
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 140px 80px', gap: 8, alignItems: 'end' }}>
      <F label={label}>
        <input style={inp} value={textValue} onChange={e => onText(e.target.value)} placeholder={placeholder} />
      </F>
      <F label="Font">
        <select style={sel} value={font.id} onChange={e => {
          const f = FONT_OPTIONS.find(x => x.id === e.target.value)
          if (f) onFont(f)
        }}>
          {FONT_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
      </F>
      <F label="Weight">
        <select style={sel} value={weight} onChange={e => onWeight(Number(e.target.value))}>
          {FONT_WEIGHTS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
        </select>
      </F>
      <F label="Size">
        <select style={sel} value={size} onChange={e => onSize(Number(e.target.value))}>
          {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}px</option>)}
        </select>
      </F>
    </div>
  )
}

// ─── Logo search helpers ──────────────────────────────────────────────────────

let logoIdCounter = 1
const newLogo = (isPast: boolean): LogoEntry => ({
  id: String(logoIdCounter++),
  name: '',
  logoUrl: '',
  searchQuery: '',
  isPast,
  showAsText: false,
})

const LOGO_SOURCES = [
  { name: 'Simple Icons',       url: 'https://simpleicons.org',          hint: 'type company slug, auto-resolves' },
  { name: 'World Vector Logo',  url: 'https://worldvectorlogo.com',       hint: 'SVG brand logos' },
  { name: 'Brandfetch',         url: 'https://brandfetch.com',            hint: 'search any brand' },
  { name: 'Vector Logo Zone',   url: 'https://www.vectorlogo.zone',       hint: 'open-source logos' },
  { name: 'SVG Logos',          url: 'https://svglogos.dev',              hint: 'curated SVG set' },
  { name: 'Devicon',            url: 'https://devicon.dev',               hint: 'dev and tech icons' },
]

// ─── LogoRow ──────────────────────────────────────────────────────────────────

function LogoRow({
  logo,
  onChange,
  onRemove,
}: {
  logo: LogoEntry
  onChange: (updated: LogoEntry) => void
  onRemove: () => void
}) {
  const prefix = logo.isPast ? 'Ex -' : 'Current'

  return (
    <div style={{
      background: 'var(--surface2)', border: '0.5px solid var(--border)',
      borderRadius: 9, padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, color: logo.isPast ? 'var(--muted)' : 'var(--tan)', letterSpacing: '0.2em', fontFamily: 'var(--mono)' }}>
          {prefix.toUpperCase()} COMPANY
          <span style={{ marginLeft: 10, color: 'var(--muted)', opacity: 0.6 }}>
            {logo.isPast ? '— BOTTOM-RIGHT' : '— TOP-RIGHT'}
          </span>
        </span>
        <button type="button" onClick={onRemove} style={{
          background: 'transparent', border: 'none', color: 'var(--muted)',
          cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 11, padding: 0,
        }}>Remove</button>
      </div>

      {/* Company name */}
      <F label="Company Name">
        <input style={inp} value={logo.name}
          onChange={e => onChange({ ...logo, name: e.target.value })}
          placeholder="e.g. Stripe" />
      </F>

      {/* Multi-source logo search */}
      <LogoSearchPicker
        query={logo.searchQuery}
        onQueryChange={q => onChange({ ...logo, searchQuery: q })}
        selectedUrl={logo.logoUrl}
        onSelect={url => onChange({ ...logo, logoUrl: url })}
        placeholder="Search logo (e.g. stripe, google, microsoft)..."
      />

      {/* Manual override row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'end' }}>
        <F label="Paste URL / data URL directly">
          <input style={{ ...inp, fontSize: 11 }} value={logo.logoUrl}
            onChange={e => onChange({ ...logo, logoUrl: e.target.value })}
            placeholder="https://... or data:image/..." />
        </F>
        <div>
          <span style={lbl}>Upload PNG / SVG</span>
          <input type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp"
            aria-label="Upload company logo file"
            title="Upload company logo (SVG, PNG, JPG or WebP)"
            onChange={e => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = ev => onChange({ ...logo, logoUrl: ev.target?.result as string })
              reader.readAsDataURL(file)
            }}
            style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Preview + show-as-text toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, flexShrink: 0,
          background: '#07090C', border: '0.5px solid var(--border)',
          borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {logo.logoUrl && !logo.showAsText ? (
            <img src={logo.logoUrl} alt={logo.name} width={34} height={34}
              style={{ objectFit: 'contain' }}
              onError={() => onChange({ ...logo, logoUrl: '' })} />
          ) : (
            <span style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--mono)', textAlign: 'center', padding: '0 4px', lineHeight: 1.3 }}>
              {logo.name ? logo.name.slice(0, 4).toUpperCase() : 'LOGO'}
            </span>
          )}
        </div>
        <Toggle label="Show as text only (no image)"
          value={logo.showAsText} onChange={v => onChange({ ...logo, showAsText: v })} />
      </div>
    </div>
  )
}

// ─── Git platform helpers ────────────────────────────────────────────────────

const GIT_PLATFORMS = [
  { id: 'github',    label: 'GitHub',    icon: '🐙' },
  { id: 'gitlab',    label: 'GitLab',    icon: '🦊' },
  { id: 'gitbucket', label: 'GitBucket', icon: '🪣' },
] as const

/** Derive the avatar URL from a username for the given platform */
function gitAvatarUrl(username: string, platform: string): string {
  switch (platform) {
    case 'gitlab':
      return `https://gitlab.com/${encodeURIComponent(username)}.png?size=80`
    case 'gitbucket':
      return `https://gitbucket.com/${encodeURIComponent(username)}.png?size=80`
    default:
      return `https://github.com/${encodeURIComponent(username)}.png?size=80`
  }
}

// ─── Main Studio ──────────────────────────────────────────────────────────────

type Tab = 'template' | 'identity' | 'skills' | 'logo' | 'github' | 'export'

export default function Studio() {
  const [cfg, setCfg] = useState<BannerConfig>(DEFAULT)
  const [tab, setTab] = useState<Tab>('template')
  const svgRef = useRef<SVGSVGElement>(null)

  const set = <K extends keyof BannerConfig>(key: K, value: BannerConfig[K]) =>
    setCfg(prev => ({ ...prev, [key]: value }))

  const setLogoAt = (idx: number, updated: LogoEntry) =>
    setCfg(prev => {
      const logos = [...prev.logos]
      logos[idx] = updated
      return { ...prev, logos }
    })

  const removeLogoAt = (idx: number) =>
    setCfg(prev => ({ ...prev, logos: prev.logos.filter((_, i) => i !== idx) }))

  const addLogo = (isPast: boolean) => {
    if (cfg.logos.length >= 4) return
    set('logos', [...cfg.logos, newLogo(isPast)])
  }

  const currentLogos = cfg.logos.filter(l => !l.isPast)
  const pastLogos    = cfg.logos.filter(l => l.isPast)

  const TABS: { id: Tab; label: string }[] = [
    { id: 'template', label: '01 Template' },
    { id: 'identity', label: '02 Identity' },
    { id: 'skills',   label: '03 Skills'   },
    { id: 'logo',     label: '04 Logo'     },
    { id: 'github',   label: '05 GitHub'   },
    { id: 'export',   label: '06 Export'   },
  ]

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 80px' }}>

      {/* Banner preview */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="live-pip" />
            <span style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>LIVE PREVIEW</span>
            <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--muted)', background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 4, padding: '3px 8px', letterSpacing: '0.1em', fontFamily: 'var(--mono)' }}>
              {cfg.format.width} x {cfg.format.height} — {cfg.format.label}
            </span>
          </div>
          {cfg.format.id === 'linkedin' && (
            <button type="button" onClick={() => set('showLinkedInZone', !cfg.showLinkedInZone)} style={{
              fontSize: 9, color: cfg.showLinkedInZone ? 'var(--tan)' : 'var(--muted)',
              letterSpacing: '0.1em', cursor: 'pointer',
              border: `0.5px solid ${cfg.showLinkedInZone ? 'var(--tan-mid)' : 'var(--border)'}`,
              background: cfg.showLinkedInZone ? 'var(--tan-dim)' : 'transparent',
              borderRadius: 4, padding: '4px 10px', fontFamily: 'var(--mono)',
            }}>
              {cfg.showLinkedInZone ? 'Hide' : 'Show'} Profile Photo Zone
            </button>
          )}
        </div>

        <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <BannerCanvas config={cfg} svgRef={svgRef} />
        </div>
      </div>

      {/* Control panel */}
      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)', background: 'var(--surface2)' }}>
          {TABS.map(t => (
            <button type="button" key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '13px 8px',
              background: tab === t.id ? 'var(--surface)' : 'transparent',
              border: 'none',
              borderBottom: tab === t.id ? '1.5px solid var(--tan)' : '1.5px solid transparent',
              color: tab === t.id ? 'var(--tan)' : 'var(--muted)',
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em',
              cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px' }}>

          {/* TEMPLATE */}
          {tab === 'template' && (
            <TemplateGrid
              cfg={cfg}
              onTemplate={(t: BannerTemplate) => {
                set('template', t)
                set('pattern', t.pattern)
                set('accentColor', t.accentColor)
              }}
              onFormat={(f: CanvasFormat) => set('format', f)}
              onPattern={(p: PatternId) => set('pattern', p)}
              onAccent={(c: string) => set('accentColor', c)}
              onPatternOpacity={(v: number) => set('patternOpacity', v)}
            />
          )}

          {/* IDENTITY */}
          {tab === 'identity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <span style={secLabel}>Text and Typography</span>
              <TextStyleRow
                label="Full Name" placeholder="Jane Smith"
                textValue={cfg.name} onText={v => set('name', v)}
                font={cfg.nameFont} onFont={f => set('nameFont', f)}
                weight={cfg.nameWeight} onWeight={w => set('nameWeight', w)}
                size={cfg.nameSize} onSize={s => set('nameSize', s)}
              />
              <TextStyleRow
                label="Role / Title" placeholder="Software Engineer"
                textValue={cfg.role} onText={v => set('role', v)}
                font={cfg.roleFont} onFont={f => set('roleFont', f)}
                weight={cfg.roleWeight} onWeight={w => set('roleWeight', w)}
                size={cfg.roleSize} onSize={s => set('roleSize', s)}
              />
              <TextStyleRow
                label="Team / Department" placeholder="Platform Engineering"
                textValue={cfg.team} onText={v => set('team', v)}
                font={cfg.teamFont} onFont={f => set('teamFont', f)}
                weight={cfg.teamWeight} onWeight={w => set('teamWeight', w)}
                size={cfg.teamSize} onSize={s => set('teamSize', s)}
              />
              <TextStyleRow
                label="Tagline" placeholder="Building things that matter."
                textValue={cfg.tagline} onText={v => set('tagline', v)}
                font={cfg.taglineFont} onFont={f => set('taglineFont', f)}
                weight={cfg.taglineWeight} onWeight={w => set('taglineWeight', w)}
                size={cfg.taglineSize} onSize={s => set('taglineSize', s)}
              />
            </div>
          )}

          {/* SKILLS */}
          {tab === 'skills' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 36 }}>
              <SkillPicker
                selected={cfg.skills}
                onChange={(skills: Skill[]) => set('skills', skills)}
                max={cfg.maxSkills}
                wide
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <span style={secLabel}>Options</span>
                <F label="Max Skills Shown">
                  <input type="number" min={1} max={15} value={cfg.maxSkills}
                    onChange={e => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) set('maxSkills', n) }}
                    style={{ ...inp, width: 80 }} />
                </F>
                <Toggle label="Show Skill Labels"
                  value={cfg.showSkillLabels} onChange={v => set('showSkillLabels', v)} />
                <Divider />
                <div>
                  <span style={lbl}>Selected ({cfg.skills.length} / {cfg.maxSkills})</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                    {cfg.skills.length === 0 && (
                      <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>None selected</span>
                    )}
                    {cfg.skills.map(sk => (
                      <button type="button" key={sk.id}
                        onClick={() => set('skills', cfg.skills.filter(s => s.id !== sk.id))}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          background: 'var(--tan-dim)', border: '0.5px solid var(--tan-mid)',
                          borderRadius: 4, padding: '4px 8px', fontSize: 9,
                          color: 'var(--tan)', letterSpacing: '0.05em',
                          cursor: 'pointer', fontFamily: 'var(--mono)',
                        }}>
                        <img src={sk.iconUrl} alt={sk.label} width={10} height={10} style={{ objectFit: 'contain' }} />
                        {sk.label} x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LOGO */}
          {tab === 'logo' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 36 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={secLabel}>Company Logos</span>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <button type="button" onClick={() => addLogo(false)}
                      disabled={currentLogos.length >= 1 || cfg.logos.length >= 4}
                      style={{
                        background: 'var(--tan-dim)', border: '0.5px solid var(--tan-mid)',
                        borderRadius: 5, color: 'var(--tan)', fontFamily: 'var(--mono)',
                        fontSize: 9, letterSpacing: '0.15em', padding: '6px 12px',
                        cursor: cfg.logos.length >= 4 || currentLogos.length >= 1 ? 'not-allowed' : 'pointer',
                        opacity: cfg.logos.length >= 4 || currentLogos.length >= 1 ? 0.4 : 1,
                      }}>
                      + Current Company
                    </button>
                    <button type="button" onClick={() => addLogo(true)}
                      disabled={pastLogos.length >= 3 || cfg.logos.length >= 4}
                      style={{
                        background: 'var(--surface2)', border: '0.5px solid var(--border)',
                        borderRadius: 5, color: 'var(--muted)', fontFamily: 'var(--mono)',
                        fontSize: 9, letterSpacing: '0.15em', padding: '6px 12px',
                        cursor: cfg.logos.length >= 4 || pastLogos.length >= 3 ? 'not-allowed' : 'pointer',
                        opacity: cfg.logos.length >= 4 || pastLogos.length >= 3 ? 0.4 : 1,
                      }}>
                      + Past Company (Ex-)
                    </button>
                  </div>
                </div>

                {cfg.logos.length === 0 && (
                  <p style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', lineHeight: 1.7 }}>
                    Add up to 1 current company and 3 past companies. Past companies show an Ex- prefix automatically.
                  </p>
                )}

                {cfg.logos.map((logo, idx) => (
                  <LogoRow
                    key={logo.id}
                    logo={logo}
                    onChange={updated => setLogoAt(idx, updated)}
                    onRemove={() => removeLogoAt(idx)}
                  />
                ))}
              </div>

              {/* Right: size + resources */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <span style={secLabel}>Options</span>

                <div style={{ background: 'var(--surface2)', border: '0.5px solid var(--border)', borderRadius: 7, padding: '10px 13px' }}>
                  <div style={{ fontSize: 9, color: 'var(--tan)', fontFamily: 'var(--mono)', letterSpacing: '0.18em', marginBottom: 6 }}>PLACEMENT</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)', lineHeight: 1.8 }}>
                    <div>Current company: top-right</div>
                    <div>Past companies: bottom-right</div>
                  </div>
                </div>

                <F label="Logo Size (px)">
                  <input type="number" min={40} max={320} value={cfg.logoSize}
                    onChange={e => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) set('logoSize', n) }}
                    style={inp} />
                </F>

                <Divider />

                <span style={secLabel}>Free Resources</span>
                {LOGO_SOURCES.map(src => (
                  <a key={src.url} href={src.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'var(--surface2)', border: '0.5px solid var(--border)',
                      borderRadius: 7, padding: '9px 12px', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--tan-mid)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    >
                      <div style={{ fontSize: 10, color: 'var(--text)', fontFamily: 'var(--mono)', marginBottom: 2 }}>
                        {src.name}
                      </div>
                      <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--mono)', lineHeight: 1.5 }}>
                        {src.hint}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* GIT PLATFORM BADGE */}
          {tab === 'github' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 36 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <span style={secLabel}>Git Platform Badge</span>

                <div style={{
                  background: 'var(--surface2)', border: '0.5px solid var(--border)',
                  borderRadius: 9, padding: '18px 20px',
                  display: 'flex', flexDirection: 'column', gap: 16,
                }}>
                  {/* Platform selector */}
                  <F label="Platform">
                    <div style={{ display: 'flex', gap: 8 }}>
                      {GIT_PLATFORMS.map(p => (
                        <button key={p.id} type="button" onClick={() => set('gitPlatform', p.id)}
                          style={{
                            flex: 1, padding: '8px 12px',
                            background: cfg.gitPlatform === p.id ? 'var(--tan-dim)' : 'var(--surface)',
                            border: `0.5px solid ${cfg.gitPlatform === p.id ? 'var(--tan-mid)' : 'var(--border)'}`,
                            borderRadius: 6, cursor: 'pointer',
                            color: cfg.gitPlatform === p.id ? 'var(--tan)' : 'var(--muted)',
                            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em',
                            textAlign: 'center',
                          }}>
                            {p.icon} {p.label}
                          </button>
                      ))}
                    </div>
                  </F>

                  {/* Username */}
                  <F label="Username">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'end' }}>
                      <input style={{ ...inp, flex: 1 }} value={cfg.gitUsername}
                        onChange={e => set('gitUsername', e.target.value)}
                        placeholder="e.g. yellatp" />
                      {cfg.gitUsername && (
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                          border: '0.5px solid var(--border)', flexShrink: 0,
                          background: 'var(--surface)',
                        }}>
                          <img src={gitAvatarUrl(cfg.gitUsername, cfg.gitPlatform)}
                            alt={cfg.gitUsername}
                            width={40} height={40}
                            style={{ objectFit: 'cover', display: 'block' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        </div>
                      )}
                    </div>
                  </F>

                  {/* Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 4 }}>
                    <Toggle label="Show avatar on banner"
                      value={cfg.showGitBadge} onChange={v => set('showGitBadge', v)} />
                  </div>

                  {/* Preview */}
                  {cfg.gitUsername && cfg.showGitBadge && (
                    <div style={{
                      background: '#07090C', border: '0.5px solid var(--border)',
                      borderRadius: 7, padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <img src={gitAvatarUrl(cfg.gitUsername, cfg.gitPlatform)}
                        alt={cfg.gitUsername}
                        width={28} height={28}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text)', fontFamily: 'var(--mono)' }}>
                          @{cfg.gitUsername}
                        </div>
                        <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--mono)', marginTop: 2 }}>
                          Avatar renders at extreme bottom-left
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <span style={secLabel}>How it works</span>
                <div style={{
                  background: 'var(--surface2)', border: '0.5px solid var(--border)',
                  borderRadius: 7, padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 9, color: 'var(--tan)', fontFamily: 'var(--mono)', letterSpacing: '0.18em', marginBottom: 8 }}>BANNER RENDER</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)', lineHeight: 1.9 }}>
                    <div>• Platform icon + username text</div>
                    <div>• Positioned at top-left corner</div>
                    <div>• Supports GitHub / GitLab / GitBucket</div>
                    <div>• Toggle on/off anytime</div>
                  </div>
                </div>

                <div style={{
                  background: 'var(--surface2)', border: '0.5px solid var(--border)',
                  borderRadius: 7, padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 9, color: 'var(--tan)', fontFamily: 'var(--mono)', letterSpacing: '0.18em', marginBottom: 8 }}>NOTE</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)', lineHeight: 1.8 }}>
                    The platform icon is rendered using Simple Icons CDN. The username links to the profile page.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPORT */}
          {tab === 'export' && (
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 40 }}>
              <div>
                <span style={secLabel}>Download</span>
                <ExportPanel config={cfg} svgRef={svgRef} />
              </div>
              <div>
                <span style={secLabel}>Summary</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    ['Format',   cfg.format.label],
                    ['Canvas',   `${cfg.format.width} x ${cfg.format.height}px`],
                    ['Theme',    cfg.template.label],
                    ['Pattern',  cfg.pattern],
                    ['Name',     cfg.name || '-'],
                    ['Role',     cfg.role || '-'],
                    ['Team',     cfg.team || '-'],
                    ['Skills',   `${cfg.skills.length} selected`],
                    ['Logos',    `${cfg.logos.length} added`],
                    ['Git Badge', cfg.showGitBadge && cfg.gitUsername ? `@${cfg.gitUsername} (${cfg.gitPlatform})` : '-'],
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k} style={{
                      background: 'var(--surface2)', border: '0.5px solid var(--border)',
                      borderRadius: 7, padding: '9px 13px',
                    }}>
                      <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.2em', fontFamily: 'var(--mono)', marginBottom: 3 }}>{k}</div>
                      <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .live-pip {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--tan); display: inline-block;
          animation: pip 2.4s ease-in-out infinite;
        }
        @keyframes pip {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.7); }
        }
        input[type="number"] { -moz-appearance: textfield; appearance: textfield; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { display: none; }
        input:focus, select:focus { border-color: var(--tan) !important; }
        select option { background: #0D1117; color: #E8E4DE; }
      `}</style>
    </div>
  )
}
