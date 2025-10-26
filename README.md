# New App Template - Next.js Edition

A production-ready starter template for building modern web applications with React, Next.js, TypeScript, Drizzle ORM, Neon PostgreSQL, and **passwordless email authentication**.

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript + Next.js 15 (App Router)
- **UI:** Mantine UI + shadcn/ui + Tailwind CSS + Radix UI
- **Icons:** Tabler Icons
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **Authentication:** Email OTP (Passwordless) with Resend.com
- **API:** Next.js Route Handlers
- **Deployment:** Vercel
- **Testing:** Vitest + React Testing Library
- **Package Manager:** npm

---

## 🔐 Authentication

This template includes a **complete email authentication system** with:

- ✅ Passwordless login with 6-digit codes
- ✅ Email delivery via [Resend.com](https://resend.com)
- ✅ Secure JWT tokens with HttpOnly cookies
- ✅ Route protection with Next.js middleware
- ✅ Server-only database access with `server-only` enforcement
- ✅ Rate limiting and security best practices

**[📖 View Auth Setup Guide](./docs/email-auth-setup-instructions.md)**

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
    <Card shadow="sm" padding="lg">
      <TextInput label="Email" placeholder="your@email.com" />
      <Button leftSection={<IconCheck />}>Submit</Button>
    </Card>
  );
}
```

**[📖 View Mantine Setup Guide](./docs/mantine-setup.md)** | **[🎨 See Component Demo](http://localhost:3000/mantine-demo)**

---

## 📦 What's Included

### Core Features
- ⚡ **Next.js App Router** - Server components and streaming by default
- 🔒 **Email Authentication** - Passwordless login with Resend
- 🗄️ **Database Ready** - Drizzle ORM with Neon PostgreSQL
- 🎨 **Beautiful UI** - Mantine + shadcn/ui components
- 🧪 **Testing Setup** - Vitest configured and ready
- 📝 **TypeScript** - Strict mode enabled
- 🎯 **ESLint + Prettier** - Code quality tools
- 🚀 **Vercel Deployment** - One-click deploy

### Developer Experience
- 🔥 Hot reload with Fast Refresh
- 📁 Clean project structure with App Router
- 🛡️ Type-safe API routes
- 🔍 Automatic code splitting
- 📊 Bundle analyzer included
- 🌍 Environment variable validation with Zod

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- npm installed
- Neon PostgreSQL account (free tier available)
- Resend.com account (free tier available)

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd new-app-template
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database (Neon)
DATABASE_URL="postgresql://..."

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-secret-key-here"

# Resend Email API
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@yourdomain.com"

# Optional: Auth Configuration
AUTH_RATE_LIMIT_WINDOW_MS=300000  # 5 minutes
AUTH_RATE_LIMIT_MAX=3              # 3 attempts per window
AUTH_CODE_TTL_MINUTES=10           # Code expires in 10 minutes
```

### 4. Database Setup

```bash
# Generate migration from schema
npm run db:generate

# Apply migrations to your database
npm run db:migrate

# Verify migration was successful
npm run db:verify-migration
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
new-app-template/
├── app/                      # Next.js App Router
│   ├── api/                 # API Route Handlers
│   │   └── auth/           # Authentication endpoints
│   ├── components/         # UI components (shadcn/ui)
│   ├── login/              # Login page
│   ├── verify/             # OTP verification page
│   ├── mantine-demo/       # Mantine component showcase
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── not-found.tsx       # 404 page
│   └── globals.css         # Global styles
├── src/
│   ├── components/
│   │   └── providers/      # Client-side providers
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/
│   │   ├── auth/           # Auth utilities
│   │   │   ├── db.server.ts    # Server-only DB module
│   │   │   ├── email.ts        # Email sending
│   │   │   ├── jwt.ts          # JWT utilities
│   │   │   └── utils.ts        # Helper functions
│   │   ├── env.ts          # Environment validation
│   │   └── utils.ts        # General utilities
│   ├── tests/              # Test setup and utilities
│   └── theme/              # Mantine theme config
├── drizzle/
│   ├── migrations/         # Database migrations
│   └── schema.ts           # Database schema
├── scripts/                # Database utility scripts
├── public/                 # Static files
├── docs/                   # Documentation
├── next.config.ts          # Next.js configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vitest.config.ts        # Vitest configuration
├── middleware.ts           # Next.js middleware (auth)
└── package.json
```

---

## 🗄️ Database Management

### Common Commands

```bash
# Generate a new migration after schema changes
npm run db:generate

# Apply pending migrations
npm run db:migrate

# Check migration status
npm run db:status

# Verify migration integrity
npm run db:verify-migration

# Test database connection
npm run db:test-connection
```

### Schema Updates

1. Edit `drizzle/schema.ts`
2. Run `npm run db:generate` to create migration
3. Review the migration in `drizzle/migrations/`
4. Run `npm run db:migrate` to apply changes

**[📖 Read Full Migration Guide](./docs/migrations.md)**

---

## 🔑 Authentication Flow

### How It Works

1. **Request Code:** User enters email → 6-digit code sent via Resend
2. **Verify Code:** User enters code → JWT token created → Cookie set
3. **Protected Routes:** Middleware checks cookie → Redirects if missing
4. **API Protection:** Route handlers verify JWT from cookie

### Implementation

**Login Page** (`app/login/page.tsx`)
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';

function LoginPage() {
  const { requestCode } = useAuth();
  // ... request authentication code
}
```

**Verify Page** (`app/verify/page.tsx`)
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';

function VerifyPage() {
  const { login } = useAuth();
  // ... verify code and login
}
```

**Protected Page** (`app/page.tsx`)
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';

function HomePage() {
  const { user, logout } = useAuth();
  // Middleware redirects if not authenticated
  return <div>Welcome {user?.email}</div>;
}
```

**Middleware** (`middleware.ts`)
```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  // Redirect logic based on token presence
}
```

---

## 🎨 Styling & Theming

### Mantine Theme

Edit `src/theme/mantine-theme.ts` to customize:

```typescript
export const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: ['#eff6ff', '#dbeafe', ...], // Your brand colors
  },
  // ... more theme options
});
```

### Tailwind CSS

Edit `tailwind.config.ts` for utility classes. Both Mantine and Tailwind work together seamlessly.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

Tests are located alongside source files with `.test.ts` or `.test.tsx` extensions.

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
4. Deploy!

Vercel will automatically:
- Run migrations on preview deployments
- Build and deploy your Next.js app
- Set up custom domains

### Environment Variables in Vercel

**Production:**
- Set all required env vars in "Environment Variables" section
- Make sure `NODE_ENV` is set to `production`

**Preview Deployments:**
- Migrations run automatically via `prebuild` script
- Use a separate database for preview if needed

---

## 📚 Documentation

- [Email Authentication Setup](./docs/email-auth-setup-instructions.md) - Complete auth guide
- [Mantine UI Setup](./docs/mantine-setup.md) - UI customization guide
- [Database Migrations](./docs/migrations.md) - Schema management guide
- [Test Playbook](./docs/test-playbook.md) - Testing guidelines

---

## 🛠️ Scripts Reference

### Development
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size

### Database
- `npm run db:generate` - Generate migration
- `npm run db:migrate` - Apply migrations
- `npm run db:status` - Check status
- `npm run db:lint:migrations` - Lint migrations
- `npm run db:test-connection` - Test connection
- `npm run db:verify-migration` - Verify integrity

### Testing
- `npm test` - Run tests once
- `npm run test:watch` - Watch mode
- `npm run test:ui` - UI mode
- `npm run test:coverage` - Coverage report

---

## 🔒 Security Features

- ✅ HttpOnly cookies for JWT storage
- ✅ CSRF protection with SameSite cookies
- ✅ Rate limiting on auth endpoints
- ✅ Failed attempt tracking and lockout
- ✅ Code hashing (never store plaintext)
- ✅ JWT token expiration
- ✅ Environment variable validation
- ✅ Server-only database access
- ✅ SQL injection prevention (Drizzle ORM)

---

## 📝 Common Tasks

### Add a New Page

1. Create `app/your-page/page.tsx`
```tsx
'use client';

export default function YourPage() {
  return <div>Your content</div>;
}
```

2. Page is automatically routed to `/your-page`

### Add a New API Endpoint

1. Create `app/api/your-endpoint/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}
```

### Add Database Table

1. Edit `drizzle/schema.ts`
```typescript
export const yourTable = pgTable('your_table', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

2. Generate and apply migration
```bash
npm run db:generate
npm run db:migrate
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the documentation in `/docs`
- Review the Mantine demo at `/mantine-demo`

---

## 🎯 Next Steps

1. ✅ Set up your database and environment variables
2. ✅ Customize the Mantine theme colors
3. ✅ Add your own pages and components
4. ✅ Configure your domain for email sending
5. ✅ Deploy to Vercel

**Happy coding! 🚀**
