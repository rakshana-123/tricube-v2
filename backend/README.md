# TRI CUBE Backend — Express + Prisma + MySQL

Local Node.js API for the TRI CUBE Digital Solutions website and LMS.

## Requirements

- Node.js 20+
- MySQL 8.x running locally
- npm or bun

## Setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Health check: `GET http://localhost:5000/health`

## Seeded accounts

| Role         | Email                     | Password     |
| ------------ | ------------------------- | ------------ |
| super_admin  | admin@tricube.local       | Admin@12345  |
| trainer      | trainer@tricube.local     | Admin@12345  |
| student 1-5  | studentN@tricube.local    | Student@123  |

See project root `INSTALL.md` and `README.md` for full details.