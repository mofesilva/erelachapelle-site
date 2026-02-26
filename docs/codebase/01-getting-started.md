# 01 — Getting Started

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| Node.js | 20+ | LTS recommended |
| npm | 10+ | Ships with Node 20 |
| Git | 2.x | — |

## Installation

```bash
git clone <repo-url> erelachapelle-site
cd erelachapelle-site
npm install
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```dotenv
# Cappuccino Cloud (future API integration)
NEXT_PUBLIC_CAPPUCCINO_API_URL=https://api.cappuccino.app
NEXT_PUBLIC_CAPPUCCINO_API_KEY=your-tenant-api-key

# Google Maps embed
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CAPPUCCINO_API_URL` | Phase 2 | Base URL for the Cappuccino Cloud REST API |
| `NEXT_PUBLIC_CAPPUCCINO_API_KEY` | Phase 2 | Tenant-scoped API key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps JavaScript API key for embed iframes |

> **Note:** In Phase 1 (current), the app uses static in-memory data and does not call the Cappuccino API. The SDK dependency (`@cappuccino/web-sdk`) is installed but not yet wired into the data layer.

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start Next.js dev server with hot reload (default port 3000) |
| Production build | `npm run build` | Create optimized production build in `.next/` |
| Start prod | `npm run start` | Serve the production build |
| Lint | `npm run lint` | Run ESLint across the project |

## Project Structure at a Glance

```
erelachapelle-site/
├── public/             # Static assets (logos)
├── src/
│   ├── app/            # Next.js App Router pages & layouts
│   ├── _components/    # Shared reusable components
│   ├── i18n/           # Internationalization config
│   ├── lib/            # Utilities, data, integrations, validations
│   ├── messages/       # Translation JSON files (fr, pt, en)
│   └── types/          # TypeScript type definitions
├── docs/               # Documentation & design references
├── specs/              # Feature specifications
├── .env.example        # Environment variable template
├── next.config.ts      # Next.js configuration
├── tailwind v4         # Configured in globals.css (no tailwind.config.ts)
└── tsconfig.json       # TypeScript configuration
```

## IDE Setup

The project includes `.vscode/settings.json` for VS Code. The recommended extensions are:

- **ESLint** — linting
- **Tailwind CSS IntelliSense** — class autocomplete
- **Pretty TypeScript Errors** — better error messages

The `tsconfig.json` defines a path alias `@/*` → `./src/*` used throughout the codebase.
