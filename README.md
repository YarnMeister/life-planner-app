# New App Template

A production-ready starter template for building modern web applications with React, TypeScript, Drizzle ORM, and Neon PostgreSQL.

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Mantine UI + shadcn/ui + Tailwind CSS + Radix UI
- **Icons:** Tabler Icons
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **Deployment:** Vercel
- **Testing:** Vitest + React Testing Library
- **Package Manager:** npm

---

## 🎨 UI Components

This template comes with **Mantine UI** pre-configured with a professional blue theme. Mantine provides:

- 🎯 **100+ Components** - Buttons, forms, modals, tables, and more
- 🎨 **Customizable Theme** - Easy to adapt to your brand colors
- ♿ **Accessible** - WCAG compliant components
- 📱 **Responsive** - Mobile-first design with built-in breakpoints
- 🔧 **TypeScript** - Full type safety out of the box

**Quick Start:**
```tsx
import { Button, TextInput, Card } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

function MyComponent() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <TextInput label="Email" placeholder="your@email.com" />
      <Button leftSection={<IconCheck size={16} />}>Submit</Button>
    </Card>
  );
}
```

📚 **Learn More:**
- Visit `/mantine-demo` to see all components in action
- Read the [Mantine Setup Guide](./docs/mantine-setup.md) for customization
- Browse [Mantine Documentation](https://mantine.dev/)

**Hybrid UI System:**
This template includes both Mantine UI and shadcn/ui, allowing you to use the best components from each library.

---

## 📋 Setup Instructions

Follow this runsheet to implement the template before building features.

### 1. Create a Working Branch

```bash
git clone https://github.com/YarnMeister/new-app-template.git
cd new-app-template
git checkout -b init-project
```

> ⚠️ **Important:** Follow your "no direct commits to main" rule

### 2. Install Dependencies and Boot

```bash
npm ci
npm run dev
```

✅ Confirm the placeholder home page renders at `http://localhost:5173`

### 3. Provision Neon Databases

Create **at least two databases**:
- **TEST** - for CI/local development
- **PROD** - for Vercel production

📝 Grab connection strings with `sslmode=require`

### 4. Set Local Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Configure the following variables:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
# Leave PROD_DATABASE_URL empty locally (only used in Vercel)
PROD_DATABASE_URL=

# Optional: Skip RLS tests for first pipeline run
# SKIP_RLS_TESTS=1
```

### 5. Set GitHub Actions Secrets (TEST)

In your repo: **Settings → Secrets and variables → Actions → Repository secrets**

Add:
- `DATABASE_URL` = Neon TEST connection string
- (Optional) `SKIP_RLS_TESTS=1` for first run (remove after first successful deploy)

### 6. Set Vercel Environment (PROD)

1. Create a new Vercel project linked to your repository
2. Go to **Project Settings → Environment Variables**
3. Add:
   - `PROD_DATABASE_URL` (Production scope) = Neon PROD connection string
4. Ensure Node and build defaults are fine for Vite (they usually are)

### 7. Initialize Drizzle for Your Domain

Edit `drizzle/schema.ts` and replace the `app_example` placeholder with your real tables:

```bash
# Generate migrations
npm run db:generate

# Review SQL in drizzle/migrations/

# Apply locally to TEST
npm run db:migrate
```

> 💾 The `db:migrate` command uses `DATABASE_URL` from `.env.local`

**Commit your changes:**
```bash
git add drizzle/
git commit -m "Add initial schema and migrations"
```

### 8. RLS and Safety Audits

When you add protected tables, author RLS migrations as SQL files (enable + policies), then run:

```bash
npm run db:lint:migrations
npm run db:test-rls        # if/when you add RLS harness
npm run db:audit-rls
npm run db:audit-raw-sql
```

> 🛡️ If first deploy is blocked by RLS checks, set `SKIP_RLS_TESTS=1` once, deploy, then remove

### 9. Update Documentation

- Update this README with your app name, dev scripts, and environment setup
- If you keep `docs/`, prune or retitle content to match your app's purpose
- Update `package.json` name and description

### 10. Optional: CI Workflow

If you don't yet have `.github/workflows/` pipeline, add one to:
1. Install dependencies
2. Lint migrations
3. Apply to TEST DB (using `DATABASE_URL` secret)
4. Run audits/tests

Keep it green before merging to main (this gates Vercel deploys)

### 11. Verify from Scratch

Remove DB and re-apply migrations locally to validate the full path:

```bash
npm run db:status
npm run db:migrate
npm run dev
```

🧪 Smoke test the application

### 12. Merge and Deploy

```bash
# Open PR from init-project → main
git push origin init-project
```

When ready, per your rule, say **"deploy to prod"** to merge the branch into main and trigger Vercel deployment.

### 13. Start Feature Work

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

**Development loop:**
1. Update `drizzle/schema.ts`
2. Run `npm run db:generate`
3. Review SQL in `drizzle/migrations/`
4. Run `npm run db:migrate`
5. Commit schema + SQL migrations + journal

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply migrations |
| `npm run db:status` | Check migration status |
| `npm run db:lint:migrations` | Lint migration files |
| `npm run db:test-rls` | Test Row Level Security |
| `npm run db:audit-rls` | Audit RLS policies |
| `npm run db:audit-raw-sql` | Audit raw SQL usage |

---

## 🗂️ Project Structure

```
├── drizzle/              # Database schema and migrations
│   ├── schema.ts         # Drizzle schema definitions
│   └── migrations/       # Generated SQL migrations
├── scripts/              # Database utility scripts
├── src/
│   ├── components/ui/    # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── theme/            # Mantine theme configuration
│   └── tests/            # Test files
├── public/               # Static assets
└── docs/                 # Documentation
```

---

## 🔒 Security & Best Practices

- ✅ Row Level Security (RLS) audits built-in
- ✅ Migration linting before apply
- ✅ Separate TEST and PROD databases
- ✅ No direct commits to main (branch-based workflow)
- ✅ Environment variable validation

---

## 📚 Additional Resources

- [Mantine UI Docs](https://mantine.dev/) - UI component library
- [Tabler Icons](https://tabler.io/icons) - Icon library
- [Drizzle ORM Docs](https://orm.drizzle.team/) - Database ORM
- [Neon Docs](https://neon.tech/docs) - PostgreSQL hosting
- [Vercel Docs](https://vercel.com/docs) - Deployment platform
- [shadcn/ui](https://ui.shadcn.com/) - Additional UI components

---

## 📝 License

MIT