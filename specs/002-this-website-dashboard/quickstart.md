## Quickstart — Website Dashboard (UI/UX Enhanced)

### 1) Install deps and run
```bash
cd /Users/william.jiang/my-experiments/website-dashboard/frontend
npm install
npm run dev
```

### 2) Add shadcn/ui
```bash
npx shadcn@latest init
npx shadcn@latest add button card input badge avatar dialog tabs
```

### 3) Generate/refresh assets (optional)
```bash
npm run generate-assets
```

### 4) Screenshot a site via Playwright MCP (optional)
- Use Playwright MCP to open target URL and capture screenshot when missing.

### 5) UX patterns
- Grid list with cards (logo, title, URL, description, screenshot thumbnail)
- Detail page: hero with large screenshot, actions, and metadata
- Search across name/description; placeholders for missing assets


