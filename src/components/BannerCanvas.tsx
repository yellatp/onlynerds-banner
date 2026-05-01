import { useRef, useCallback, useMemo } from 'react'
import type { BannerConfig, LogoEntry } from './types'
import type { PatternId } from '@data/templates'
import { useDragResize } from './useDragResize'
import type { ElementType } from './useDragResize'

// ─── SVG pattern generators ───────────────────────────────────────────────────

function makePattern(id: PatternId, color: string, opacity: number): string {
  switch (id) {
    case 'grid':
      return `<defs><pattern id="pat" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="${color}" stroke-width="0.4" opacity="${opacity}"/>
      </pattern></defs><rect width="100%" height="100%" fill="url(#pat)"/>`

    case 'dots':
      return `<defs><pattern id="pat" width="32" height="32" patternUnits="userSpaceOnUse">
        <circle cx="16" cy="16" r="0.9" fill="${color}" opacity="${opacity}"/>
      </pattern></defs><rect width="100%" height="100%" fill="url(#pat)"/>`

    case 'diagonal':
      return `<defs><pattern id="pat" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="${color}" stroke-width="0.5" opacity="${opacity}"/>
      </pattern></defs><rect width="100%" height="100%" fill="url(#pat)"/>`

    case 'hexagons':
      return `<defs><pattern id="pat" width="56" height="100" patternUnits="userSpaceOnUse">
        <path d="M28 0 L56 16 L56 50 L28 66 L0 50 L0 16 Z" fill="none" stroke="${color}" stroke-width="0.5" opacity="${opacity}"/>
        <path d="M28 66 L56 82 L56 116 L28 132 L0 116 L0 82 Z" fill="none" stroke="${color}" stroke-width="0.5" opacity="${opacity}" transform="translate(0,-33)"/>
      </pattern></defs><rect width="100%" height="100%" fill="url(#pat)"/>`

    case 'circuit':
      return `<defs><pattern id="pat" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M10 40 L40 40 M40 40 L40 10 M40 10 L70 10" fill="none" stroke="${color}" stroke-width="0.6" opacity="${opacity}"/>
        <path d="M70 40 L70 70 M70 70 L40 70 M40 70 L40 50" fill="none" stroke="${color}" stroke-width="0.6" opacity="${opacity}"/>
        <circle cx="40" cy="40" r="2.5" fill="none" stroke="${color}" stroke-width="0.6" opacity="${opacity}"/>
        <circle cx="10" cy="40" r="1.5" fill="${color}" opacity="${opacity}"/>
        <circle cx="70" cy="10" r="1.5" fill="${color}" opacity="${opacity}"/>
        <circle cx="40" cy="50" r="1.5" fill="${color}" opacity="${opacity}"/>
      </pattern></defs><rect width="100%" height="100%" fill="url(#pat)"/>`

    case 'waves':
      return `<defs><pattern id="pat" width="80" height="30" patternUnits="userSpaceOnUse">
        <path d="M0 15 C20 5, 40 25, 60 15 S80 5 80 15" fill="none" stroke="${color}" stroke-width="0.6" opacity="${opacity}"/>
      </pattern></defs><rect width="100%" height="100%" fill="url(#pat)"/>`

    case 'crosses':
      return `<defs><pattern id="pat" width="36" height="36" patternUnits="userSpaceOnUse">
        <line x1="18" y1="10" x2="18" y2="26" stroke="${color}" stroke-width="0.7" opacity="${opacity}"/>
        <line x1="10" y1="18" x2="26" y2="18" stroke="${color}" stroke-width="0.7" opacity="${opacity}"/>
      </pattern></defs><rect width="100%" height="100%" fill="url(#pat)"/>`

    case 'zigzag':
      return `<defs><pattern id="pat" width="40" height="20" patternUnits="userSpaceOnUse">
        <polyline points="0,20 10,0 20,20 30,0 40,20" fill="none" stroke="${color}" stroke-width="0.6" opacity="${opacity}"/>
      </pattern></defs><rect width="100%" height="100%" fill="url(#pat)"/>`

    default:
      return ''
  }
}

// Ensure Simple Icons CDN URLs use the white color variant for dark backgrounds
function whiteIcon(url: string): string {
  if (url.includes('cdn.simpleicons.org') && !url.match(/\/[0-9a-fA-F]{6}$/)) {
    return url + '/ffffff'
  }
  return url
}

// ─── Current company logo (top-right) ────────────────────────────────────────

type CurrentLogoProps = {
  logo: LogoEntry
  logoW: number
  logoH: number
  namePx: number
  rightEdge: number
  topY: number
  accent: string
  scaleH: number
  scaleW: number
}

function CurrentLogo({ logo, logoW, logoH, namePx, rightEdge, topY, accent, scaleH, scaleW }: CurrentLogoProps) {
  const imgX  = rightEdge - logoW
  const textX = rightEdge - logoW / 2
  const labelY = topY + logoH + Math.round(12 * scaleH)

  return (
    <g>
      {logo.showAsText ? (
        <text
          x={textX} y={topY + logoH / 2 + namePx}
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={Math.round(13 * scaleH)}
          fontWeight={600}
          fill={accent}
          letterSpacing={Math.round(2 * scaleW)}
          textAnchor="middle"
          opacity={0.9}
        >{logo.name.toUpperCase()}</text>
      ) : logo.logoUrl ? (
        <image
          href={whiteIcon(logo.logoUrl)}
          x={imgX} y={topY}
          width={logoW} height={logoH}
          preserveAspectRatio="xMidYMid meet"
        ><title>{logo.name || 'Company logo'}</title></image>
      ) : null}

      {logo.name && !logo.showAsText && (
        <text
          x={textX} y={labelY}
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={namePx}
          fontWeight={500}
          fill={accent}
          fillOpacity={0.8}
          letterSpacing={Math.round(1.5 * scaleW)}
          textAnchor="middle"
        >{logo.name.toUpperCase()}</text>
      )}
    </g>
  )
}

// ─── Past companies row (bottom-right, horizontal) ────────────────────────────

type PastLogosRowProps = {
  logos: LogoEntry[]
  pastW: number
  pastH: number
  namePx: number
  rightEdge: number
  bottomY: number
  accent: string
  scaleH: number
  scaleW: number
}

function PastLogosRow({ logos, pastW, pastH, namePx, rightEdge, bottomY, accent, scaleH, scaleW }: PastLogosRowProps) {
  if (logos.length === 0) return null

  const gap = Math.round(20 * scaleW)
  const totalW = logos.length * pastW + (logos.length - 1) * gap
  const startX = rightEdge - totalW

  return (
    <>
      {logos.map((logo, i) => {
        const imgX  = startX + i * (pastW + gap)
        const textX = imgX + pastW / 2
        const labelY = bottomY + pastH + Math.round(11 * scaleH)

        return (
          <g key={logo.id}>
            {logo.showAsText ? (
              <text
                x={textX} y={bottomY + pastH / 2 + namePx}
                fontFamily="'IBM Plex Mono', monospace"
                fontSize={Math.round(10 * scaleH)}
                fontWeight={400}
                fill="#E8E4DE"
                letterSpacing={Math.round(1.5 * scaleW)}
                textAnchor="middle"
                opacity={0.55}
              >Ex - {logo.name.toUpperCase()}</text>
            ) : logo.logoUrl ? (
              <image
                href={whiteIcon(logo.logoUrl)}
                x={imgX} y={bottomY}
                width={pastW} height={pastH}
                preserveAspectRatio="xMidYMid meet"
                opacity={0.6}
              ><title>{logo.name || 'Company logo'}</title></image>
            ) : null}

            {logo.name && !logo.showAsText && (
              <text
                x={textX} y={labelY}
                fontFamily="'IBM Plex Mono', monospace"
                fontSize={namePx}
                fontWeight={400}
                fill="#E8E4DE"
                fillOpacity={0.45}
                letterSpacing={Math.round(1.5 * scaleW)}
                textAnchor="middle"
              >Ex - {logo.name.toUpperCase()}</text>
            )}
          </g>
        )
      })}
    </>
  )
}

// ─── Git platform badge (top-left) ───────────────────────────────────────────

const GIT_PLATFORM_ICONS: Record<string, string> = {
  github:    'https://cdn.simpleicons.org/github/ffffff',
  gitlab:    'https://cdn.simpleicons.org/gitlab/ffffff',
  gitbucket: 'https://cdn.simpleicons.org/gitbucket/ffffff',
}

const GIT_PROFILE_URLS: Record<string, (u: string) => string> = {
  github:    (u) => `https://github.com/${encodeURIComponent(u)}`,
  gitlab:    (u) => `https://gitlab.com/${encodeURIComponent(u)}`,
  gitbucket: (u) => `https://gitbucket.com/${encodeURIComponent(u)}`,
}

type GitBadgeProps = {
  username: string
  platform: 'github' | 'gitlab' | 'gitbucket'
  topY: number
  leftPad: number
  scaleH: number
  scaleW: number
  accent: string
  /** Optional size override from gitBadgeSize config */
  sizeOverride?: number
}

function GitBadge({ username, platform, topY, leftPad, scaleH, scaleW, accent, sizeOverride }: GitBadgeProps) {
  const iconUrl = GIT_PLATFORM_ICONS[platform]
  const iconSz = sizeOverride ?? Math.round(18 * scaleH)
  const fontSize = Math.round(iconSz * 0.6)
  const gap = Math.round(6 * scaleW)
  const y = topY
  const textX = leftPad + iconSz + gap

  return (
    <g>
      {/* Platform icon */}
      <image
        href={iconUrl}
        x={leftPad} y={y}
        width={iconSz} height={iconSz}
        preserveAspectRatio="xMidYMid meet"
      >
        <title>{platform}</title>
      </image>
      {/* Username text (acts as link) */}
      <text
        x={textX} y={y + iconSz - Math.round(2 * scaleH)}
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={fontSize}
        fontWeight={500}
        fill={accent}
        fillOpacity={0.85}
        letterSpacing={Math.round(0.5 * scaleW)}
      >
        {username}
      </text>
    </g>
  )
}

// ─── Selection overlay helpers ───────────────────────────────────────────────

/** Render a dashed selection outline around a bounding box */
function SelectionOutline({ box, accent }: { box: { x: number; y: number; width: number; height: number }; accent: string }) {
  return (
    <rect
      x={box.x - 2} y={box.y - 2}
      width={box.width + 4} height={box.height + 4}
      fill="none"
      stroke={accent}
      strokeWidth={1.2}
      strokeDasharray="5 3"
      opacity={0.7}
      pointerEvents="none"
    />
  )
}

/** Inline resize +/- buttons rendered inside the canvas on the selected element.
 *  Positioned left (shrink) and right (enlarge) of the element's bounding box.
 *  Uses onMouseDown with stopPropagation to prevent drag interference. */
const BTN_SZ = 22
function ResizeButtons({ box, accent, onResize }: {
  box: { x: number; y: number; width: number; height: number }
  accent: string
  onResize: (delta: number) => void
}) {
  const cy = box.y + box.height / 2
  const leftX = box.x - BTN_SZ - 6
  const rightX = box.x + box.width + 6

  const handleResize = (delta: number) => (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onResize(delta)
  }

  return (
    <g>
      {/* Minus button (left) — SHRINK */}
      <g onMouseDown={handleResize(-1)} style={{ cursor: 'pointer' }}>
        <rect
          x={leftX} y={cy - BTN_SZ / 2}
          width={BTN_SZ} height={BTN_SZ} rx={4}
          fill={accent} opacity={0.9}
        />
        <text
          x={leftX + BTN_SZ / 2} y={cy}
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={11} fontWeight={700}
          fill="#1a1a1a" textAnchor="middle"
          dominantBaseline="central" pointerEvents="none"
        >−</text>
        <text
          x={leftX + BTN_SZ / 2} y={cy - BTN_SZ / 2 - 4}
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={7} fill={accent} fillOpacity={0.6}
          textAnchor="middle" pointerEvents="none"
        >SHRINK</text>
      </g>
      {/* Plus button (right) — ENLARGE */}
      <g onMouseDown={handleResize(1)} style={{ cursor: 'pointer' }}>
        <rect
          x={rightX} y={cy - BTN_SZ / 2}
          width={BTN_SZ} height={BTN_SZ} rx={4}
          fill={accent} opacity={0.9}
        />
        <text
          x={rightX + BTN_SZ / 2} y={cy}
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={11} fontWeight={700}
          fill="#1a1a1a" textAnchor="middle"
          dominantBaseline="central" pointerEvents="none"
        >+</text>
        <text
          x={rightX + BTN_SZ / 2} y={cy + BTN_SZ / 2 + 10}
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={7} fill={accent} fillOpacity={0.6}
          textAnchor="middle" pointerEvents="none"
        >ENLARGE</text>
      </g>
    </g>
  )
}

/** Invisible hit-target overlay for drag detection */
function HitTarget({ box, elementType, onRegister }: {
  box: { x: number; y: number; width: number; height: number }
  elementType: ElementType
  onRegister: (type: ElementType, box: { x: number; y: number; width: number; height: number }) => void
}) {
  // Register this element's bounding box for hit-testing
  onRegister(elementType, box)
  return (
    <rect
      x={box.x} y={box.y}
      width={box.width} height={box.height}
      fill="transparent"
      style={{ cursor: 'move' }}
    />
  )
}

// ─── Main canvas ─────────────────────────────────────────────────────────────

type Props = {
  config: BannerConfig
  svgRef?: React.RefObject<SVGSVGElement | null>
  editMode?: boolean
  onConfigChange?: (updater: (prev: BannerConfig) => BannerConfig) => void
}

export default function BannerCanvas({ config, svgRef: externalRef, editMode = false, onConfigChange }: Props) {
  const internalRef = useRef<SVGSVGElement>(null)
  const svgRef = externalRef ?? internalRef

  const {
    format, template, pattern, accentColor, patternOpacity,
    name, role, team, tagline,
    nameFont, roleFont, teamFont, taglineFont,
    nameWeight, roleWeight, teamWeight, taglineWeight,
    nameSize, roleSize, teamSize, taglineSize,
    skills, maxSkills, showSkillLabels,
    logos, logoSize,
    gitUsername, gitPlatform, showGitBadge,
    showLinkedInZone,
    namePos, rolePos, teamPos, taglinePos,
    skillsPos, currentLogoPos, pastLogosPos, gitBadgePos,
  } = config

  const { width, height } = format
  const bgColor = template.bgColor
  const accent  = accentColor

  const scaleH = height / 396
  const scaleW = width / 1584

  // LinkedIn: safe zone starts at 38% from left (profile photo covers 0-30%)
  const isLinkedIn = format.id === 'linkedin'
  const leftPad   = isLinkedIn ? Math.round(width * 0.38) : Math.round(width * 0.06)
  const rightPad  = Math.round(width * 0.05)
  const topPad    = Math.round(height * 0.18)

  // Vertical text rhythm — generous spacing
  const namePx    = Math.round(nameSize    * scaleH)
  const rolePx    = Math.round(roleSize    * scaleH)
  const teamPx    = Math.round(teamSize    * scaleH)
  const taglinePx = Math.round(taglineSize * scaleH)
  const lineGap   = Math.round(18 * scaleH)

  let ty         = topPad + namePx
  const nameY    = ty; if (name)    ty += namePx    * 0.35 + rolePx    + lineGap
  const roleY    = ty; if (role)    ty += rolePx    * 0.35 + teamPx    + lineGap
  const teamY    = ty; if (team)    ty += teamPx    * 0.35 + taglinePx + lineGap
  const taglineY = ty

  // Skills
  const skillIconSz = Math.round((skillsPos?.size ?? 36) * scaleH)
  const skillGap    = Math.round(24 * scaleW)
  const skillRowY   = skillsPos?.y ?? Math.round(height * 0.82)
  const skillRowX   = skillsPos?.x ?? leftPad
  const displayedSkills = skills.slice(0, maxSkills)

  // Logo dimensions
  const effectiveLogoSize = currentLogoPos?.size ?? logoSize
  const logoW  = Math.round(effectiveLogoSize * scaleW)
  const logoH  = Math.round(effectiveLogoSize * 0.42 * scaleH)
  const pastW  = Math.round(logoW * 0.72)
  const pastH  = Math.round(logoH * 0.72)
  const logoNamePx = Math.round(8 * scaleH)

  const rightEdge = width - rightPad

  // Current: top-right anchor
  const currentTopY = currentLogoPos?.y ?? Math.round(20 * scaleH)
  const currentLeftX = currentLogoPos?.x ?? (rightEdge - logoW)

  // Past: bottom-right anchor, sits above skill row (moved up)
  const pastBottomY = pastLogosPos?.y ?? (Math.round(height * 0.55) - pastH)
  const pastLeftX = pastLogosPos?.x

  const currentLogos = logos.filter(l => !l.isPast)
  const pastLogos    = logos.filter(l =>  l.isPast)

  const patternSvg = makePattern(pattern, accent, patternOpacity)

  // ── Drag-resize hook ────────────────────────────────────────────────────

  const effectiveOnChange = onConfigChange ?? (() => {})

  const {
    selectedElement,
    registerBox,
    onMouseDown: dragMouseDown,
    onMouseMove: dragMouseMove,
    onMouseUp: dragMouseUp,
    onTouchStart: dragTouchStart,
    onTouchMove: dragTouchMove,
    onTouchEnd: dragTouchEnd,
  } = useDragResize(config, effectiveOnChange, svgRef, editMode)

  const handleRegister = useCallback((type: ElementType, box: { x: number; y: number; width: number; height: number }) => {
    registerBox(type, box)
  }, [registerBox])

  // ── Compute bounding boxes for hit-targets ──────────────────────────────

  const nameBox = useMemo(() => {
    if (!name) return null
    const x = namePos?.x ?? leftPad
    const y = namePos?.y ?? nameY
    const w = Math.round(name.length * namePx * 0.6)
    const h = namePx + 4
    return { x, y: y - namePx, width: w, height: h }
  }, [name, namePos, leftPad, nameY, namePx])

  const roleBox = useMemo(() => {
    if (!role) return null
    const x = rolePos?.x ?? leftPad
    const y = rolePos?.y ?? roleY
    const w = Math.round(role.length * rolePx * 0.65)
    const h = rolePx + 4
    return { x, y: y - rolePx, width: w, height: h }
  }, [role, rolePos, leftPad, roleY, rolePx])

  const teamBox = useMemo(() => {
    if (!team) return null
    const x = teamPos?.x ?? leftPad
    const y = teamPos?.y ?? teamY
    const w = Math.round(team.length * teamPx * 0.6)
    const h = teamPx + 4
    return { x, y: y - teamPx, width: w, height: h }
  }, [team, teamPos, leftPad, teamY, teamPx])

  const taglineBox = useMemo(() => {
    if (!tagline) return null
    const x = taglinePos?.x ?? leftPad
    const y = taglinePos?.y ?? taglineY
    const w = Math.round(tagline.length * taglinePx * 0.6)
    const h = taglinePx + 4
    return { x, y: y - taglinePx, width: w, height: h }
  }, [tagline, taglinePos, leftPad, taglineY, taglinePx])

  const skillsBox = useMemo(() => {
    if (displayedSkills.length === 0) return null
    const count = displayedSkills.length
    const totalW = count * skillIconSz + (count - 1) * skillGap
    return { x: skillRowX, y: skillRowY, width: totalW, height: skillIconSz + (showSkillLabels ? 20 : 0) }
  }, [displayedSkills, skillIconSz, skillGap, skillRowX, skillRowY, showSkillLabels])

  const currentLogoBox = useMemo(() => {
    if (!currentLogos[0]) return null
    const x = currentLeftX
    const y = currentTopY
    const h = logoH + (currentLogos[0].name && !currentLogos[0].showAsText ? Math.round(12 * scaleH) + logoNamePx : 0)
    return { x, y, width: logoW, height: h }
  }, [currentLogos, currentLeftX, currentTopY, logoW, logoH, logoNamePx, scaleH])

  const pastLogosBox = useMemo(() => {
    if (pastLogos.length === 0) return null
    const gap = Math.round(20 * scaleW)
    const totalW = pastLogos.length * pastW + (pastLogos.length - 1) * gap
    const startX = pastLeftX ?? (rightEdge - totalW)
    const h = pastH + (pastLogos.some(l => l.name && !l.showAsText) ? Math.round(11 * scaleH) + logoNamePx : 0)
    return { x: startX, y: pastBottomY, width: totalW, height: h }
  }, [pastLogos, pastW, pastH, pastLeftX, rightEdge, pastBottomY, logoNamePx, scaleH])

  const gitBadgeBox = useMemo(() => {
    if (!showGitBadge || !gitUsername) return null
    const iconSz = Math.round(18 * scaleH)
    const gap = Math.round(6 * scaleW)
    const fontSize = Math.round(11 * scaleH)
    const textW = Math.round(gitUsername.length * fontSize * 0.6)
    const x = gitBadgePos?.x ?? leftPad
    const y = gitBadgePos?.y ?? currentTopY
    return { x, y, width: iconSz + gap + textW, height: iconSz }
  }, [showGitBadge, gitUsername, gitBadgePos, leftPad, currentTopY, scaleH, scaleW])

  // ── Selection box for the currently selected element ────────────────────

  const selectedBox = useMemo(() => {
    if (!selectedElement) return null
    switch (selectedElement) {
      case 'name':        return nameBox
      case 'role':        return roleBox
      case 'team':        return teamBox
      case 'tagline':     return taglineBox
      case 'skills':      return skillsBox
      case 'currentLogo': return currentLogoBox
      case 'pastLogos':   return pastLogosBox
      case 'gitBadge':    return gitBadgeBox
    }
  }, [selectedElement, nameBox, roleBox, teamBox, taglineBox, skillsBox, currentLogoBox, pastLogosBox, gitBadgeBox])

  return (
    <svg
      ref={svgRef as React.Ref<SVGSVGElement>}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', display: 'block' }}
      onMouseDown={editMode ? dragMouseDown : undefined}
      onMouseMove={editMode ? dragMouseMove : undefined}
      onMouseUp={editMode ? dragMouseUp : undefined}
      onTouchStart={editMode ? dragTouchStart : undefined}
      onTouchMove={editMode ? dragTouchMove : undefined}
      onTouchEnd={editMode ? dragTouchEnd : undefined}
    >
      <defs>
        <clipPath id="canvas-clip">
          <rect width={width} height={height} />
        </clipPath>
        <radialGradient id="vignette" cx="85%" cy="50%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.05" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width={width} height={height} fill={bgColor} />

      {/* Pattern */}
      {pattern !== 'none' && (
        <g clipPath="url(#canvas-clip)" dangerouslySetInnerHTML={{ __html: patternSvg }} />
      )}

      {/* Accent glow */}
      <rect width={width} height={height} fill="url(#vignette)" />

      {/* Left accent bar */}
      <rect x={0} y={0} width={Math.max(3, Math.round(4 * scaleW))} height={height} fill={accent} opacity={0.9} />

      {/* LinkedIn zone overlay */}
      {showLinkedInZone && isLinkedIn && (
        <>
          <rect x={0} y={0} width={width * 0.30} height={height}
            fill={accent} fillOpacity={0.06} />
          <line x1={width * 0.30} y1={0} x2={width * 0.30} y2={height}
            stroke={accent} strokeWidth={0.8} strokeDasharray="8 5" opacity={0.4} />
          <text
            x={width * 0.08}
            y={height / 2 + 4}
            fontFamily="'IBM Plex Mono', monospace"
            fontSize={Math.round(9 * scaleH)}
            fill={accent} opacity={0.4} letterSpacing={3}
            transform={`rotate(-90, ${width * 0.08}, ${height / 2})`}
            textAnchor="middle"
          >
            PROFILE PHOTO ZONE
          </text>
        </>
      )}

      {/* Name */}
      {name && (
        <text x={namePos?.x ?? leftPad} y={namePos?.y ?? nameY}
          fontFamily={nameFont.family} fontSize={namePx} fontWeight={nameWeight}
          fill="#E8E4DE" letterSpacing={Math.round(0.5 * scaleW)}
        >{name}</text>
      )}

      {/* Role */}
      {role && (
        <text x={rolePos?.x ?? leftPad} y={rolePos?.y ?? roleY}
          fontFamily={roleFont.family} fontSize={rolePx} fontWeight={roleWeight}
          fill={accent} letterSpacing={Math.round(2 * scaleW)}
        >{role.toUpperCase()}</text>
      )}

      {/* Team */}
      {team && (
        <text x={teamPos?.x ?? leftPad} y={teamPos?.y ?? teamY}
          fontFamily={teamFont.family} fontSize={teamPx} fontWeight={teamWeight}
          fill="#E8E4DE" fillOpacity={0.55} letterSpacing={Math.round(1.5 * scaleW)}
        >{team}</text>
      )}

      {/* Tagline */}
      {tagline && (
        <text x={taglinePos?.x ?? leftPad} y={taglinePos?.y ?? taglineY}
          fontFamily={taglineFont.family} fontSize={taglinePx} fontWeight={taglineWeight}
          fill="#E8E4DE" fillOpacity={0.35} letterSpacing={Math.round(scaleW)}
        >{tagline}</text>
      )}

      {/* Skills row */}
      {displayedSkills.length > 0 && (
        <g>
          <text
            x={skillRowX} y={skillRowY - Math.round(16 * scaleH)}
            fontFamily="'IBM Plex Mono', monospace"
            fontSize={Math.round(7 * scaleH)}
            fill={accent} letterSpacing={3} opacity={0.55}
          >SKILLS</text>

          {displayedSkills.map((skill, i) => {
            const sx = skillRowX + i * (skillIconSz + skillGap)
            return (
              <g key={skill.id}>
                <image
                  href={whiteIcon(skill.iconUrl)}
                  x={sx} y={skillRowY}
                  width={skillIconSz} height={skillIconSz}
                ><title>{skill.label}</title></image>
                {showSkillLabels && (
                  <text
                    x={sx + skillIconSz / 2} y={skillRowY + skillIconSz + Math.round(10 * scaleH)}
                    fontFamily="'IBM Plex Mono', monospace"
                    fontSize={Math.round(6.5 * scaleH)}
                    fill="#E8E4DE" fillOpacity={0.35}
                    textAnchor="middle" letterSpacing={0.3}
                  >{skill.label}</text>
                )}
              </g>
            )
          })}
        </g>
      )}

      {/* Current company logo — top-right (semantic, fixed) */}
      {currentLogos[0] && (
        <CurrentLogo
          logo={currentLogos[0]}
          logoW={logoW} logoH={logoH}
          namePx={logoNamePx}
          rightEdge={currentLogoPos ? currentLeftX + logoW : rightEdge}
          topY={currentTopY}
          accent={accent}
          scaleH={scaleH} scaleW={scaleW}
        />
      )}

      {/* Past company logos — bottom-right, horizontal row (semantic, fixed) */}
      <PastLogosRow
        logos={pastLogos}
        pastW={pastW} pastH={pastH}
        namePx={logoNamePx}
        rightEdge={pastLogosPos ? (pastLeftX ?? rightEdge) + (pastLogos.length * pastW + (pastLogos.length - 1) * Math.round(20 * scaleW)) : rightEdge}
        bottomY={pastBottomY}
        accent={accent}
        scaleH={scaleH} scaleW={scaleW}
      />

      {/* Git platform badge — top-left */}
      {showGitBadge && gitUsername && (
        <GitBadge
          username={gitUsername}
          platform={gitPlatform}
          topY={gitBadgePos?.y ?? currentTopY}
          leftPad={gitBadgePos?.x ?? leftPad}
          scaleH={scaleH}
          scaleW={scaleW}
          accent={accent}
          sizeOverride={config.gitBadgeSize}
        />
      )}

      {/* Corner accent marks */}
      <g opacity={0.16}>
        <path
          d={`M ${width - Math.round(44*scaleW)} 0 L ${width} 0 L ${width} ${Math.round(44*scaleH)}`}
          fill="none" stroke={accent} strokeWidth={0.8}
        />
        <path
          d={`M ${leftPad + Math.round(18*scaleW)} ${height} L ${leftPad} ${height} L ${leftPad} ${height - Math.round(18*scaleH)}`}
          fill="none" stroke={accent} strokeWidth={0.8} opacity={0.5}
        />
      </g>

      {/* ── Edit mode overlays ────────────────────────────────────────────── */}
      {editMode && (
        <g>
          {/* Hit-target overlays (invisible, for drag detection) */}
          {nameBox && <HitTarget box={nameBox} elementType="name" onRegister={handleRegister} />}
          {roleBox && <HitTarget box={roleBox} elementType="role" onRegister={handleRegister} />}
          {teamBox && <HitTarget box={teamBox} elementType="team" onRegister={handleRegister} />}
          {taglineBox && <HitTarget box={taglineBox} elementType="tagline" onRegister={handleRegister} />}
          {skillsBox && <HitTarget box={skillsBox} elementType="skills" onRegister={handleRegister} />}
          {currentLogoBox && <HitTarget box={currentLogoBox} elementType="currentLogo" onRegister={handleRegister} />}
          {pastLogosBox && <HitTarget box={pastLogosBox} elementType="pastLogos" onRegister={handleRegister} />}
          {gitBadgeBox && <HitTarget box={gitBadgeBox} elementType="gitBadge" onRegister={handleRegister} />}

          {/* Selection outline */}
          {selectedBox && (
            <SelectionOutline box={selectedBox} accent={accent} />
          )}

          {/* Inline resize +/- buttons */}
          {selectedBox && selectedElement && (
            <ResizeButtons
              box={selectedBox}
              accent={accent}
              onResize={(delta) => {
                const el = selectedElement
                if (el === 'currentLogo' || el === 'pastLogos') {
                  effectiveOnChange(prev => ({ ...prev, logoSize: Math.max(20, Math.min(320, (prev.logoSize ?? 130) + delta * 5)) }))
                } else if (el === 'skills') {
                  effectiveOnChange(prev => ({
                    ...prev,
                    skillsPos: { ...(prev.skillsPos ?? { x: 0, y: 0 }), size: Math.max(12, Math.min(80, (prev.skillsPos?.size ?? 36) + delta * 4)) },
                  }))
                } else if (el === 'gitBadge') {
                  effectiveOnChange(prev => ({ ...prev, gitBadgeSize: Math.max(8, Math.min(80, (prev.gitBadgeSize ?? 18) + delta * 2)) }))
                } else {
                  const sizeKey = el === 'name' ? 'nameSize' : el === 'role' ? 'roleSize' : el === 'team' ? 'teamSize' : 'taglineSize'
                  effectiveOnChange(prev => ({ ...prev, [sizeKey]: Math.max(5, Math.min(60, ((prev as any)[sizeKey] ?? 20) + delta * 2)) }))
                }
              }}
            />
          )}
        </g>
      )}
    </svg>
  )
}
