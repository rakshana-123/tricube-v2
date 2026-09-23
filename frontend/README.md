# TRI CUBE Digital Solutions

Premium LMS + company website — React frontend and Node/Express/MySQL backend, running fully on localhost.

## Stack

**Frontend** (`/`)
- React 19 + Vite, TanStack Start / Router
- Tailwind CSS v4 (white + gold Apple-style design system)
- Framer Motion, TanStack Query, Zod, React Hook Form

**Backend** (`/backend`)
- Node.js + Express
- Prisma ORM + MySQL 8 (local)
- JWT auth, Multer uploads, Nodemailer emails
- Razorpay payments, PDFKit + QRCode certificates

## Quick start

See `INSTALL.md`. Short version:

```bash
# Backend
cd backend && cp .env.example .env && npm install
npx prisma migrate dev --name init && npm run db:seed && npm run dev

# Frontend (new terminal, from project root)
bun install && bun run dev
```

Frontend: http://localhost:5173 · Backend: http://localhost:5000

## Phase 1 delivered

- Full public site: home (hero, motto, vision, mission, why-us, stats, popular courses, events, testimonials, partners, FAQ, newsletter, contact + map), about, services, courses catalog, events, blog, gallery, testimonials, FAQ, contact form.
- Apple-style white + gold design system with glassmorphism, gradients, floating shapes, animated stats, dark-mode toggle, per-page SEO.
- Backend: full Prisma schema (25+ tables), raw `sql/schema.sql`, seed data, JWT auth, courses/services/events/payments/contact/content/admin/uploads/certificates routes wired with Razorpay + Nodemailer + PDFKit.

## Coming next

- Phase 2: Auth UI, Razorpay checkout, video LMS + progress, quiz engine, certificate download.
- Phase 3: Admin dashboard UI, reports, exports.
- Phase 4: Polish, sitemap, SEO settings.

© TRI CUBE Digital Solutions