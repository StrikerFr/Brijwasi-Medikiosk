# MediKiosk

> **Voice-First, Multilingual Clinical Intake & Medication Safety Suite**  
> Built for high-volume outpatient clinics, hospitals, and community healthcare centers in India.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-cyan.svg)](https://react.dev/)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-1.168-orange.svg)](https://tanstack.com/start)
[![Google Gemini](https://img.shields.io/badge/Clinical%20AI-Gemini%202.5%20Flash-4285F4.svg)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/Voice%20STT-Groq%20Whisper-F55036.svg)](https://groq.com/)
[![ElevenLabs](https://img.shields.io/badge/Voice%20TTS-ElevenLabs-black.svg)](https://elevenlabs.io/)
[![Turso](https://img.shields.io/badge/Database-Turso%20libSQL-00C988.svg)](https://turso.tech/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF.svg)](https://clerk.com/)
[![Tests](https://img.shields.io/badge/Tests-36%20Passing-success.svg)](https://vitest.dev/)

---

## 📖 Table of Contents

- [Overview & The Problem](#-overview--the-problem)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Live Evaluation for Judges](#-live-evaluation-for-judges)
- [Verified Provider Integrations](#-verified-provider-integrations)
- [Quick Start](#-quick-start)
- [Deploying to Vercel](#-deploying-to-vercel)
- [Environment Variables](#-environment-variables)
- [Quality Assurance & Commands](#-quality-assurance--commands)
- [Responsible AI & Clinical Governance](#-responsible-ai--clinical-governance)
- [Documentation Directory](#-documentation-directory)

---

## 🩺 Overview & The Problem

In Indian Outpatient Departments (OPDs), doctors frequently consult 60 to 100+ patients in a single morning session, providing as little as 2 to 3 minutes per consultation. Patients face high literacy and language hurdles with conventional paperwork, while polypharmacy—taking uncoordinated prescriptions from multiple practitioners—leads to severe medical complications (e.g., compounding paracetamol dosages from different brand names like _Dolo 650_ and _Crocin Advance_).

**MediKiosk** transforms this experience through two complementary workflows:

1. **Patient Check-In Kiosk**: A walk-up, bilingual (Hindi & English) touch-and-voice interface that captures symptoms, vitals, and old medical documents without requiring patients to type.
2. **Medication Safety Reconciler**: A deterministic clinical engine that parses prescriptions across different doctors, maps Indian brand names to verified active pharmaceutical ingredients, and highlights timeline overlaps and dosage risks for professional sign-off.

---

## 🏗️ System Architecture

```
                                  [ Patient / Visitor ]
                                            │
                             ┌──────────────┴──────────────┐
                             │    Walk-up Kiosk Screen     │
                             │  (Hindi / English Voice UI) │
                             └──────────────┬──────────────┘
                                            │
                                  [ TanStack Start SSR ]
                                  [ Nitro Vercel Host  ]
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│     Voice Intake      │       │      Clinical AI      │       │  Medication Safety    │
│ ───────────────────── │       │ ───────────────────── │       │ ───────────────────── │
│ • Groq Whisper (STT)  │       │ • Google Gemini 2.5   │       │ • OCR.space Document  │
│ • ElevenLabs (TTS)    │       │ • Chief Concern Extr. │       │ • Indian Brand Map    │
│ • Real-time Waveform  │       │ • Vitals Structuring  │       │ • Overlap Detection   │
└───────────┬───────────┘       └───────────┬───────────┘       └───────────┬───────────┘
            │                               │                               │
            └───────────────────────────────┼───────────────────────────────┘
                                            ▼
                               ┌─────────────────────────┐
                               │   Serverless Turso DB   │
                               │  (libSQL Cloud SQLite)  │
                               │  • Cases & Vitals       │
                               │  • Document Metadata    │
                               │  • Audit Trail Logs     │
                               └────────────┬────────────┘
                                            │
                        ┌───────────────────┴───────────────────┐
                        ▼                                       ▼
             ┌─────────────────────┐                 ┌─────────────────────┐
             │ Clinician Worklist  │                 │ Patient Health Home │
             │ • Prioritized Queue │                 │ • Visit History     │
             │ • Prepared Case     │                 │ • Diagnostic Vault  │
             │ • Professional Sign │                 │ • Groq Chat Helper  │
             └─────────────────────┘                 └─────────────────────┘
```

---

## ✨ Key Features

- **Voice-First Case Taking**: Natural conversational speech intake in Hindi and English. Audio is transcribed via Groq Whisper and read back using ElevenLabs spoken prompts.
- **Instant Clinical Structuring**: Clinical reasoning by Google Gemini 2.5 Flash extracts duration, symptom trajectory, triggers, and denied symptoms into standardized structured formats.
- **Document & Lab OCR**: Patients show diagnostic lab reports or prescriptions to the camera. Document types (e.g., CBC, Renal Function) are recognized and abnormal ranges are extracted automatically.
- **Indian Pharmaceutical Reconciler**: Handles complex Indian brand aliases and identifies duplicate molecules across prescriptions from different providers.
- **Care Team Handoff**: Triage priority is assigned automatically based on vitals, chief complaints, and urgent flags, reducing doctor preparation time from minutes to seconds.
- **Universal Accessibility**: High-contrast modes, large typography, bilingual audio guidance, and WCAG-compliant design tokens.

---

## 🏆 Live Evaluation for Judges

A complete Judge & Evaluator Guide is available in [docs/JUDGES.md](docs/JUDGES.md).

| Surface                   | Path                                       | Description                                                                                       |
| :------------------------ | :----------------------------------------- | :------------------------------------------------------------------------------------------------ |
| **Interactive Demo**      | [`/demo`](/demo)                           | 15-step animated product showcase walking through every feature with sample data.                 |
| **Patient Kiosk**         | [`/patient-kiosk`](/patient-kiosk)         | Real voice check-in, language toggle, and token generation.                                       |
| **Clinician Workspace**   | [`/clinician`](/clinician)                 | Doctor's worklist, prioritized queue, and structured patient case view.                           |
| **Medication Safety**     | [`/medication-safety`](/medication-safety) | Multi-prescription upload, OCR extraction, active ingredient matching, and PDF report generation. |
| **Assisted Intake**       | [`/assisted-kiosk`](/assisted-kiosk)       | Receptionist interface for helping walk-in patients.                                              |
| **Patient Health Portal** | [`/patient`](/patient)                     | Patient longitudinal timeline and intelligent health records assistant.                           |
| **Platform Telemetry**    | [`/operations`](/operations)               | System operations, dead-letter queue, and OCR/AI latency tracking.                                |
| **Administration**        | [`/admin`](/admin)                         | Facility administration, user management, and audit logs.                                         |

---

## ⚡ Verified Provider Integrations

All external providers are connected and verified via our automated connectivity test suite (`npm run check:apis`):

| Provider           | Service               | Target / Model     | Status                                         |
| :----------------- | :-------------------- | :----------------- | :--------------------------------------------- |
| **Turso (libSQL)** | Distributed Database  | Cloud Edge Cluster | **CONNECTED** (Health query verified)          |
| **Google Gemini**  | Clinical Intelligence | `gemini-2.5-flash` | **CONNECTED** (Strict JSON reasoning verified) |
| **Groq**           | Voice Engine          | Whisper & LLM API  | **CONNECTED** (HTTP 200 verified)              |
| **ElevenLabs**     | Spoken Kiosk Audio    | `medikiosk` voice  | **CONNECTED** (Voice details verified)         |
| **Clerk**          | Authentication        | Backend Admin API  | **CONNECTED** (Secret key verified)            |
| **OCR.space**      | Document OCR          | Engine API         | **CONNECTED** (Engine verified)                |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: `22.x`
- **npm**: `10+`

### Setup

```bash
# 1. Install dependencies
npm ci

# 2. Configure environment
cp .env.example .env
# Populate API keys in .env

# 3. Validate configuration
npm run check:env

# 4. Run live API connectivity test
npm run check:apis

# 5. Start development server
npm run dev
```

---

## ☁️ Deploying to Vercel

This repository is optimized for deployment using Nitro's Vercel Build Output API:

1. Import this repository in the [Vercel Dashboard](https://vercel.com/new).
2. Set **Framework Preset**: `Other`.
3. Set **Build Command**: `npm run build`.
4. Set **Install Command**: `npm ci`.
5. **Output Directory**: Leave empty (Nitro outputs directly to `.vercel/output`).
6. Configure the [Environment Variables](#-environment-variables) for **Production** and **Preview**.
7. Click **Deploy**.

For detailed deployment instructions and quota management, see [docs/VERCEL.md](docs/VERCEL.md).

---

## 🔐 Environment Variables

| Variable                                  | Description                                                   | Exposure            |
| :---------------------------------------- | :------------------------------------------------------------ | :------------------ |
| `VITE_CLERK_PUBLISHABLE_KEY`              | Clerk public key for client-side authentication               | Public (Build-time) |
| `CLERK_SECRET_KEY`                        | Clerk server-side secret key                                  | Server Only         |
| `TURSO_DATABASE_URL`                      | Turso libSQL connection URL                                   | Server Only         |
| `TURSO_AUTH_TOKEN`                        | Turso authorization token                                     | Server Only         |
| `GEMINI_API_KEY`                          | Google Gemini API key                                         | Server Only         |
| `GEMINI_MODEL`                            | Explicit model selection (recommended: `gemini-2.5-flash`)    | Server Only         |
| `GROQ_API_KEY`                            | Groq API key for Whisper STT and web search                   | Server Only         |
| `ELEVENLABS_API_KEY`                      | ElevenLabs API key for spoken prompts                         | Server Only         |
| `ELEVENLABS_VOICE_ID`                     | Voice profile ID for kiosk accessibility                      | Server Only         |
| `OCR_SPACE_API_KEY`                       | OCR.space API key for prescription & document reading         | Server Only         |
| `MEDICATION_EXTERNAL_PROCESSING_APPROVED` | Operator privacy approval flag (`true`/`false`)               | Server Only         |
| `MEDICATION_PROFESSIONAL_ROLES`           | JSON mapping of Clerk user IDs/emails to clinician/pharmacist | Server Only         |

---

## 🛡️ Responsible AI & Clinical Governance

- **Deterministic Pharmacological Matching**: Indian brand matching relies on explicit pharmacopoeial active ingredient mapping, not generative guesswork.
- **Human-in-the-Loop Verification**: Low-confidence brand matches are queued for pharmacist review. "Not found" never implies counterfeit.
- **Privacy & Consent Boundary**: External AI analysis requires recorded patient consent and operator privacy approval. Raw images and corrections maintain separate audit trails.
- **Zero Client Token Exposure**: All AI keys and database secrets are resolved server-side.

---

## 🧪 Quality Assurance & Commands

| Command                | Action                                                                    |
| :--------------------- | :------------------------------------------------------------------------ |
| `npm run check:apis`   | Test live connectivity to Gemini, Groq, Turso, Clerk, ElevenLabs, and OCR |
| `npx vitest run`       | Execute the full test suite (36 tests)                                    |
| `npm run typecheck`    | Strict TypeScript compiler validation (`tsc --noEmit`)                    |
| `npm run format:check` | Verify formatting consistency with Prettier                               |
| `npm run build`        | Compile the full production serverless bundle                             |

---

## 📚 Documentation Directory

- [Judge & Evaluator Guide](docs/JUDGES.md)
- [Architecture & Module Boundaries](docs/ARCHITECTURE.md)
- [Vercel Deployment Guide](docs/VERCEL.md)
- [Medication Safety Engine Documentation](docs/MEDICATION_SAFETY.md)
- [Route Conventions](src/routes/README.md)
