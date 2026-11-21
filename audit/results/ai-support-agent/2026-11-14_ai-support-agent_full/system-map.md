# System Map: ai-support-agent

> **Audit Run:** `2026-11-14_ai-support-agent_full`  
> **Kit Version:** 0.2.0  
> **Target App:** `ai-support-agent` (Package name: `voiceagent@2.0.0`)  
> **Working Directory:** `/Users/tk-lpt-1088/development/node/VoiceAgent`

---

## 1. Repositories and Commits

| Parameter | Value |
|---|---|
| Repository Path | `/Users/tk-lpt-1088/development/node/VoiceAgent` |
| Active Branch | `master` |
| Commit Hash | `a7eaae6` |
| Remotes | `origin` (`https://github.com/aiscripto/ai-support-agent`), `fork` (`git@github.com:tariqsulehri/ai-support-agent.git`) |
| Working Tree | 4 tracked files with trailing-newline edits (`.impeccable/live/config.json`, `DESIGN.md`, `PRODUCT.md`, `src/lib/utils/audio-unlock.ts`) |
| Codebase Scale | 112 source files in `src/` (86 TS, 23 TSX, 1 JS, 1 JSON, 1 CSS), ~19,525 lines of code |

---

## 2. Stack and Component Versions

- **Framework**: Next.js 15.5.27 (App Router, Standalone output)
- **UI & Runtime**: React 19.0.0, TypeScript 5.7.3, Tailwind CSS 3.4.17
- **Database**: Official MongoDB Node.js Driver v7.2.0 (Native driver; legacy `src/generated/prisma` is dead code)
- **AI & Speech**:
  - OpenAI SDK v4.86.1 (`whisper-1` for STT, `gpt-4o-mini` for chat completions, `tts-1` / `nova` for speech)
  - ElevenLabs API (alternative TTS provider)
  - `franc` v6.2.0 (language detection with fallback)
- **Security & Crypto**: Node.js `crypto` (`aes-256-gcm` for tenant secrets, `scrypt` for admin passwords), HTTP-only cookies
- **Email & Notifications**: Nodemailer v6.10.0 (SMTP)
- **Validation**: Zod v3.24.2

---

## 3. Project Classification & Scope

- **Classification**: `web-app` · `ai-agent` · `api-service` · `cli-tool`
- **Dimensions in Scope**: All 16 dimensions:
  `security`, `ai-llm`, `architecture`, `data`, `performance`, `reliability`, `observability`, `testing`, `cicd-supply-chain`, `dependencies`, `accessibility`, `ux-design`, `cost`, `compliance`, `code-health`, `documentation`.
- **Dimensions Skipped**: None.
- **Matched Stack Modules**:
  1. `nextjs` (`audit/kit/stacks/nextjs.md`)
  2. `react` (`audit/kit/stacks/react.md`)
  3. `mongodb-native` (`audit/kit/stacks/mongodb-native.md`)
  4. `llm-voice-providers` (`audit/kit/stacks/llm-voice-providers.md`)
  5. `docker-cicd` (`audit/kit/stacks/docker-cicd.md`)
- **Project Specific Module**:
  - `audit/project-standards.md` (8 technical pillars of `ai-support-agent`)

---

## 4. Architecture Overview

```
[Host Website]
   │
   ▼ <script src="/agent.js"> / <iframe>
[Client: /voice (React 19)]
   │ 
   ├── 🎙️ MediaRecorder (WebM) ──────► /api/transcribe (Whisper STT)
   ├── 💬 SSE Chat Stream ────────────► /api/chat (GPT-4o-mini)
   ├── 🔊 Sentence Audio Queue ──────► /api/speak (TTS Nova / ElevenLabs)
   └── 🛑 End-Call Handshake ────────► /api/summarize (LLM Lead Extractor)
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
             [Nodemailer / SMTP]                       [Tenant / Platform MongoDB]
             (Email Alert to Tenant)                   (Conversations & Leads)
```

- **Entry Points**:
  - Web UI: `/voice` (Embeddable voice & text widget)
  - Admin UI: `/admin/login`, `/admin/tenants`, `/admin/tenants/[tenantId]`, `/admin/dashboard`, `/`
  - Embed Scripts: `/src/app/agent.js`, `/public/embed.js`
  - API Routes: `/api/config`, `/api/chat`, `/api/transcribe`, `/api/speak`, `/api/summarize`, `/api/conversation`, `/api/embed/session`, `/api/admin/auth/login`, `/api/admin/auth/logout`
  - CLI: `src/cli/voice.ts`, `src/cli/text.ts`
  - Maintenance: `src/scripts/*` (tenants, secrets, conversation migration)
- **Data Stores**:
  - **Platform MongoDB**: `tenants`, `tenant_agent_settings`, `tenant_secrets`, `users`, internal `conversations`.
  - **Tenant-Dedicated MongoDB**: Dynamic routing via tenant's decrypted `database_url` secret, with automatic fallback to platform DB on connection failure.
- **Deployment**:
  - Vercel Serverless (`vercel.json`)
  - Docker Standalone container (`node:22-slim`, `deployment/Dockerfile`, `docker-compose.yml`)

---

## 5. Critical Flows & Trust Boundaries

1. **Embed Configuration & Secret Resolution**: Resolving tenant parameters, loading decrypted runtime keys into memory without exposing them to client.
2. **Audio Streaming Pipeline**: Whisper transcription (`/api/transcribe`) -> LLM response stream (`/api/chat`) -> TTS synthesis (`/api/speak`) -> browser audio playback with autoplay unlock.
3. **Lead Extraction & Summarization**: Prompt injection boundary on incoming transcript -> structured extraction (`[LEAD:{...}]`) -> email dispatch -> database persistence.
4. **Admin Authentication & RBAC**: Scrypt password verification -> signed HTTP-only session cookie -> route guards across `/admin/*`.
5. **Tenant Isolation & Database Partitioning**: Decryption of tenant connection strings -> isolated database client caching -> fallback handling.

**Trust Boundaries**:
- Untrusted inputs: User audio streams, chat text messages, URL query parameters (`tenant`, `token`, `session`), HTTP referer headers.
- Protected outputs: Encrypted secrets in MongoDB, masked API keys in logs, lead records sent via SMTP.

---

## 6. Project Commands & Planned Tool Scans

| Purpose | Command |
|---|---|
| Typecheck | `npx tsc --noEmit` |
| Linting | `npm run lint` |
| Build Check | `npm run build` |
| Security Audit | `npm audit --json` |
| Design Compliance | `npm run impeccable -- doctor` |

---

## 7. Open Questions / Items for Checkpoint A Confirmation

1. Confirm that all **16 dimensions** should be audited in this run.
2. Confirm the 5 matched stack modules: `nextjs`, `react`, `mongodb-native`, `llm-voice-providers`, `docker-cicd`.
3. Approve execution of the planned tool scans: `npx tsc --noEmit`, `npm run lint`, `npm audit --json`, and `impeccable doctor`.

