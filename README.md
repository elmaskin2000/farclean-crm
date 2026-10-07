# B2B Industrial CRM

Aplikasi CRM Internal untuk Perusahaan B2B Industrial, dibangun menggunakan Next.js App Router, Prisma ORM, dan Tailwind CSS.

## 1. Struktur Project
- `/src/app` - Next.js App Router (Pages, Layouts, API Routes)
- `/src/components` - UI Components (shadcn/ui & custom layout components)
- `/src/lib` - Utility functions, Prisma client, NextAuth configuration
- `/src/types` - TypeScript definition files
- `/prisma` - Schema database dan script seeding

## 2. Tech Stack
- **Frontend**: Next.js 15, React, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Next.js Server Actions & API Routes, NextAuth.js
- **Database**: SQLite (untuk development lokal) dikelola melalui Prisma ORM
- **Validation**: Zod (digunakan secara internal / native HTML5 required)

## 3. Database Schema Summary
Model yang tersedia:
- `User`, `Role`
- `Company`, `Contact`
- `Lead`, `LeadActivity`
- `PipelineStage`, `Opportunity`, `OpportunityProduct`
- `Quotation`, `QuotationItem`
- `Activity`, `Task`, `Campaign`, `Document`, `LostReason`, dll.

## 4. Cara Install
```bash
npm install
```

## 5. Cara Menjalankan Development
```bash
npm run dev
```
Akses di `http://localhost:3000`

## 6. Cara Menjalankan Migration
Karena menggunakan SQLite untuk dev:
```bash
npx prisma db push
```

## 7. Cara Menjalankan Seed
```bash
npx prisma db seed
npx tsx prisma/seed-stages.ts
```

## 8. Cara Menjalankan Test
Belum ada testing framework yang dikonfigurasi (bisa ditambahkan Jest / Playwright). Untuk mengecek tipe TypeScript:
```bash
npx tsc --noEmit
```

## 9. Cara Build Production
```bash
npm run build
npm start
```

## 10. Environment Variables
Buat file `.env` di root direktori:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="super-secret-next-auth-key-12345"
NEXTAUTH_URL="http://localhost:3000"
```

## 11. Default Development Login
Seed script membuat 3 user berikut:
- **Admin**: admin@crm.local (Password: password123)
- **Manager**: manager@crm.local (Password: password123)
- **Sales**: sales@crm.local (Password: password123)

## 12. Daftar Fitur Selesai
- Authentication & Session (NextAuth)
- Dashboard Layout & UI Dasar
- Company Management (Create & Read)
- Contact Management (Create & Read)
- Lead Management (Create, View, Change Status, Add Activity, Convert to Opportunity)
- Pipeline/Opportunity (Kanban read-only, View, Edit Stage)
- Quotation Generation, Items Management, & Print-ready layout

## 13. Daftar Fitur Belum Selesai (Next Steps)
- [x] Dashboard Charts via Recharts
- [x] Tasks CRUD Management
- RBAC / Permission validation strictly on Server Actions
- Document Uploads
- Audit Logging & Notifications module
- [x] Data Export (CSV) for Leads

## 14. Known Issues
- Menggunakan SQLite untuk memastikan build dan akses instan bisa dilakukan, karena tidak ada service PostgreSQL/Docker terdeteksi. Untuk menggunakan Postgres, ubah provider di `schema.prisma` menjadi `"postgresql"` dan update `DATABASE_URL`.
