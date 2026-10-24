# MediKiosk - Judge & Evaluator Guide

Welcome, judges! This guide provides a rapid, high-impact walkthrough of **MediKiosk**, including system architecture, clinical safeguards, live demo routes, and verification commands.

---

## 🎯 30-Second Summary

In high-volume Indian hospital OPDs, doctors see 60–100+ patients in a 4-hour morning session—leaving less than 3 minutes per consultation. Patients struggle with paper forms due to language and literacy barriers, while prescription fragmentation across multiple doctors leads to frequent, dangerous medication duplications.

**MediKiosk** solves this end-to-end:

1. **Voice-First Patient Intake**: Patients speak naturally in Hindi or English at the kiosk. Voice is transcribed (Groq Whisper) and spoken prompts guide them (ElevenLabs).
2. **Clinical Reasoning with Gemini**: Google Gemini 2.5 Flash structures conversational Hindi/English narratives into physician-ready clinical summaries, extracting timeline, chief concerns, vitals, and lab values.
3. **Medication Safety Reconciler**: Multi-doctor prescription OCR (OCR.space) extracts handwritten medicines, matches Indian brand names to active ingredients (e.g., _Dolo 650_ and _Crocin Advance_ both contain _Paracetamol_), flags dangerous cumulative dosages, and produces an auditable clinical report.
4. **Care Team Portals**: Doctors, nurses, and pharmacists receive prioritized worklists, reducing triage time from 15 minutes to under 60 seconds.

---

## 🚀 Live Evaluation Routes

You can explore every persona and workflow directly:

| Persona / Feature               | Path                                                                   | What to Evaluate                                                                                                                 |
| :------------------------------ | :--------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Guided Interactive Showcase** | [`/demo`](https://medikiosk.vercel.app/demo)                           | 15-step animated product tour with sample clinical cases, audio waveforms, OCR scans, and timeline overlap visualizations.       |
| **Patient Kiosk (Walk-Up)**     | [`/patient-kiosk`](https://medikiosk.vercel.app/patient-kiosk)         | Multilingual touch & voice check-in, language toggle (Hindi/English), microphone input, vitals capture, and token generation.    |
| **Clinician Worklist**          | [`/clinician`](https://medikiosk.vercel.app/clinician)                 | Doctor's prioritized queue, AI-extracted case summaries, lab trend flags, and encounter sign-off.                                |
| **Medication Safety Engine**    | [`/medication-safety`](https://medikiosk.vercel.app/medication-safety) | Multi-prescription upload, OCR extraction, active ingredient matching, timeline overlap detection, and pharmacist review report. |
| **Assisted Intake (Reception)** | [`/assisted-kiosk`](https://medikiosk.vercel.app/assisted-kiosk)       | Queue management and assisted intake for elderly or low-literacy patients.                                                       |
| **Patient Health Portal**       | [`/patient`](https://medikiosk.vercel.app/patient)                     | Patient timeline, diagnostic document vault, and Groq-powered health records assistant.                                          |
| **Operations Telemetry**        | [`/operations`](https://medikiosk.vercel.app/operations)               | System health, DLQ (Dead Letter Queue), OCR/Gemini latency monitoring, and audit replay.                                         |
| **Admin Console**               | [`/admin`](https://medikiosk.vercel.app/admin)                         | Facility configuration, role provisioning, and audit logs.                                                                       |

---

## 🏗️ Architecture & Technology Stack

```
                     ┌──────────────────────────────────────────────┐
                     │            Client Touchpoints                │
                     │  Patient Kiosk | Clinician | Admin | Portal  │
                     └──────────────────────┬───────────────────────┘
                                            │
                                  TanStack Start (SSR)
                                  Nitro Vercel Engine
                                            │
                     ┌──────────────────────┴───────────────────────┐
                     │          Server & Clinical Middleware        │
                     │  - Clerk Auth (Role & Session Validation)    │
                     │  - Patient Privacy & Consent Enforcement    │
                     └──────────────┬───────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐          ┌───────────────────┐        ┌───────────────────┐
│ Voice & OCR  │          │    Clinical AI    │        │ Serverless Store  │
│ ──────────── │          │ ───────────────── │        │ ───────────────── │
│ Groq Whisper │          │ Google Gemini 2.5 │        │ Turso (libSQL)    │
│ ElevenLabs   │          │ Clinical Reasoning│        │ Distributed Cloud │
│ OCR.space    │          │ JSON Verification │        │ Persistent Store  │
└──────────────┘          └───────────────────┘        └───────────────────┘
```

- **Frontend & Fullstack Framework**: [TanStack Start](https://tanstack.com/start) with React 19, TypeScript, and Vite.
- **Serverless Runtime**: [Nitro](https://nitro.unjs.io/) generating Vercel Build Output API with 120s extended function execution for heavy document processing.
- **Clinical AI Engine**: [Google Gemini 2.5 Flash](https://ai.google.dev/) with strict JSON schemas for medical entity extraction.
- **Voice Intelligence**: [Groq](https://groq.com/) for ultra-low latency Whisper speech-to-text; [ElevenLabs](https://elevenlabs.io/) for natural bilingual spoken voice prompts.
- **Authentication**: [Clerk](https://clerk.com/) with server-side role resolution and legacy-compatible credential fallbacks.
- **Database & Persistence**: [Turso](https://turso.tech/) (libSQL cloud SQLite) with connection pooling and serverless schema migrations.

---

## 🛡️ Responsible Clinical AI & Ethical Safeguards

Unlike generic AI wrappers, MediKiosk was architected around patient safety principles:

1. **No AI Hallucinations in Prescriptions**: The engine uses a deterministic matching algorithm (`verification.ts`) against known Indian Pharmacopoeia aliases. Low-confidence matches are explicitly flagged for human pharmacist review.
2. **"Not Found" ≠ Counterfeit**: If a brand name is unrecognized or handwriting is illegible, MediKiosk marks it as _Unverified / Needs Review_ rather than declaring it fake.
3. **Auditable Chain of Custody**: Original handwriting text, OCR transcripts, clinician corrections, and final sign-offs maintain separate immutable version records in Turso.
4. **Operator Privacy Gate**: External AI processing (`MEDICATION_EXTERNAL_PROCESSING_APPROVED`) requires recorded operator consent before patient images leave the server boundary.
5. **Zero Client Secret Exposure**: All AI tokens, database credentials, and Clerk secrets are strictly server-side.

---

## 🧪 Verification & Audit Commands

Every subsystem can be audited locally or via CI:

```bash
# 1. Run live external provider connectivity check (Gemini, Groq, Turso, Clerk, ElevenLabs, OCR)
npm run check:apis

# 2. Run the complete automated test suite (Unit & Clinical Provider tests)
npx vitest run

# 3. Check strict TypeScript type safety
npm run typecheck

# 4. Check Prettier code formatting
npm run format:check

# 5. Build production serverless bundle for Vercel
npm run build
```

---

## 👥 Evaluator Test Credentials

- **Admin Account**: `itzboistrikerbolte1@gmail.com`
- **Assigned Roles**: `Administrator`, `Clinician`, `Pharmacist`
- **Instant Invitation URL**: [Click to access admin testing session](https://amusing-cow-4672.clerk.accounts.dev/v1/tickets/accept?ticket=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlaXMiOjI1OTIwMDAsImV4cCI6MTc5NTQ2NzIyMSwiaWlkIjoiaW5zXzNKQkRWWGYyOE5aYXdRTGhDaWRTcDNycEZKMyIsInNpZCI6Imludl8zTDluYktiZ01tWnJSUDk1cndFTnJFNUNUNnoiLCJzdCI6Imludml0YXRpb24ifQ.C6AQRUdHdGbQ0188gpYXaXwbb688TAJIGZ9uNGAhPy0zfRs_xbh1qju_AvWfszMTd-mmrarAWsvoyTWxX81yZ8fVZ4y0NPMN6l8aV5sIktXtePlYPXqD3GEywhxfcCAXWQhZV91Cm_cf7o0jafYH7xWghS5mrwwq5GLzS7T4NKgutZF2iAwL2LxVXBw0H4RPF1ks8nO7w2frS7pC_gzrepuK9Ohp6xVK7_1itp4jp3aoSkoNVgRmeDElq9pjrTcTiKg-rcEw3b-Mzo5lL2dDJpDJC0-B5YSi-uoOiQfETvDnOs2XUoN62I5qtRuT7F1w6vKg-Ae_55ujPzFV4Ku9Gw)
