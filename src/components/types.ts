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
}
