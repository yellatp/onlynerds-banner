import { TEMPLATES, FORMATS, PATTERNS_LIST, ACCENT_PRESETS } from '@data/templates'
import type { BannerTemplate, CanvasFormat, PatternId } from '@data/templates'
import type { BannerConfig } from './types'

type Props = {
  cfg: BannerConfig
  onTemplate: (t: BannerTemplate) => void
  onFormat: (f: CanvasFormat) => void
  onPattern: (p: PatternId) => void
  onAccent: (c: string) => void
  onPatternOpacity: (v: number) => void
}

const sel: React.CSSProperties = {
  background: 'var(--surface2)',
  border: '0.5px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text)',
  fontFamily: 'var(--mono)',
  fontSize: 12,
  padding: '8px 10px',
  outline: 'none',
  cursor: 'pointer',
  width: '100%',
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

export default function TemplateGrid({ cfg, onTemplate, onFormat, onPattern, onAccent, onPatternOpacity }: Props) {
  // Derive active accent preset id for the select
  const activeAccentId = ACCENT_PRESETS.find(a => a.color === cfg.accentColor)?.id ?? 'custom'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Top control row: dropdowns ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, alignItems: 'end' }}>

        <div>
          <span style={lbl}>Canvas Format</span>
          <select style={sel} value={cfg.format.id}
            onChange={e => {
              const f = FORMATS.find(x => x.id === e.target.value)
              if (f) onFormat(f)
            }}>
            {FORMATS.map(f => (
              <option key={f.id} value={f.id}>
                {f.label} — {f.width}x{f.height}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span style={lbl}>Pattern</span>
          <select style={sel} value={cfg.pattern}
            onChange={e => onPattern(e.target.value as PatternId)}>
            {PATTERNS_LIST.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <span style={lbl}>Accent Color</span>
          <select style={sel} value={activeAccentId}
            onChange={e => {
              const preset = ACCENT_PRESETS.find(a => a.id === e.target.value)
              if (preset) onAccent(preset.color)
            }}>
            {ACCENT_PRESETS.map(a => (
              <option key={a.id} value={a.id}>{a.label} — {a.color}</option>
            ))}
          </select>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={lbl}>Pattern Opacity</span>
            <span style={{ fontSize: 9, color: 'var(--tan)', fontFamily: 'var(--mono)' }}>
              {Math.round(cfg.patternOpacity * 100)}%
            </span>
          </div>
          <input type="range" min={0} max={0.6} step={0.02}
            value={cfg.patternOpacity}
            onChange={e => onPatternOpacity(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--tan)', marginTop: 2 }}
          />
        </div>
      </div>

      {/* Active accent color swatch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 4, flexShrink: 0,
          background: cfg.accentColor,
          border: '0.5px solid rgba(255,255,255,0.1)',
        }} />
        <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}>
          ACCENT: {cfg.accentColor.toUpperCase()} — {cfg.template.label.toUpperCase()} THEME — {cfg.pattern.toUpperCase()} PATTERN
        </span>
      </div>

      {/* ── Template grid ─────────────────────────────────── */}
      <div>
        <span style={{ ...lbl, marginBottom: 12 }}>Theme</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
          {TEMPLATES.map(t => {
            const active = cfg.template.id === t.id
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => onTemplate(t)}
                title={t.description}
                style={{
                  background: 'transparent',
                  border: `0.5px solid ${active ? cfg.accentColor : 'var(--border)'}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  boxShadow: active ? `0 0 0 1px ${cfg.accentColor}44` : 'none',
                }}
              >
                {/* Mini banner preview */}
                <div style={{
                  height: 38,
                  background: t.bgGradient ?? t.bgColor,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: t.accentColor }} />
                  <div style={{ position: 'absolute', top: 9, left: 8, width: 32, height: 3.5, borderRadius: 2, background: '#E8E4DE', opacity: 0.45 }} />
                  <div style={{ position: 'absolute', top: 16, left: 8, width: 22, height: 2.5, borderRadius: 2, background: t.accentColor, opacity: 0.8 }} />
                  <div style={{ position: 'absolute', bottom: 7, left: 8, display: 'flex', gap: 3 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 5.5, height: 5.5, borderRadius: 1.5, background: t.accentColor, opacity: 0.5 }} />
                    ))}
                  </div>
                  {active && (
                    <div style={{ position: 'absolute', top: 4, right: 5, fontSize: 8, color: t.accentColor }}>
                      ✓
                    </div>
                  )}
                </div>
                {/* Label */}
                <div style={{
                  padding: '5px 7px',
                  background: 'var(--surface2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontSize: 7, letterSpacing: '0.1em',
                    color: active ? t.accentColor : 'var(--muted)',
                    fontFamily: 'var(--mono)',
                  }}>
                    {t.label.toUpperCase()}
                  </span>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                    background: active ? t.accentColor : 'var(--border)',
                    display: 'inline-block',
                  }} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active theme description card */}
      <div style={{
        background: cfg.template.bgColor,
        border: `0.5px solid ${cfg.accentColor}44`,
        borderRadius: 8, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.accentColor, flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 11, color: cfg.accentColor, fontFamily: 'var(--mono)', fontWeight: 600, letterSpacing: '0.1em' }}>
            {cfg.template.label}
          </span>
          <p style={{ fontSize: 9, color: 'rgba(232,228,222,0.5)', fontFamily: 'var(--mono)', marginTop: 3, lineHeight: 1.6 }}>
            {cfg.template.description}
          </p>
        </div>
      </div>
    </div>
  )
}
