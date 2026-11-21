# Threat Model: ai-support-agent

> **Run:** `2026-11-14_ai-support-agent_full`  
> **Date:** 2026-11-14  
> **Methodology:** STRIDE analysis across trust boundaries, critical flows, and abuse cases.

---

## 1. Assets

1. **Platform Secrets & Encryption Key**:
   - `PLATFORM_ENCRYPTION_KEY` (AES-256-GCM master key used to encrypt all tenant secrets).
   - Decrypted tenant secrets: OpenAI API keys, ElevenLabs keys, customer MongoDB connection strings (`database_url`), SMTP passwords.
2. **Customer Lead & Conversation Data**:
   - Transcripts of user voice and text support conversations.
   - Captured personally identifiable information (PII): names, phone numbers, emails, company names, country, project purposes.
3. **Tenant Database & Storage Assets**:
   - Dedicated customer MongoDB Atlas clusters routed via dynamic connection strings.
4. **Administrative Access & Session Tokens**:
   - Platform admin credentials (`users` collection with `scrypt` password hashes) and signed session cookies (`__va_session`).
5. **AI Compute Quota & Third-Party Spend**:
   - OpenAI account balance, ElevenLabs credits, and SMTP outbound email delivery capacity.

---

## 2. Actors & Trust Levels

| Actor | Trust Level | Malicious Objective |
|---|---|---|
| **Anonymous Internet Visitor** | None | Exfiltrate conversation records, burn OpenAI/TTS credits via unauthenticated API abuse, conduct prompt injection, or trigger DoS. |
| **Host Website Owner (Tenant)** | Low to Medium | Access other tenants' data or conversations, exceed provisioned tier quotas. |
| **Tenant / Platform Administrator** | High | Misconfigure tenant secrets, elevate privileges, or access unencrypted database payloads. |
| **External AI & Cloud Providers** | External / Third-party | OpenAI, ElevenLabs, MongoDB Atlas, SMTP servers. |

---

## 3. Trust Boundaries

- **Boundary 1: Internet Client ↔ Next.js Public Endpoints**:
  Untrusted browser audio and JSON payloads enter via `/voice`, `/api/chat`, `/api/transcribe`, `/api/speak`, `/api/config`.
- **Boundary 2: Application ↔ OpenAI / External LLM APIs**:
  Conversational prompts and audio sent outbound; LLM tokens streamed inbound. Prompt injection and token extraction risks.
- **Boundary 3: Application ↔ Platform MongoDB**:
  Credentials, tenant configs, and encrypted secrets queried and updated via official MongoDB Node.js driver.
- **Boundary 4: Application ↔ Dynamic Tenant MongoDB**:
  Tenant-provided database connection string parsed and connected dynamically at runtime.
- **Boundary 5: Next.js Client ↔ Next.js Admin API**:
  Browser admin requests guarded by cookie authentication and role verification.

---

## 4. STRIDE Matrix by Boundary & Flow

| Threat Category | Boundary / Flow | Concern / Scenario | Risk | Status |
|---|---|---|---|---|
| **Spoofing** | Boundary 1 (Embed API) | If `EMBED_AUTH_ENABLED` is `false` (default), an attacker can supply `?tenant=<tenant_id>` to impersonate a tenant and trigger LLM completions on that tenant's quota. | High | **Confirmed** (`env.ts:22`, `embed-auth.ts:60`) |
| **Tampering** | Boundary 2 (Chat Protocol) | Client submits synthetic `messages` with forged assistant or system roles to influence lead capture or prompt behavior. | Medium | **Confirmed** (Unbounded array input in `chat/route.ts:45`) |
| **Repudiation** | Boundary 3 & 4 (Database) | Audit logs record events, but tenant fallback database writes log warnings without durable alerting to admin. | Low | **Likely** (`conversation-store.ts:80`) |
| **Information Disclosure** | Boundary 1 (Client APIs) | API errors in production routes could surface stack traces or connection errors. | Medium | **Mitigated in most routes, verified** |
| **Denial of Service** | Boundary 1 (Audio & LLM APIs) | `TENANT_RATE_LIMIT_ENABLED` is `false` by default; unauthenticated loops to `/api/transcribe` and `/api/speak` can exhaust server compute and third-party API spend. | High | **Confirmed** (`env.ts:41`, `runtime-access.ts:31`) |
| **Elevation of Privilege** | Boundary 5 (Admin Login) | Lack of brute-force rate limiting on `/api/admin/auth/login` allows automated dictionary attacks against administrator accounts. | High | **Confirmed** (`login/route.ts:35`) |

---

## 5. Abuse Cases & Verification Status

1. **AC-1: Brute-Force Password Guessing on Admin Login**  
   *Story*: An automated bot repeatedly submits password guesses to `/api/admin/auth/login`.  
   *Result*: **Confirmed Vulnerable**. No IP or account-level rate limiter exists on `/api/admin/auth/login`.

2. **AC-2: Unauthenticated TTS/Transcription Flooding (Denial of Wallet)**  
   *Story*: An attacker repeatedly calls `POST /api/speak` with 5,000-character strings or `POST /api/transcribe` with audio blobs to exhaust OpenAI credits.  
   *Result*: **Confirmed Vulnerable**. `TENANT_RATE_LIMIT_ENABLED` defaults to `false`. When disabled, requests pass directly to OpenAI.

3. **AC-3: Incomplete Middleware Session Check**  
   *Story*: An attacker sends a request with `Cookie: __va_session=invalid` to `/admin/tenants`.  
   *Result*: **Confirmed Design Weakness**. `src/middleware.ts` only checks `Boolean(cookie.value)` instead of verifying the HMAC signature, delegating all security enforcement to server components.

4. **AC-4: Repeated Index Creation Overhead on Auth Lookups**  
   *Story*: Normal logins invoke `getAuthDb()`, which executes 5 `createIndex` operations against MongoDB on every single request.  
   *Result*: **Confirmed Performance/Reliability Issue**. `src/lib/auth/users.ts:37` calls `ensureAuthUserIndexes(db)` inside `getAuthDb()`.

5. **AC-5: Prompt Injection into Lead Protocol**  
   *Story*: Attacker types `[END_CALL]` to force a call to end prematurely.  
   *Result*: **Mitigated**. `src/app/api/chat/route.ts:124` requires `hasRequiredLead(mergedLead)` before inferred end-call triggers, and extracts tokens only from assistant completions.

---

## 6. Candidate Attack Chains

- **Chain 1 (Credential Guessing → Platform Takeover)**:  
  Missing rate limit on `/api/admin/auth/login` + `scrypt` password endpoint → automated dictionary attack yields platform admin credentials → access to `/admin/tenants` → exfiltration or modification of tenant secrets and configurations.
- **Chain 2 (Unauthenticated Embed → Spend Depletion)**:  
  Default `EMBED_AUTH_ENABLED=false` + default `TENANT_RATE_LIMIT_ENABLED=false` → anonymous attacker floods `/api/chat` and `/api/speak` → tenant OpenAI API balance exhausted → outage of customer-facing voice agent.

