import { useRef } from 'react'
import type { BannerConfig, LogoEntry } from './types'
import type { PatternId } from '@data/templates'

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
}

function GitBadge({ username, platform, topY, leftPad, scaleH, scaleW, accent }: GitBadgeProps) {
  const iconUrl = GIT_PLATFORM_ICONS[platform]
  const profileUrl = GIT_PROFILE_URLS[platform](username)
  const iconSz = Math.round(18 * scaleH)
  const fontSize = Math.round(11 * scaleH)
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

// ─── Main canvas ─────────────────────────────────────────────────────────────

type Props = {
  config: BannerConfig
  svgRef?: React.RefObject<SVGSVGElement | null>
}

export default function BannerCanvas({ config, svgRef }: Props) {
  const internalRef = useRef<SVGSVGElement>(null)
  const ref = svgRef ?? internalRef

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
  const skillIconSz = Math.round(36 * scaleH)
  const skillGap    = Math.round(24 * scaleW)
  const skillRowY   = Math.round(height * 0.82)
  const displayedSkills = skills.slice(0, maxSkills)

  // Logo dimensions
  const logoW  = Math.round(logoSize * scaleW)
  const logoH  = Math.round(logoSize * 0.42 * scaleH)
  const pastW  = Math.round(logoW * 0.72)
  const pastH  = Math.round(logoH * 0.72)
  const logoNamePx = Math.round(8 * scaleH)

  const rightEdge = width - rightPad

  // Current: top-right anchor
  const currentTopY = Math.round(20 * scaleH)

  // Past: bottom-right anchor, sits above skill row (moved up)
  const pastBottomY = Math.round(height * 0.55) - pastH

  const currentLogos = logos.filter(l => !l.isPast)
  const pastLogos    = logos.filter(l =>  l.isPast)

  const patternSvg = makePattern(pattern, accent, patternOpacity)

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', display: 'block' }}
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
        <text x={leftPad} y={nameY}
          fontFamily={nameFont.family} fontSize={namePx} fontWeight={nameWeight}
          fill="#E8E4DE" letterSpacing={Math.round(0.5 * scaleW)}
        >{name}</text>
      )}

      {/* Role */}
      {role && (
        <text x={leftPad} y={roleY}
          fontFamily={roleFont.family} fontSize={rolePx} fontWeight={roleWeight}
          fill={accent} letterSpacing={Math.round(2 * scaleW)}
        >{role.toUpperCase()}</text>
      )}

      {/* Team */}
      {team && (
        <text x={leftPad} y={teamY}
          fontFamily={teamFont.family} fontSize={teamPx} fontWeight={teamWeight}
          fill="#E8E4DE" fillOpacity={0.55} letterSpacing={Math.round(1.5 * scaleW)}
        >{team}</text>
      )}

      {/* Tagline */}
      {tagline && (
        <text x={leftPad} y={taglineY}
          fontFamily={taglineFont.family} fontSize={taglinePx} fontWeight={taglineWeight}
          fill="#E8E4DE" fillOpacity={0.35} letterSpacing={Math.round(scaleW)}
        >{tagline}</text>
      )}

      {/* Skills row */}
      {displayedSkills.length > 0 && (
        <g>
          <text
            x={leftPad} y={skillRowY - Math.round(16 * scaleH)}
            fontFamily="'IBM Plex Mono', monospace"
            fontSize={Math.round(7 * scaleH)}
            fill={accent} letterSpacing={3} opacity={0.55}
          >SKILLS</text>

          {displayedSkills.map((skill, i) => {
            const sx = leftPad + i * (skillIconSz + skillGap)
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
          rightEdge={rightEdge}
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
        rightEdge={rightEdge}
        bottomY={pastBottomY}
        accent={accent}
        scaleH={scaleH} scaleW={scaleW}
      />

      {/* Git platform badge — top-left */}
      {showGitBadge && gitUsername && (
        <GitBadge
          username={gitUsername}
          platform={gitPlatform}
          topY={currentTopY}
          leftPad={leftPad}
          scaleH={scaleH}
          scaleW={scaleW}
          accent={accent}
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
    </svg>
  )
}
