import type { BannerTemplate, CanvasFormat, FontOption, PatternId } from '@data/templates'
import type { Skill } from '@data/skills'

export type LogoEntry = {
  id: string
  name: string        // company name shown as text below logo
  logoUrl: string     // CDN / uploaded URL
  searchQuery: string // what the user typed to resolve this
  isPast: boolean     // renders with Ex- prefix
  showAsText: boolean // skip image, render name as text only
}

/** ViewBox coordinate override for drag-and-drop */
export type ElementPosition = {
  x: number
  y: number
  /** Optional size override (used by skills row for icon size, logos for logo size) */
  size?: number
}

/** Optional size override for resize */
export type ElementSize = {
  width?: number
  height?: number
}

export type BannerConfig = {
  // Canvas
  format: CanvasFormat
  // Theme
  template: BannerTemplate
  pattern: PatternId    // overrides template.pattern
  accentColor: string   // overrides template.accentColor
  // Identity
  name: string
  role: string
  team: string
  tagline: string
  // Typography — per text element: font family, weight, size
  nameFont: FontOption
  roleFont: FontOption
  teamFont: FontOption
  taglineFont: FontOption
  nameWeight: number
  roleWeight: number
  teamWeight: number
  taglineWeight: number
  nameSize: number
  roleSize: number
  teamSize: number
  taglineSize: number
  // Skills
  skills: Skill[]
  maxSkills: number
  showSkillLabels: boolean
  // Logos (up to 4: 1 current + 3 past)
  logos: LogoEntry[]
  logoSize: number
  // Git platform badge
  gitUsername: string
  gitPlatform: 'github' | 'gitlab' | 'gitbucket'
  showGitBadge: boolean
  // Layout
  showLinkedInZone: boolean
  patternOpacity: number
  // ─── Drag-and-drop position overrides ───
  // When set, these override the computed default position/size in the SVG viewBox.
  // When null/undefined, the element uses its computed default.
  namePos?:    ElementPosition
  rolePos?:    ElementPosition
  teamPos?:    ElementPosition
  taglinePos?: ElementPosition
  skillsPos?:  ElementPosition
  currentLogoPos?: ElementPosition & { size?: number }
  pastLogosPos?:   ElementPosition & { size?: number }
  gitBadgePos?: ElementPosition
  /** Override for git badge icon size (default: 18 * scaleH) */
  gitBadgeSize?: number
}
