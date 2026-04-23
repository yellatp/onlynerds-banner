export type CanvasFormat = {
  id: string
  label: string
  width: number
  height: number
}

export const FORMATS: CanvasFormat[] = [
  { id: 'linkedin',      label: 'LinkedIn Banner',  width: 1584, height: 396  },
  { id: 'business-card', label: 'Business Card',    width: 1050, height: 600  },
  { id: 'twitter',       label: 'Twitter / X',      width: 1500, height: 500  },
  { id: 'github',        label: 'GitHub Profile',   width: 1280, height: 640  },
  { id: 'youtube',       label: 'YouTube Art',      width: 2560, height: 1440 },
  { id: 'instagram',     label: 'Instagram Post',   width: 1080, height: 1080 },
]

export type PatternId =
  | 'none'
  | 'grid'
  | 'dots'
  | 'diagonal'
  | 'hexagons'
  | 'circuit'
  | 'waves'
  | 'crosses'
  | 'zigzag'

export const PATTERNS_LIST: { id: PatternId; label: string }[] = [
  { id: 'none',     label: 'None'     },
  { id: 'grid',     label: 'Grid'     },
  { id: 'dots',     label: 'Dots'     },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'hexagons', label: 'Hexagons' },
  { id: 'circuit',  label: 'Circuit'  },
  { id: 'waves',    label: 'Waves'    },
  { id: 'crosses',  label: 'Crosses'  },
  { id: 'zigzag',   label: 'Zigzag'   },
]

export type BannerTemplate = {
  id: string
  label: string
  description: string
  pattern: PatternId
  accentColor: string
  bgColor: string
  bgGradient?: string
}

export const TEMPLATES: BannerTemplate[] = [
  {
    id: 'midnight',
    label: 'Midnight',
    description: 'Dark minimal with warm gold accent',
    pattern: 'grid',
    accentColor: '#C79A6F',
    bgColor: '#07090C',
    bgGradient: 'linear-gradient(135deg, #07090C 0%, #0D1117 100%)',
  },
  {
    id: 'blueprint',
    label: 'Blueprint',
    description: 'Engineering blue on deep navy',
    pattern: 'grid',
    accentColor: '#4A9EFF',
    bgColor: '#060C18',
    bgGradient: 'linear-gradient(135deg, #060C18 0%, #0A1628 100%)',
  },
  {
    id: 'forest',
    label: 'Forest',
    description: 'Deep green, calm and professional',
    pattern: 'dots',
    accentColor: '#4CAF7D',
    bgColor: '#060E0A',
    bgGradient: 'linear-gradient(135deg, #060E0A 0%, #0A1810 100%)',
  },
  {
    id: 'rose',
    label: 'Rose',
    description: 'Warm magenta, bold and creative',
    pattern: 'diagonal',
    accentColor: '#E05C8A',
    bgColor: '#0F060A',
    bgGradient: 'linear-gradient(135deg, #0F060A 0%, #1A0B12 100%)',
  },
  {
    id: 'arctic',
    label: 'Arctic',
    description: 'Ice blue gradient, clean and modern',
    pattern: 'dots',
    accentColor: '#7EB8D4',
    bgColor: '#07090F',
    bgGradient: 'linear-gradient(135deg, #07090F 0%, #0D1420 100%)',
  },
  {
    id: 'ember',
    label: 'Ember',
    description: 'Deep orange, warm and energetic',
    pattern: 'diagonal',
    accentColor: '#FF7043',
    bgColor: '#0F0800',
    bgGradient: 'linear-gradient(135deg, #0F0800 0%, #1A1000 100%)',
  },
  {
    id: 'violet',
    label: 'Violet',
    description: 'Deep purple, creative and bold',
    pattern: 'hexagons',
    accentColor: '#9B59B6',
    bgColor: '#0A0610',
    bgGradient: 'linear-gradient(135deg, #0A0610 0%, #130A1E 100%)',
  },
  {
    id: 'mono',
    label: 'Mono',
    description: 'Pure black and white, timeless',
    pattern: 'grid',
    accentColor: '#FFFFFF',
    bgColor: '#000000',
    bgGradient: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    description: 'Neon green on near-black, high contrast',
    pattern: 'circuit',
    accentColor: '#39FF14',
    bgColor: '#030605',
    bgGradient: 'linear-gradient(135deg, #030605 0%, #071008 100%)',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    description: 'Deep teal, calm and authoritative',
    pattern: 'waves',
    accentColor: '#14B8A6',
    bgColor: '#040D0D',
    bgGradient: 'linear-gradient(135deg, #040D0D 0%, #081818 100%)',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    description: 'Warm amber on dark brown',
    pattern: 'diagonal',
    accentColor: '#F59E0B',
    bgColor: '#0F0800',
    bgGradient: 'linear-gradient(135deg, #0F0800 0%, #1C1200 100%)',
  },
  {
    id: 'slate',
    label: 'Slate',
    description: 'Cool gray, understated authority',
    pattern: 'grid',
    accentColor: '#94A3B8',
    bgColor: '#06080A',
    bgGradient: 'linear-gradient(135deg, #06080A 0%, #0E1318 100%)',
  },
  {
    id: 'crimson',
    label: 'Crimson',
    description: 'Bold red on deep black',
    pattern: 'diagonal',
    accentColor: '#DC2626',
    bgColor: '#0A0202',
    bgGradient: 'linear-gradient(135deg, #0A0202 0%, #160404 100%)',
  },
  {
    id: 'neon',
    label: 'Neon',
    description: 'Hot pink, electric and vivid',
    pattern: 'zigzag',
    accentColor: '#FF1493',
    bgColor: '#080006',
    bgGradient: 'linear-gradient(135deg, #080006 0%, #10000C 100%)',
  },
  {
    id: 'gold',
    label: 'Gold',
    description: 'Rich warm gold on deep charcoal',
    pattern: 'hexagons',
    accentColor: '#D4AF37',
    bgColor: '#0A0800',
    bgGradient: 'linear-gradient(135deg, #0A0800 0%, #181200 100%)',
  },
  {
    id: 'sage',
    label: 'Sage',
    description: 'Muted sage green, soft and natural',
    pattern: 'dots',
    accentColor: '#84CC16',
    bgColor: '#060A04',
    bgGradient: 'linear-gradient(135deg, #060A04 0%, #0C1408 100%)',
  },
]

export const ACCENT_PRESETS: { id: string; label: string; color: string }[] = [
  { id: 'gold',      label: 'Gold',       color: '#C79A6F' },
  { id: 'blue',      label: 'Blue',       color: '#4A9EFF' },
  { id: 'emerald',   label: 'Emerald',    color: '#4CAF7D' },
  { id: 'rose',      label: 'Rose',       color: '#E05C8A' },
  { id: 'ember',     label: 'Ember',      color: '#FF7043' },
  { id: 'violet',    label: 'Violet',     color: '#9B59B6' },
  { id: 'white',     label: 'White',      color: '#FFFFFF' },
  { id: 'cyan',      label: 'Cyan',       color: '#06B6D4' },
  { id: 'lime',      label: 'Lime',       color: '#84CC16' },
  { id: 'crimson',   label: 'Crimson',    color: '#DC2626' },
  { id: 'amber',     label: 'Amber',      color: '#F59E0B' },
  { id: 'sky',       label: 'Sky',        color: '#7EB8D4' },
  { id: 'neongreen', label: 'Neon Green', color: '#39FF14' },
  { id: 'hotpink',   label: 'Hot Pink',   color: '#FF1493' },
  { id: 'teal',      label: 'Teal',       color: '#14B8A6' },
  { id: 'richgold',  label: 'Rich Gold',  color: '#D4AF37' },
]

export type FontOption = {
  id: string
  label: string
  family: string
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'ibm-mono', label: 'IBM Plex Mono', family: "'IBM Plex Mono', monospace" },
  { id: 'ibm-sans', label: 'IBM Plex Sans', family: "'IBM Plex Sans', sans-serif" },
  { id: 'inter',    label: 'Inter',         family: "'Inter', sans-serif"         },
  { id: 'grotesk',  label: 'Space Grotesk', family: "'Space Grotesk', sans-serif" },
]

export const FONT_WEIGHTS: { value: number; label: string }[] = [
  { value: 300, label: 'Light'    },
  { value: 400, label: 'Regular'  },
  { value: 500, label: 'Medium'   },
  { value: 600, label: 'SemiBold' },
  { value: 700, label: 'Bold'     },
]
