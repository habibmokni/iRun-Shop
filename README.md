# iRun Shop

A modern running shoe e-commerce app built with Angular 21 and Angular Material 3. Features product browsing, Click & Collect checkout, store availability, wishlist, dark mode, and more.

## Tech Stack

Angular 21 · Angular Material 3 · Firebase (Auth + Firestore) · Google Maps · TypeScript 5.9

## Prerequisites

- Node.js v20+ (v24 recommended)
- npm 11+

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
ng serve
```

Open [http://localhost:4200](http://localhost:4200).

## Build

```bash
ng build
```

Output goes to `dist/i-run-v21`.

## Project Structure

```
src/app/
├── admin/          # Admin panel (product & store management, DB seeding)
├── auth/           # Login & registration
├── cart/           # Shopping cart & add-to-cart dialog
├── checkout/       # Checkout flow (Click & Collect, billing, payment)
├── home/           # Home page (hero, bestsellers, brands)
├── information/    # FAQ page
├── layout/         # Header, footer, intro page
├── products/       # Product list, detail, filters, store availability
├── shared/         # Shared services (theme, etc.)
├── stores/         # Store selector, maps, store cards
└── user/           # User profile, wishlist, orders
```

## Key Features

- **Click & Collect** — Order online, pick up in store
- **Store Availability** — Real-time stock checks by store and size
- **Dark Mode** — Light/dark theme toggle with full M3 support
- **Responsive** — Mobile-first design with desktop enhancements
- **Firebase** — Authentication and Firestore for data persistence
