# OnlyNerds Banner Studio

A free, open-source professional banner maker for LinkedIn, GitHub profiles, Twitter/X headers, business cards, and more. Built with Astro, React, and Tailwind. Deployable to Cloudflare Pages in one click.

**Live:** [banner.onlynerds.win](https://banner.onlynerds.win) &nbsp;·&nbsp; **By:** [OnlyNerds](https://onlynerds.win) &nbsp;·&nbsp; **Built in association with:** [Alphonso AI](https://alphonso.app)

---

## Features

- **16 themes** — from deep space to warm amber to neon cyberpunk
- **9 background patterns** — grid, dots, diagonal, hexagons, circuit, waves, crosses, zigzag
- **6 canvas formats** — LinkedIn Banner, Business Card, Twitter/X, GitHub Profile, YouTube Art, Instagram Post
- **Per-field typography** — independent font family, weight, and size for Name / Role / Team / Tagline
- **120+ skills** — predefined icons (Python, TypeScript, AWS, Azure, Cursor, Ollama, Anthropic, etc.) sourced from Simple Icons, gilbarbara/logos, and Devicon; all rendered white-on-dark automatically
- **Custom skill search** — searches Simple Icons, Brand Logos, Devicon, VectorLogo, and Brandfetch in parallel; shows all results so you pick the best-looking one
- **Company logos** — current company pinned top-right, past/Ex- companies pinned bottom-right as a row; upload PNG/SVG or paste a URL
- **PNG export** — 2× retina via canvas pipeline (all images inlined — no CORS issues, fully self-contained)
- **SVG export** — standalone file with all images embedded as data URLs
- **LinkedIn safe-zone overlay** — toggle to see exactly where your profile photo covers the banner

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Astro 4](https://astro.build) (static output) |
| UI | [React 18](https://react.dev) islands (`client:load`) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) + CSS custom properties |
| Canvas | SVG (crisp at any resolution) |
| Export | Native Canvas API (no external dependencies for PNG) |
| Icons | [Simple Icons CDN](https://simpleicons.org), [gilbarbara/logos](https://github.com/gilbarbara/logos), [Devicon](https://devicon.dev) |
| Logo search | [Brandfetch API](https://brandfetch.com), Simple Icons, VectorLogoZone |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com) |

---

## Getting Started

```bash
# Clone
git clone https://github.com/yellatp/onlynerds-banner.git
cd onlynerds-banner

# Install
npm install

# Dev server — opens at http://localhost:4321
npm run dev

# Production build
npm run build
```

**Node 18+** required.

---

## Deploying to Cloudflare Pages

1. Fork this repo
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → Create a project → Connect to Git
3. Select your fork
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Deploy

No environment variables required for basic use. If you want Brandfetch logo resolution, add:

```
BRANDFETCH_KEY=your_key_here
```

---

## Project Structure

```
src/
  components/
    Studio.tsx          # Main interactive editor (React island)
    BannerCanvas.tsx    # SVG canvas renderer
    ExportPanel.tsx     # PNG / SVG / data-URL export
    SkillPicker.tsx     # Predefined + custom skill selector
    LogoSearchPicker.tsx# Multi-source logo search results picker
    types.ts            # BannerConfig type
  data/
    skills.ts           # 120+ predefined skills with CDN icon URLs
    templates.ts        # 16 themes, 6 formats, 9 patterns, accent presets
  layouts/
    Base.astro          # HTML shell, fonts, global CSS
  lib/
    logoResolver.ts     # Brandfetch + CDN fallback chain, whiteIcon helper
  pages/
    index.astro         # Page shell with header, hero, studio, contribute, footer
  styles/
    global.css          # CSS custom properties + base resets
public/
  OnlyNerds.svg         # Favicon (SVG)
  OnlyNerds_Nav.svg     # Footer logo
  AlphonsoAI_logo.svg   # Alphonso AI logo
  Alphonso_logo.png     # Alphonso AI logo (PNG)
```

---

## Contributing

OnlyNerds is built on shared growth. Contributions are credited — if you add a skill, template, or resource, it goes up with your name on it.

```bash
# Fork and clone your fork
git clone https://github.com/YOUR_USERNAME/onlynerds-banner.git

# Create a feature branch
git checkout -b feat/add-kotlin-skill

# Make your changes, then
git commit -m "feat: add Kotlin to skills list"
git push origin feat/add-kotlin-skill

# Open a Pull Request on GitHub
```

### What to contribute

- **New skills** — add to `src/data/skills.ts` with correct CDN slug and brand color
- **New templates** — add to `src/data/templates.ts` with a background color/gradient and accent color
- **New patterns** — add to the `makePattern()` switch in `BannerCanvas.tsx`
- **Bug fixes** — especially around export, icon resolution, or layout on different canvas formats
- **Translations / i18n** — UI text lives in the component files

### Ways to share

- [Fork on GitHub](https://github.com/yellatp/onlynerds-banner)
- [Share a resource or idea](https://onlynerds.win/contact/)

---

## Links

| | |
|---|---|
| OnlyNerds | [onlynerds.win](https://onlynerds.win) |
| Alphonso AI | [alphonso.app](https://alphonso.app) |
| Creator | [Pavan Yellathakota](https://pye.pages.dev) |
| Contact | [onlynerds.win/contact](https://onlynerds.win/contact/) |
| Privacy Policy | [onlynerds.win/privacy-policy](https://onlynerds.win/privacy-policy/) |
| Brand Assets | [onlynerds.win/brand](https://onlynerds.win/brand/) |

---

## License

Apache 2.0 — free to use, modify, and deploy. See [LICENSE](./LICENSE) for details.

> A product of [OnlyNerds](https://onlynerds.win) · Built in association with [Alphonso AI](https://alphonso.app)
