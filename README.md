# Mimo Profile Widget

A live SVG badge for your GitHub README that pulls your [Mimo](https://mimo.org) streak, coins, and sparks (XP) straight from your account.

<table border="0">
  <tr>
    <td>
      <a href="https://mimo-profile-widget.vercel.app">
        <img src="https://mimo-profile-widget.vercel.app/api/widget/d6be51ad-166b-4f0f-96fd-65c2ede21898" width="100%" />
      </a>
    </td>
    <td>
      <a href="https://mimo-profile-widget.vercel.app">
        <img src="https://mimo-profile-widget.vercel.app/api/widget/d6be51ad-166b-4f0f-96fd-65c2ede21898?theme=midnight" width="100%" />
      </a>
    </td>
  </tr>
</table>

## Why a login step?

Mimo has no public API for looking up stats by username, unlike Duolingo. So instead of a `?username=` query param, you connect your account once through the site and get a stable widget link back.

<div align="center">
  <img src="img/connect-placeholder.png" alt="Connect account screen" width="75%" style="border-radius: 15px; border: 1px solid #37464f;" />
</div>

<div align="center">
  <img src="img/preview-placeholder.png" alt="Widget preview and theme picker" width="75%" style="border-radius: 15px; border: 1px solid #37464f;" />
</div>

👉 **[Open the app](https://mimo-profile-widget.vercel.app)**

## Themes

| Theme | Preview | Theme | Preview |
| :--- | :--- | :--- | :--- |
| **Default** | ![](https://mimo-profile-widget.vercel.app/api/widget/d6be51ad-166b-4f0f-96fd-65c2ede21898) | **Midnight** | ![](https://mimo-profile-widget.vercel.app/api/widget/d6be51ad-166b-4f0f-96fd-65c2ede21898?theme=midnight) |
| **Sunset** | ![](https://mimo-profile-widget.vercel.app/api/widget/d6be51ad-166b-4f0f-96fd-65c2ede21898?theme=sunset) | **Forest** | ![](https://mimo-profile-widget.vercel.app/api/widget/d6be51ad-166b-4f0f-96fd-65c2ede21898?theme=forest) |
| **Cyber** | ![](https://mimo-profile-widget.vercel.app/api/widget/d6be51ad-166b-4f0f-96fd-65c2ede21898?theme=cyber) | **Mono** | ![](https://mimo-profile-widget.vercel.app/api/widget/d6be51ad-166b-4f0f-96fd-65c2ede21898?theme=mono) |

## Usage

Connect your account on the [site](https://mimo-profile-widget.vercel.app), copy your widget ID, and drop this into your README:

```markdown
[![Mimo Stats](https://mimo-profile-widget.vercel.app/api/widget/YOUR_WIDGET_ID)](https://mimo.org)
```

### Query params

| Parameter | Required | What it does | Values |
| :--- | :--- | :--- | :--- |
| `id` | **Yes** | Your widget ID from the connect flow | e.g. `d6be51ad-166b-4f0f-96fd-65c2ede21898` |
| `theme` | No | Color scheme | `default`, `midnight`, `sunset`, `forest`, `cyber`, `mono` |
| `stats` | No | Which stats to render (all three by default) | Any of `streak`, `coins`, `sparks`, comma-separated — e.g. `stats=streak,coins` |

The site UI itself ships in English and Russian.

## Under the hood

Signing in sends your email and password to the server once, over HTTPS. That single request is traded for a Firebase `idToken` and `refreshToken` — the password never touches disk or logs. Only the `refreshToken` sticks around, and only encrypted with AES-256-GCM. From there, the widget URL you get back carries no credentials at all: it's just an opaque ID.

When someone loads that URL, the server checks a short-lived cache before hitting Mimo again, so flipping a theme or a stat in the configurator feels instant instead of re-authenticating every time. Responses are cached a second time at the HTTP layer on top of that. Disconnecting from the site wipes the stored token for good.

**Worth knowing:** Mimo doesn't expose or document this API — it was pieced together by watching the official web app's network traffic, so it can change or break without warning. This project isn't affiliated with Mimo in any way, and running it means trusting whoever hosts the deployment with a refresh token tied to your account. If you're not hosting it yourself, that's worth keeping in mind.

## Stack

* **[Next.js 14](https://nextjs.org/)** (App Router, TypeScript) — routing, API routes, SVG rendering
* **Feature-Sliced Design** — keeps domain logic, UI, and routing in separate layers
* **[Upstash Redis](https://upstash.com/)** — encrypted token storage and the stats cache
* **Node's `crypto`** — AES-256-GCM encryption at rest
* **Firebase Identity Platform** — same auth backend Mimo's own app uses

## Project layout

Routing lives in `app/` and stays thin — everything else sits under `src/`, split into Feature-Sliced Design layers:

```
src/
  app/        global styles
  pages/      composes widgets into the single page
  widgets/    self-contained UI blocks (connect form, widget preview, widget links)
  features/   user actions (connect/disconnect, toggle a theme or stat, copy to clipboard)
  entities/   domain building blocks (theme, stats, stat icons, mascot, token storage)
  shared/     framework-agnostic building blocks (i18n, SVG builder, Redis/Firebase clients, UI primitives)
```

Imports only point downward — `pages` can reach into `widgets`, `features`, and `entities`, never the reverse. Path aliases (`@pages/*`, `@widgets/*`, `@features/*`, `@entities/*`, `@shared/*`) mirror this layout.

## Setup

```bash
npm install
cp .env.example .env.local
```

In `.env.local`:

- `WIDGET_ENCRYPTION_KEY` — generate with `openssl rand -base64 32`
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` — provided by the "Upstash for Redis" integration once connected in Vercel (Storage → Marketplace Database Providers); pull them down with `vercel env pull .env.local`

```bash
npm run dev
```

## Deploy

```bash
vercel deploy
```

Add an Upstash Redis database from the Vercel dashboard first, and set `WIDGET_ENCRYPTION_KEY` before deploying to production.
