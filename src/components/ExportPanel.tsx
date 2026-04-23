import { useState } from 'react'
import type { BannerConfig } from './types'

type Props = {
  config: BannerConfig
  svgRef: React.RefObject<SVGSVGElement | null>
}

// Convert any Blob to a data URL
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Fetch every <image> href and replace with an inlined data URL so the
// exported file is fully self-contained and renders correctly on canvas.
async function inlineSvgImages(svgEl: SVGSVGElement): Promise<SVGSVGElement> {
  const clone  = svgEl.cloneNode(true) as SVGSVGElement
  const images = Array.from(clone.querySelectorAll('image'))

  await Promise.allSettled(images.map(async img => {
    const href = img.getAttribute('href') || img.getAttribute('xlink:href') || ''
    if (!href || href.startsWith('data:')) return  // already embedded

    try {
      const absUrl = href.startsWith('http')
        ? href
        : new URL(href, window.location.href).href

      const resp = await fetch(absUrl, { mode: 'cors', cache: 'force-cache' })
      if (!resp.ok) return

      const dataUrl = await blobToDataUrl(await resp.blob())
      img.setAttribute('href', dataUrl)
      img.removeAttribute('xlink:href')
    } catch {
      // Remove broken image rather than leaving an unresolvable href
      img.setAttribute('href', 'data:,')
    }
  }))

  return clone
}

// Render inlined SVG onto a 2x-retina canvas and return a PNG data URL
async function renderToPng(svgEl: SVGSVGElement, width: number, height: number): Promise<string> {
  const inlined = await inlineSvgImages(svgEl)
  inlined.setAttribute('width',  String(width))
  inlined.setAttribute('height', String(height))

  const svgStr  = new XMLSerializer().serializeToString(inlined)
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl  = URL.createObjectURL(svgBlob)

  return new Promise((resolve, reject) => {
    const canvas  = document.createElement('canvas')
    canvas.width  = width  * 2
    canvas.height = height * 2
    const ctx = canvas.getContext('2d')!
    ctx.scale(2, 2)

    const img    = new Image()
    img.onload   = () => {
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(svgUrl)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror  = () => {
      URL.revokeObjectURL(svgUrl)
      reject(new Error('SVG render failed'))
    }
    img.src = svgUrl
  })
}

export default function ExportPanel({ config, svgRef }: Props) {
  const [status, setStatus] = useState<'idle' | 'exporting' | 'copied'>('idle')

  const slug = [config.name, config.format.id, config.template.id]
    .filter(Boolean).join('_').toLowerCase().replace(/\s+/g, '-') || 'banner'

  // SVG export — images inlined so the file is standalone
  const exportSVG = async () => {
    if (!svgRef.current) return
    setStatus('exporting')
    try {
      const inlined = await inlineSvgImages(svgRef.current)
      const svgStr  = new XMLSerializer().serializeToString(inlined)
      const url     = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml' }))
      Object.assign(document.createElement('a'), { href: url, download: `${slug}.svg` }).click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('SVG export failed:', err)
    } finally {
      setStatus('idle')
    }
  }

  // PNG export — canvas pipeline, no html-to-image dependency
  const exportPNG = async () => {
    if (!svgRef.current) return
    setStatus('exporting')
    try {
      const dataUrl = await renderToPng(svgRef.current, config.format.width, config.format.height)
      Object.assign(document.createElement('a'), { href: dataUrl, download: `${slug}.png` }).click()
    } catch (err) {
      console.error('PNG export failed:', err)
    } finally {
      setStatus('idle')
    }
  }

  // Copy inlined SVG as base64 data URL
  const copyDataUrl = async () => {
    if (!svgRef.current) return
    try {
      const inlined = await inlineSvgImages(svgRef.current)
      const svgStr  = new XMLSerializer().serializeToString(inlined)
      const encoded = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgStr)))}`
      await navigator.clipboard.writeText(encoded)
      setStatus('copied')
      setTimeout(() => setStatus('idle'), 1800)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const btnBase: React.CSSProperties = {
    border: 'none', borderRadius: 7, fontFamily: 'var(--mono)',
    fontWeight: 500, cursor: 'pointer', textTransform: 'uppercase',
    transition: 'opacity 0.15s',
  }

  const busy = status === 'exporting'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* PNG — primary */}
      <button type="button" onClick={exportPNG} disabled={busy}
        style={{
          ...btnBase,
          width: '100%', padding: '13px',
          background: 'var(--tan)', color: '#1a1a1a',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.25em',
          opacity: busy ? 0.7 : 1, cursor: busy ? 'wait' : 'pointer',
        }}>
        {busy ? 'EXPORTING...' : 'EXPORT PNG'}
      </button>

      {/* SVG + Copy row */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="button" onClick={exportSVG} disabled={busy}
          style={{
            ...btnBase,
            flex: 1, padding: '10px 6px',
            background: 'transparent', color: 'var(--tan)',
            border: '0.5px solid var(--border2)',
            fontSize: 9, letterSpacing: '0.2em',
            opacity: busy ? 0.5 : 1, cursor: busy ? 'wait' : 'pointer',
          }}>
          SVG
        </button>
        <button type="button" onClick={copyDataUrl} disabled={busy}
          style={{
            ...btnBase,
            flex: 1, padding: '10px 6px',
            background: status === 'copied' ? 'var(--tan-dim)' : 'transparent',
            color: 'var(--tan)',
            border: `0.5px solid ${status === 'copied' ? 'var(--tan-mid)' : 'var(--border2)'}`,
            fontSize: 9, letterSpacing: '0.2em',
          }}>
          {status === 'copied' ? 'COPIED' : 'COPY URL'}
        </button>
      </div>

      {/* File info */}
      <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '0.08em', lineHeight: 1.9, fontFamily: 'var(--mono)' }}>
        <span style={{ display: 'block' }}>{slug}.svg / .png</span>
        <span style={{ display: 'block' }}>{config.format.width} x {config.format.height}px — 2x retina PNG</span>
        <span style={{ display: 'block' }}>{config.format.label} — {config.template.label}</span>
      </div>
    </div>
  )
}
