# Finance Buddy — Insight Lab

**Yconic Intercollegiate AI Hackathon · March 28-29, 2026 · Team: Insight Lab**

An AI-powered personal finance companion for young adults. Built with React 18, React Native/Expo, Node.js/Express 5, and the Anthropic Claude API.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Model](#data-model)
- [Design Decisions](#design-decisions)
- [What Is Simulated](#what-is-simulated)
- [Team](#team)

---

## Features

### Web App (React 18 + TypeScript + Vite)
| Feature | Status |
|---|---|
| JWT authentication (signup / login / logout) | ✅ |
| 7-question onboarding quiz → AI profile summary | ✅ |
| Budget tracker — income/expense CRUD, monthly summaries | ✅ |
| Savings goals with ETA projections | ✅ |
| Paper trading portfolio — buy/sell, sector analytics, diversification score | ✅ |
| SSE streaming AI chat with user-context injection | ✅ |
| AI insight cards (BUDGET / PORTFOLIO / MARKET) | ✅ |
| Live market ticker (20+ tickers, 2-second Brownian-motion updates) | ✅ |
| Banking hub, credit cards, loans (avalanche/snowball), Roth IRA / 401K | ✅ |
| Financial education hub — 20+ courses, XP gamification | ✅ |

### Mobile App (React Native + Expo)
| Feature | Status |
|---|---|
| JWT auth with SecureStore token storage | ✅ |
| Dashboard — live API data (budget summary, savings ring, AI insight) | ✅ |
| Budget screen — real expense/income from API + add-expense modal | ✅ |
| Portfolio screen — live holdings + watchlist from API | ✅ |
| SSE streaming AI chat | ✅ |
| 15+ navigable screens | ✅ |

### Backend (Node.js 20 + Express 5)
| Feature | Status |
|---|---|
| 7 REST route groups (auth, onboarding, budget, portfolio, chat, market, insights) | ✅ |
| JWT middleware on all authenticated routes | ✅ |
| SSE streaming endpoint (`POST /api/v1/chat/message`) | ✅ |
| Rate limiting: 200 req/15min global, 20 req/15min auth | ✅ |
| Shared input validation utilities (DRY across all routes) | ✅ |
| Timing-attack-safe login (constant-time bcrypt) | ✅ |
| In-memory Map store with O(1) per-user secondary indexes | ✅ |
| Claude API with graceful mock fallback | ✅ |
| Demo user seeded on startup | ✅ |

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                     CLIENT (web)                     │
│  React 18 + Vite + TypeScript + Tailwind + Zustand   │
│  Stores: auth · budget · portfolio · chat · market   │
│  Port: 5173  →  proxied /api → :3001                 │
└──────────────────┬───────────────────────────────────┘
                   │ HTTP/SSE
┌──────────────────▼───────────────────────────────────┐
│                    SERVER (API)                      │
│         Node.js 20 + Express 5 · Port 3001           │
│  Routes: /auth /onboarding /budget /portfolio        │
│          /chat /market /insights                     │
│  Data:   In-memory Maps (no external DB)             │
│  Auth:   JWT 7-day · bcryptjs cost=10                │
└──────────────────┬───────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼───────────────────────────────────┐
│              Anthropic Claude API                    │
│   Model: claude-sonnet-4-20250514                    │
│   Streaming via Messages.stream()                    │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                MOBILE (React Native)                 │
│         Expo + Zustand · SecureStore tokens          │
│         Platform-aware API base URL                  │
│         iOS/Android/Web target                       │
└──────────────────────────────────────────────────────┘
```

**State management** — Zustand stores (no Redux boilerplate):
- `authStore` — token, user, login/signup/logout/fetchUser
- `budgetStore` — entries, goals, totals, AI insight
- `portfolioStore` — holdings, watchlist, analytics, buy/sell
- `chatStore` — messages, SSE streaming with exponential backoff retry
- `marketStore` — live simulated quotes, ticker subscription

---

## Quick Start

**Prerequisites:** Node.js 20+, npm 9+

### 1. Backend
```bash
cd server
npm install
cp .env.example .env          # set JWT_SECRET and ANTHROPIC_API_KEY
npm run dev                   # runs on :3001
```

### 2. Web Frontend
```bash
cd client
npm install
npm run dev                   # runs on :5173
```

Open http://localhost:5173

**Demo account:** `demo@financebuddy.com` / `password123`

### 3. Mobile
```bash
cd mobile
npm install
npx expo start                # scan QR with Expo Go
```

---

## Environment Variables

### Server (`server/.env`)
| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | **Yes** | Secret for signing JWTs (min 32 chars recommended) |
| `ANTHROPIC_API_KEY` | No | Enables live Claude responses; falls back to mock if absent |
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | `development` / `production` |

---

## API Reference

Base URL: `http://localhost:3001/api/v1`

All protected routes require: `Authorization: Bearer <token>`

### Authentication

#### `POST /auth/signup`
Create a new account.
```json
// Request
{ "email": "user@example.com", "password": "secret123", "buddyName": "Alex", "ageConfirmed": true }

// 201 Response
{ "token": "eyJ...", "user": { "id": "uuid", "email": "user@example.com", "buddyName": "Alex" } }
```
Errors: `400` validation · `409` email taken

#### `POST /auth/login`
```json
// Request
{ "email": "user@example.com", "password": "secret123" }

// 200 Response
{ "token": "eyJ...", "userId": "uuid", "buddyName": "Alex" }
```
Uses constant-time bcrypt to prevent email enumeration. Errors: `401` invalid credentials

#### `GET /auth/me` 🔒
Returns authenticated user profile (password excluded).
```json
// 200 Response
{ "user": { "id": "uuid", "email": "...", "buddyName": "Alex", "createdAt": "..." } }
```

---

### Budget

#### `GET /budget/entries?month=YYYY-MM` 🔒
List entries for a month (or all time if no filter). Sorted newest-first.
```json
// 200 Response
{
  "entries": [{ "id": "uuid", "type": "expense", "amount": 45.00, "category": "Food", "date": "2026-03-15" }],
  "totalIncome": 3000, "totalExpenses": 1200, "netSavings": 1800
}
```

#### `POST /budget/entries` 🔒
```json
// Request
{ "type": "expense", "amount": 45.00, "category": "Food", "description": "Groceries", "date": "2026-03-15" }
// 201 Response: BudgetEntry object
```
`type` must be `"income"` or `"expense"`. Amount: 0.01–1,000,000.

#### `PUT /budget/entries/:id` 🔒 · `DELETE /budget/entries/:id` 🔒
Partial update / delete (ownership enforced). Returns `404` if not owned.

#### `GET /budget/insight` 🔒
AI-generated 2-3 sentence insight from full entry history.
```json
{ "insight": "Your top expense is Food at $450. Consider the 50/30/20 rule..." }
```

#### `GET /budget/goals` 🔒 · `POST /budget/goals` 🔒
```json
// POST Request
{ "label": "Emergency Fund", "targetAmount": 5000, "deadline": "2026-12-31" }
// 201 Response: SavingsGoal { id, label, targetAmount, currentAmount: 0, deadline }
```

---

### Portfolio

#### `GET /portfolio/holdings` 🔒
Returns all holdings enriched with simulated live prices.
```json
{
  "holdings": [{
    "id": "uuid", "ticker": "AAPL", "shares": 10, "avgCost": 170.00,
    "currentPrice": 174.50, "marketValue": 1745.00,
    "costBasis": 1700.00, "gainLoss": 45.00, "gainLossPercent": 2.65
  }],
  "totalValue": 1745.00, "totalCost": 1700.00, "totalGainLoss": 45.00
}
```

#### `GET /portfolio/analytics` 🔒
Diversification analytics using the Herfindahl-Hirschman Index.
```json
{
  "sectorAllocation": [{ "sector": "Technology", "value": 5200.00, "percent": 65.0 }],
  "concentrationScore": 48.2,   // 0-100, lower = more diversified
  "diversificationScore": 6.5,  // 1-10, higher = better
  "topHoldings": [{ "ticker": "AAPL", "marketValue": 1745.00, "weight": 21.8 }]
}
```

#### `POST /portfolio/buy` 🔒
Averages into existing position using weighted average cost.
```json
// Request
{ "ticker": "AAPL", "shares": 5, "price": 175.00 }
// 201 Response: updated Holding object
```

#### `POST /portfolio/sell` 🔒
Partial or full liquidation.
```json
// Request
{ "ticker": "AAPL", "shares": 3 }
// 200 Response
{ "message": "Sold 3 share(s) of AAPL", "remainingShares": 7, "saleProceeds": 523.50, "realizedGainLoss": 13.50 }
```
Errors: `400` insufficient shares · `404` ticker not in portfolio

#### `GET /portfolio/watchlist` 🔒 · `POST /portfolio/watchlist` 🔒 · `DELETE /portfolio/watchlist/:ticker` 🔒
```json
// POST Request
{ "ticker": "NVDA", "companyName": "NVIDIA Corp." }
// GET Response: WatchlistItem[] — { id, ticker, companyName, addedAt }
```

#### `GET /portfolio/explain/:ticker` 🔒
AI-generated plain-language stock explanation for beginners.
```json
{ "ticker": "AAPL", "explanation": "Apple Inc. designs and sells consumer electronics..." }
```

---

### Chat (SSE Streaming)

#### `POST /chat/message` 🔒
Returns a Server-Sent Events stream. The system prompt is personalized using the user's onboarding profile (knowledge level, goals, risk score).

```json
// Request
{ "message": "How do index funds work?", "history": [{ "role": "user", "content": "..." }] }

// SSE stream:
data: {"type":"content_block_delta","text":"Index funds "}
data: {"type":"content_block_delta","text":"are baskets "}
data: {"type":"message_stop"}
```
History is sanitized server-side: max 20 items, roles must be `user`/`assistant`.

#### `GET /chat/suggestions` 🔒
Returns 3 personalized starter prompts based on onboarding profile.
```json
{ "suggestions": ["Can you explain what an index fund is?", "..."] }
```

---

### Market

#### `GET /market/quotes` 🔒
Simulated live quotes for 20+ tickers updated with Brownian motion.
```json
{ "quotes": [{ "ticker": "AAPL", "price": 174.32, "change": 1.24, "changePct": 0.72 }] }
```

---

## Data Model

All data is stored in-memory using `Map` with O(1) per-user secondary indexes. **Data does not persist across server restarts.**

```
User           { id, email, password (bcrypt), buddyName, ageConfirmed, createdAt }
OnboardingProfile { userId, knowledgeLevel, goals[], riskScore, buddyName, summary }
BudgetEntry    { id, userId, type, amount, category, description, date, createdAt }
SavingsGoal    { id, userId, label, targetAmount, currentAmount, deadline, createdAt }
Holding        { id, userId, ticker, shares, avgCost, createdAt, updatedAt }
WatchlistItem  { id, userId, ticker, companyName, addedAt }
ChatMessage    { role, content, timestamp }
```

---

## Design Decisions

**Why in-memory storage?** Hackathon scope — zero infrastructure setup, instant reset for demos. Phase 2 would migrate to PostgreSQL via Prisma.

**Why SSE instead of WebSocket for chat?** SSE is unidirectional (server→client), which perfectly matches Claude's streaming API. No additional protocol overhead, works through standard HTTP proxies.

**Why Zustand over Redux?** 80% less boilerplate for the same functionality. Each store is a single file with co-located actions and state — easy to reason about and test.

**Why HHI for diversification?** The Herfindahl-Hirschman Index is the standard measure used in antitrust economics for market concentration. Applied to portfolio weights it gives an intuitive 0-100 score that users can act on.

**SSE client reliability** — `chatStore` retries failed requests up to 3 times with exponential backoff (1s → 2s → 4s). 4xx errors are not retried (client fault). On retry, partial streamed content is cleared before the next attempt.

---

## What Is Simulated

| Feature | Reality | Phase |
|---|---|---|
| Stock prices | Brownian motion, NOT Polygon.io | Phase 2 |
| Bank accounts | Simulated balances, NOT Plaid | Phase 3 |
| Trading | Paper trading only — no real money | Always |

Educational disclaimers are shown on Portfolio, Chat, and insight pages.

---

## Team

| Member | Role |
|---|---|
| Sierra | Full-stack web (React + Express + Claude integration) |
| Tanner | Mobile (React Native + Expo) |
| Zizhang | ML Research (Phase 4: LSTM/XGBoost recommendation engine) |
| Michael | Design & Product (brand identity, UX, feature definitions) |

---

*Finance Buddy is an educational demo. AI responses are for educational purposes only — not financial advice.*
