export type Skill = {
  id: string
  label: string
  category: SkillCategory
  iconUrl: string
  color?: string
}

export type SkillCategory =
  | 'language'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'cloud'
  | 'ai-ml'
  | 'mobile'
  | 'tool'
  | 'design'

// Simple Icons CDN — white variant for dark backgrounds
const SI = (slug: string) => `https://cdn.simpleicons.org/${slug}/ffffff`

// gilbarbara/logos — brand-colored SVGs (visible on dark bg)
const GB = (slug: string) =>
  `https://cdn.jsdelivr.net/gh/gilbarbara/logos@master/logos/${slug}.svg`

// Devicon
const DV = (slug: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`

export const SKILLS: Skill[] = [
  // ── Languages ───────────────────────────────────────────────────────────────
  { id: 'python',     label: 'Python',       category: 'language', iconUrl: SI('python'),       color: '#3776AB' },
  { id: 'typescript', label: 'TypeScript',   category: 'language', iconUrl: SI('typescript'),   color: '#3178C6' },
  { id: 'javascript', label: 'JavaScript',   category: 'language', iconUrl: SI('javascript'),   color: '#F7DF1E' },
  { id: 'rust',       label: 'Rust',         category: 'language', iconUrl: SI('rust'),         color: '#CE422B' },
  { id: 'go',         label: 'Go',           category: 'language', iconUrl: GB('go'),           color: '#00ADD8' },
  { id: 'java',       label: 'Java',         category: 'language', iconUrl: SI('openjdk'),      color: '#ED8B00' },
  { id: 'csharp',     label: 'C#',           category: 'language', iconUrl: SI('dotnet'),       color: '#512BD4' },
  { id: 'cpp',        label: 'C++',          category: 'language', iconUrl: SI('cplusplus'),    color: '#00599C' },
  { id: 'c',          label: 'C',            category: 'language', iconUrl: DV('c'),            color: '#A8B9CC' },
  { id: 'ruby',       label: 'Ruby',         category: 'language', iconUrl: SI('ruby'),         color: '#CC342D' },
  { id: 'php',        label: 'PHP',          category: 'language', iconUrl: SI('php'),          color: '#777BB4' },
  { id: 'swift',      label: 'Swift',        category: 'language', iconUrl: SI('swift'),        color: '#FA7343' },
  { id: 'kotlin',     label: 'Kotlin',       category: 'language', iconUrl: SI('kotlin'),       color: '#7F52FF' },
  { id: 'scala',      label: 'Scala',        category: 'language', iconUrl: SI('scala'),        color: '#DC322F' },
  { id: 'r',          label: 'R',            category: 'language', iconUrl: GB('r-lang'),       color: '#276DC3' },
  { id: 'elixir',     label: 'Elixir',       category: 'language', iconUrl: SI('elixir'),       color: '#4B275F' },
  { id: 'haskell',    label: 'Haskell',      category: 'language', iconUrl: SI('haskell'),      color: '#5D4F85' },
  { id: 'lua',        label: 'Lua',          category: 'language', iconUrl: SI('lua'),          color: '#2C2D72' },
  { id: 'dart',       label: 'Dart',         category: 'language', iconUrl: SI('dart'),         color: '#0175C2' },

  // ── Frontend ─────────────────────────────────────────────────────────────────
  { id: 'react',      label: 'React',        category: 'frontend', iconUrl: SI('react'),        color: '#61DAFB' },
  { id: 'nextjs',     label: 'Next.js',      category: 'frontend', iconUrl: SI('nextdotjs'),    color: '#FFFFFF' },
  { id: 'vue',        label: 'Vue',          category: 'frontend', iconUrl: SI('vuedotjs'),     color: '#4FC08D' },
  { id: 'nuxt',       label: 'Nuxt',         category: 'frontend', iconUrl: SI('nuxtdotjs'),    color: '#00DC82' },
  { id: 'angular',    label: 'Angular',      category: 'frontend', iconUrl: SI('angular'),      color: '#DD0031' },
  { id: 'svelte',     label: 'Svelte',       category: 'frontend', iconUrl: SI('svelte'),       color: '#FF3E00' },
  { id: 'astro',      label: 'Astro',        category: 'frontend', iconUrl: SI('astro'),        color: '#FF5D01' },
  { id: 'remix',      label: 'Remix',        category: 'frontend', iconUrl: SI('remix'),        color: '#FFFFFF' },
  { id: 'tailwind',   label: 'Tailwind',     category: 'frontend', iconUrl: SI('tailwindcss'),  color: '#06B6D4' },
  { id: 'sass',       label: 'Sass',         category: 'frontend', iconUrl: SI('sass'),         color: '#CC6699' },
  { id: 'vite',       label: 'Vite',         category: 'frontend', iconUrl: SI('vite'),         color: '#646CFF' },
  { id: 'webpack',    label: 'Webpack',      category: 'frontend', iconUrl: SI('webpack'),      color: '#8DD6F9' },
  { id: 'three',      label: 'Three.js',     category: 'frontend', iconUrl: SI('threedotjs'),   color: '#FFFFFF' },
  { id: 'gsap',       label: 'GSAP',         category: 'frontend', iconUrl: SI('greensock'),    color: '#88CE02' },

  // ── Backend ──────────────────────────────────────────────────────────────────
  { id: 'nodejs',     label: 'Node.js',      category: 'backend',  iconUrl: SI('nodedotjs'),    color: '#339933' },
  { id: 'deno',       label: 'Deno',         category: 'backend',  iconUrl: SI('deno'),         color: '#FFFFFF' },
  { id: 'bun',        label: 'Bun',          category: 'backend',  iconUrl: SI('bun'),          color: '#FBF0DF' },
  { id: 'hono',       label: 'Hono',         category: 'backend',  iconUrl: SI('hono'),         color: '#E36002' },
  { id: 'django',     label: 'Django',       category: 'backend',  iconUrl: SI('django'),       color: '#092E20' },
  { id: 'fastapi',    label: 'FastAPI',      category: 'backend',  iconUrl: SI('fastapi'),      color: '#009688' },
  { id: 'flask',      label: 'Flask',        category: 'backend',  iconUrl: SI('flask'),        color: '#FFFFFF' },
  { id: 'express',    label: 'Express',      category: 'backend',  iconUrl: SI('express'),      color: '#FFFFFF' },
  { id: 'nestjs',     label: 'NestJS',       category: 'backend',  iconUrl: SI('nestjs'),       color: '#E0234E' },
  { id: 'spring',     label: 'Spring',       category: 'backend',  iconUrl: SI('spring'),       color: '#6DB33F' },
  { id: 'rails',      label: 'Rails',        category: 'backend',  iconUrl: SI('rubyonrails'),  color: '#CC0000' },
  { id: 'laravel',    label: 'Laravel',      category: 'backend',  iconUrl: SI('laravel'),      color: '#FF2D20' },
  { id: 'graphql',    label: 'GraphQL',      category: 'backend',  iconUrl: SI('graphql'),      color: '#E10098' },
  { id: 'trpc',       label: 'tRPC',         category: 'backend',  iconUrl: SI('trpc'),         color: '#2596BE' },

  // ── Database ─────────────────────────────────────────────────────────────────
  { id: 'postgresql', label: 'PostgreSQL',   category: 'database', iconUrl: SI('postgresql'),   color: '#4169E1' },
  { id: 'mysql',      label: 'MySQL',        category: 'database', iconUrl: SI('mysql'),        color: '#4479A1' },
  { id: 'mongodb',    label: 'MongoDB',      category: 'database', iconUrl: SI('mongodb'),      color: '#47A248' },
  { id: 'redis',      label: 'Redis',        category: 'database', iconUrl: SI('redis'),        color: '#DC382D' },
  { id: 'sqlite',     label: 'SQLite',       category: 'database', iconUrl: SI('sqlite'),       color: '#003B57' },
  { id: 'supabase',   label: 'Supabase',     category: 'database', iconUrl: SI('supabase'),     color: '#3ECF8E' },
  { id: 'planetscale',label: 'PlanetScale',  category: 'database', iconUrl: SI('planetscale'),  color: '#FFFFFF' },
  { id: 'prisma',     label: 'Prisma',       category: 'database', iconUrl: SI('prisma'),       color: '#2D3748' },
  { id: 'drizzle',    label: 'Drizzle',      category: 'database', iconUrl: SI('drizzle'),      color: '#C5F74F' },
  { id: 'neo4j',      label: 'Neo4j',        category: 'database', iconUrl: SI('neo4j'),        color: '#008CC1' },
  { id: 'elastic',    label: 'Elasticsearch',category: 'database', iconUrl: SI('elasticsearch'),color: '#FEC514' },

  // ── DevOps ───────────────────────────────────────────────────────────────────
  { id: 'docker',     label: 'Docker',       category: 'devops',   iconUrl: SI('docker'),       color: '#2496ED' },
  { id: 'kubernetes', label: 'Kubernetes',   category: 'devops',   iconUrl: SI('kubernetes'),   color: '#326CE5' },
  { id: 'terraform',  label: 'Terraform',    category: 'devops',   iconUrl: SI('terraform'),    color: '#7B42BC' },
  { id: 'ansible',    label: 'Ansible',      category: 'devops',   iconUrl: SI('ansible'),      color: '#EE0000' },
  { id: 'githubactions',label:'GH Actions',  category: 'devops',   iconUrl: SI('githubactions'),color: '#2088FF' },
  { id: 'jenkins',    label: 'Jenkins',      category: 'devops',   iconUrl: SI('jenkins'),      color: '#D24939' },
  { id: 'nginx',      label: 'NGINX',        category: 'devops',   iconUrl: SI('nginx'),        color: '#009639' },
  { id: 'linux',      label: 'Linux',        category: 'devops',   iconUrl: SI('linux'),        color: '#FCC624' },
  { id: 'prometheus', label: 'Prometheus',   category: 'devops',   iconUrl: SI('prometheus'),   color: '#E6522C' },
  { id: 'grafana',    label: 'Grafana',      category: 'devops',   iconUrl: SI('grafana'),      color: '#F46800' },

  // ── Cloud ────────────────────────────────────────────────────────────────────
  { id: 'aws',        label: 'AWS',          category: 'cloud',    iconUrl: GB('amazon-web-services'), color: '#FF9900' },
  { id: 'gcp',        label: 'GCP',          category: 'cloud',    iconUrl: GB('google-cloud'),        color: '#4285F4' },
  { id: 'azure',      label: 'Azure',        category: 'cloud',    iconUrl: GB('microsoft-azure'),     color: '#0078D4' },
  { id: 'cloudflare', label: 'Cloudflare',   category: 'cloud',    iconUrl: GB('cloudflare'),          color: '#F48120' },
  { id: 'vercel',     label: 'Vercel',       category: 'cloud',    iconUrl: SI('vercel'),              color: '#FFFFFF' },
  { id: 'netlify',    label: 'Netlify',      category: 'cloud',    iconUrl: SI('netlify'),             color: '#00C7B7' },
  { id: 'railway',    label: 'Railway',      category: 'cloud',    iconUrl: SI('railway'),             color: '#FFFFFF' },
  { id: 'fly',        label: 'Fly.io',       category: 'cloud',    iconUrl: SI('flydotio'),            color: '#7B3BE2' },
  { id: 'supabase-cloud',label:'Supabase Edge',category:'cloud',   iconUrl: SI('supabase'),            color: '#3ECF8E' },

  // ── AI / ML ──────────────────────────────────────────────────────────────────
  { id: 'pytorch',    label: 'PyTorch',      category: 'ai-ml',    iconUrl: SI('pytorch'),      color: '#EE4C2C' },
  { id: 'tensorflow', label: 'TensorFlow',   category: 'ai-ml',    iconUrl: SI('tensorflow'),   color: '#FF6F00' },
  { id: 'huggingface',label: 'Hugging Face', category: 'ai-ml',    iconUrl: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg', color: '#FFD21E' },
  { id: 'openai',     label: 'OpenAI',       category: 'ai-ml',    iconUrl: SI('openai'),       color: '#FFFFFF' },
  { id: 'anthropic',  label: 'Anthropic',    category: 'ai-ml',    iconUrl: SI('anthropic'),    color: '#D97757' },
  { id: 'gemini',     label: 'Gemini',       category: 'ai-ml',    iconUrl: SI('googlegemini'), color: '#8E75B2' },
  { id: 'ollama',     label: 'Ollama',       category: 'ai-ml',    iconUrl: SI('ollama'),       color: '#FFFFFF' },
  { id: 'mistral',    label: 'Mistral AI',   category: 'ai-ml',    iconUrl: SI('mistral'),      color: '#FF7000' },
  { id: 'langchain',  label: 'LangChain',    category: 'ai-ml',    iconUrl: SI('langchain'),    color: '#1C3C3C' },
  { id: 'scikitlearn',label: 'Scikit-learn', category: 'ai-ml',    iconUrl: SI('scikitlearn'),  color: '#F7931E' },
  { id: 'pandas',     label: 'Pandas',       category: 'ai-ml',    iconUrl: SI('pandas'),       color: '#150458' },
  { id: 'numpy',      label: 'NumPy',        category: 'ai-ml',    iconUrl: SI('numpy'),        color: '#013243' },
  { id: 'opencv',     label: 'OpenCV',       category: 'ai-ml',    iconUrl: SI('opencv'),       color: '#5C3EE8' },

  // ── Mobile ───────────────────────────────────────────────────────────────────
  { id: 'flutter',    label: 'Flutter',      category: 'mobile',   iconUrl: SI('flutter'),      color: '#02569B' },
  { id: 'reactnative',label: 'React Native', category: 'mobile',   iconUrl: SI('react'),        color: '#61DAFB' },
  { id: 'ios',        label: 'iOS / Swift',  category: 'mobile',   iconUrl: SI('apple'),        color: '#FFFFFF' },
  { id: 'android',    label: 'Android',      category: 'mobile',   iconUrl: SI('android'),      color: '#3DDC84' },
  { id: 'expo',       label: 'Expo',         category: 'mobile',   iconUrl: SI('expo'),         color: '#FFFFFF' },

  // ── Tools ────────────────────────────────────────────────────────────────────
  { id: 'git',        label: 'Git',          category: 'tool',     iconUrl: SI('git'),          color: '#F05032' },
  { id: 'github',     label: 'GitHub',       category: 'tool',     iconUrl: SI('github'),       color: '#FFFFFF' },
  { id: 'gitlab',     label: 'GitLab',       category: 'tool',     iconUrl: SI('gitlab'),       color: '#FC6D26' },
  { id: 'vscode',     label: 'VS Code',      category: 'tool',     iconUrl: GB('visual-studio-code'), color: '#007ACC' },
  { id: 'cursor',     label: 'Cursor',       category: 'tool',     iconUrl: SI('cursor'),       color: '#FFFFFF' },
  { id: 'copilot',    label: 'Copilot',      category: 'tool',     iconUrl: SI('githubcopilot'),color: '#8957E5' },
  { id: 'jira',       label: 'Jira',         category: 'tool',     iconUrl: SI('jira'),         color: '#0052CC' },
  { id: 'linear',     label: 'Linear',       category: 'tool',     iconUrl: SI('linear'),       color: '#5E6AD2' },
  { id: 'notion',     label: 'Notion',       category: 'tool',     iconUrl: SI('notion'),       color: '#FFFFFF' },
  { id: 'slack',      label: 'Slack',        category: 'tool',     iconUrl: SI('slack'),        color: '#4A154B' },
  { id: 'discord',    label: 'Discord',      category: 'tool',     iconUrl: SI('discord'),      color: '#5865F2' },
  { id: 'postman',    label: 'Postman',      category: 'tool',     iconUrl: SI('postman'),      color: '#FF6C37' },
  { id: 'figma',      label: 'Figma',        category: 'tool',     iconUrl: SI('figma'),        color: '#F24E1E' },
  { id: 'vim',        label: 'Vim',          category: 'tool',     iconUrl: SI('vim'),          color: '#019733' },
  { id: 'neovim',     label: 'Neovim',       category: 'tool',     iconUrl: SI('neovim'),       color: '#57A143' },
  { id: 'sentry',     label: 'Sentry',       category: 'tool',     iconUrl: SI('sentry'),       color: '#362D59' },
  { id: 'stripe',     label: 'Stripe',       category: 'tool',     iconUrl: SI('stripe'),       color: '#635BFF' },
  { id: 'zapier',     label: 'Zapier',       category: 'tool',     iconUrl: SI('zapier'),       color: '#FF4A00' },
  { id: 'n8n',        label: 'n8n',          category: 'tool',     iconUrl: SI('n8n'),          color: '#EA4B71' },

  // ── Design ───────────────────────────────────────────────────────────────────
  { id: 'adobexd',    label: 'Adobe XD',     category: 'design',   iconUrl: SI('adobexd'),      color: '#FF61F6' },
  { id: 'photoshop',  label: 'Photoshop',    category: 'design',   iconUrl: SI('adobephotoshop'),color:'#31A8FF' },
  { id: 'illustrator',label: 'Illustrator',  category: 'design',   iconUrl: SI('adobeillustrator'),color:'#FF9A00'},
  { id: 'sketch',     label: 'Sketch',       category: 'design',   iconUrl: SI('sketch'),       color: '#F7B500' },
  { id: 'blender',    label: 'Blender',      category: 'design',   iconUrl: SI('blender'),      color: '#E87D0D' },
  { id: 'framer',     label: 'Framer',       category: 'design',   iconUrl: SI('framer'),       color: '#FFFFFF' },
  { id: 'canva',      label: 'Canva',        category: 'design',   iconUrl: SI('canva'),        color: '#00C4CC' },
]

export const SKILL_CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: 'language', label: 'Languages' },
  { id: 'frontend', label: 'Frontend'  },
  { id: 'backend',  label: 'Backend'   },
  { id: 'database', label: 'Database'  },
  { id: 'devops',   label: 'DevOps'    },
  { id: 'cloud',    label: 'Cloud'     },
  { id: 'ai-ml',    label: 'AI / ML'   },
  { id: 'mobile',   label: 'Mobile'    },
  { id: 'tool',     label: 'Tools'     },
  { id: 'design',   label: 'Design'    },
]
