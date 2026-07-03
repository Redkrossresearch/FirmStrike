# FirmStrike (Viv Scanner)

A full-stack cybersecurity firmware analysis platform. Upload embedded/IoT firmware images, run automated security scans, detect CVEs and malware, spot hardcoded secrets, and emulate firmware behavior — all from a dashboard.

---

## ✨ What it does

Security analysts upload a firmware image and get:

- 📊 **Dashboard** — live threat metrics, vulnerability trends, risk distribution
- 🔍 **Scan telemetry** — file extraction, vulnerability counts, progress tracking
- 🛡️ **Security analysis** — hardcoded secrets, dangerous functions, severity scoring
- 🧬 **CVE intelligence** — CVSS score breakdown, NVD links, matched advisories
- 🦠 **Malware detection** — VirusTotal-style hash matching, threat score meters
- 🖥️ **QEMU emulation** — boot firmware in an ARM emulator, discover open ports and running services
- 📄 **Reports & AI** — risk summaries, exploit probability, downloadable PDF reports

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces, Node.js 24, TypeScript 5.9 |
| Frontend | React + Vite + Wouter + Tailwind CSS v4 + Recharts + Framer Motion |
| UI Components | shadcn/ui |
| API Server | Express 5 |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod (`zod/v4`), `drizzle-zod` |
| API Codegen | Orval (generates React Query hooks + Zod schemas from the OpenAPI spec) |
| Build | esbuild (CJS bundle) |
| Auth | Session-based (`express-session`) |

**Design:** dark cyberpunk theme — electric teal (`#00e5cc`) on near-black (`#0a0f14`).

---

## 📁 Project Structure

```
FirmStrike/
├── artifacts/
│   ├── viv-scanner/         # React frontend (cyberpunk dark theme)
│   │   └── src/
│   │       ├── pages/       # Dashboard, FirmwareLibrary, ScanDetails,
│   │       │                # SecurityAnalysis, CveIntelligence,
│   │       │                # MalwareDetection, QemuEmulation,
│   │       │                # ReportsAi, Login, Register
│   │       └── components/  # Layout.tsx, theme-provider.tsx, shadcn/ui
│   └── api-server/
│       └── src/routes/      # auth, firmware, scanner, security,
│                             # cve, malware, qemu, reports, dashboard
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml     # OpenAPI contract — source of truth for all endpoints
│   ├── api-client-react/    # Generated React Query hooks + Zod schemas
│   └── db/
│       └── src/schema/      # Drizzle ORM schema (users, firmware, scans, security, index)
├── scripts/
├── attached_assets/
└── pnpm-workspace.yaml
```

---

## 🏗️ Architecture

- **Contract-first API** — the OpenAPI spec (`lib/api-spec/openapi.yaml`) drives all generated client hooks and server validation schemas.
- **All API routes** live under `/api/`, served by the API server artifact; the frontend is served at `/`.
- **Scan simulation** — the backend currently simulates real scan progression with timed updates (mock data), ahead of full binary-analysis engine integration.
- **Session-based auth** via `express-session`, wired and ready for a full login flow.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 24+
- pnpm
- PostgreSQL database

### Setup

```bash
# Clone the repo
git clone https://github.com/Redkrossresearch/FirmStrike.git
cd FirmStrike

# Install dependencies
pnpm install
```

### Environment variables

```env
DATABASE_URL=your_postgres_connection_string
SESSION_SECRET=your_session_signing_key
```

### Run in development

```bash
# API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Frontend (port 25439)
pnpm --filter @workspace/viv-scanner run dev
```

### Other useful commands

```bash
# Full typecheck across all packages
pnpm run typecheck

# Typecheck + build all packages
pnpm run build

# Regenerate API hooks and Zod schemas from the OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes (dev only)
pnpm --filter @workspace/db run push
```

> ⚠️ Do not run `pnpm add --no-frozen-lockfile` in this workspace.

---

## 🌱 Seed Data

The dev database ships with sample data to explore the dashboard immediately:

- 4 firmware records (D-Link – critical, TP-Link – high, Netgear – scanning, Asus – pending)
- 12 vulnerabilities
- 6 CVEs
- 7 malware hashes
- 6 activity events

---

## 🗺️ Roadmap / Vision

FirmStrike's long-term roadmap extends the current dashboard into a full binary-analysis pipeline:

- [ ] Real firmware extraction with Binwalk (replacing scan simulation)
- [ ] Static analysis via Ghidra + strings tooling for secrets/dangerous calls
- [ ] Live NVD API integration for CVE matching
- [ ] Real QEMU-based emulation with captured open ports/services
- [ ] AI-generated (Claude/OpenAI) risk explanations per finding
- [ ] VirusTotal API integration for malware/hash checks
- [ ] PDF report generation (ReportLab/WeasyPrint)
- [ ] Optional: on-chain SHA256 firmware hash proof (Sepolia testnet, web3.py)

---

## 🤝 Contributing

Issues and pull requests are welcome. Please open an issue first to discuss significant changes.

## 📄 License

Add your license of choice here (MIT recommended for open-source security tooling).
