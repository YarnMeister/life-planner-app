# Email Authentication Setup Guide

This template includes a complete passwordless email authentication system using Resend.com for email delivery, built with Next.js App Router.

## 🎯 Features

- ✅ **Passwordless authentication** with 6-digit email codes
- ✅ **10-minute code expiration** for security
- ✅ **Rate limiting** (3 requests per 5 minutes per email)
- ✅ **JWT tokens** with 7-day expiration
- ✅ **HttpOnly cookies** for secure token storage
- ✅ **Next.js middleware** for route protection
- ✅ **Auto-user creation** on first login
- ✅ **Mock mode** for development without email API
- ✅ **Mock database** for development without PostgreSQL

## 📋 Quick Start

### 1. Set Up Environment Variables

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

For development with mock database and email:

```env
# Mock database for development (no PostgreSQL needed)
DATABASE_URL=mock

# Required: JWT secret (generate with: openssl rand -base64 32)
# Must be at least 32 characters
JWT_SECRET=dev-jwt-secret-must-be-at-least-32-characters-long-for-validation

# Development bypass code (optional - allows testing without emails)
DEV_BYPASS_CODE=123456
DEV_TEST_EMAIL=test@example.com

# Optional: Resend API key (if not set, codes print to console)
# RESEND_API_KEY=re_xxxxxxxxxx
```

For production with real database:

```env
# Real PostgreSQL database
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Required: JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secure-random-string-at-least-32-chars

# Required in production: Resend API key
RESEND_API_KEY=re_xxxxxxxxxx

# Required in production
NODE_ENV=production
```

### 2. Run Database Migrations (Production Only)

**Skip this for development with mock database (`DATABASE_URL=mock`)**

For production with a real database:

```bash
npm run db:generate
npm run db:migrate
```

This creates two tables:
- `users` - stores user accounts (email, id, timestamps)
- `auth_codes` - stores verification codes (email, code, expiration, used flag)

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you'll be redirected to `/login` by Next.js middleware.

## 🔧 Configuration

### Mock Database Mode (Development)

Set `DATABASE_URL=mock` in `.env.local` to use an in-memory database. Perfect for:
- Local development without PostgreSQL
- Testing the template
- Demo deployments

**Note:** Data is stored in memory and lost on server restart.

### Development Bypass Mode

Set `DEV_BYPASS_CODE` to skip email sending in development:

```env
DEV_BYPASS_CODE=123456
DEV_TEST_EMAIL=test@example.com
```

Any email will work with the bypass code in development/test environments. This is **blocked in production** for security.

### Resend.com Setup (Optional for Production)

1. Sign up at [https://resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add your domain for sending emails
4. Add `RESEND_API_KEY` to your environment variables

**For development:** If `RESEND_API_KEY` is not set, authentication codes will be logged to the console instead of being emailed.

### JWT Secret Generation

Generate a secure JWT secret (must be at least 32 characters):

```bash
openssl rand -base64 32
```

Add this to your `.env.local` as `JWT_SECRET`.

### Vercel Environment Variables

For production deployment on Vercel, add these environment variables:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - `DATABASE_URL` or `PROD_DATABASE_URL` (Production scope)
   - `JWT_SECRET` (Production scope, 32+ characters)
   - `RESEND_API_KEY` (Production scope)
   - `NODE_ENV=production` (Production scope)
   - `FROM_EMAIL=noreply@yourdomain.com` (Production scope)

## 🏗️ Architecture

### Backend (Next.js App Router API Routes)

Located in `/app/api/auth/`:

- **`request-code/route.ts`** - Sends verification code via email
  - Rate limiting (3 requests per 5 minutes)
  - Auto-creates user if doesn't exist
  - Stores code in database with 10-minute expiration
  - Supports DEV_BYPASS_CODE in development

- **`verify-code/route.ts`** - Verifies code and creates session
  - Validates code against database
  - Marks code as used (one-time use)
  - Generates JWT token
  - Sets HttpOnly cookie

- **`me/route.ts`** - Returns current authenticated user
  - Verifies JWT token from cookie
  - Returns user information

- **`logout/route.ts`** - Clears authentication session
  - Expires the auth cookie

### Middleware (`middleware.ts`)

Next.js middleware protects routes:
- Checks for valid JWT in cookies
- Redirects unauthenticated users to `/login`
- Allows access to `/login`, `/verify`, and `/api/auth/*`

### Frontend Components

#### Auth Context (`src/contexts/AuthContext.tsx`)
Provides global authentication state and methods:
```typescript
const { user, isLoading, isAuthenticated, login, logout, requestCode } = useAuth();
```

#### Auth Pages
- **`/login`** (`app/login/page.tsx`) - Email entry page
- **`/verify`** (`app/verify/page.tsx`) - 6-digit code verification page

#### Protected Routes
All routes are protected by default via `middleware.ts`. To make a route public, add it to the matcher config in `middleware.ts`.

## 🔒 Security Features

### 1. Rate Limiting
- **3 requests per email per 5 minutes** to prevent abuse
- Database-based tracking
- Returns HTTP 429 when limit exceeded

### 2. Code Security
- **6-digit numeric codes** (1,000,000 combinations)
- **10-minute expiration** for time-limited access
- **One-time use** - codes marked as used after verification
- **Email-specific** - codes tied to email addresses

### 3. JWT Security
- **7-day expiration** for reasonable session length
- **Issuer and audience validation**
- **HttpOnly cookies** prevent XSS attacks
- **Secure flag** in production for HTTPS-only
- **SameSite: lax** for CSRF protection

### 4. Input Validation
- **Zod schema validation** for all inputs and environment variables
- **Email format validation**
- **Code length validation** (exactly 6 digits)
- **Centralized env validation** in `src/lib/env.ts`

### 5. Development Safety
- **DEV_BYPASS_CODE blocked in production** via Zod validation
- **Mock database blocked for DrizzleKit operations**
- **Console logs gated by NODE_ENV**

## 📝 Customization

### Change Email Template

Edit `src/lib/auth/email.ts` to customize the email design:

```typescript
await resend.emails.send({
  from: serverEnv.FROM_EMAIL,
  subject: 'Your custom subject',
  html: `...your custom HTML...`,
});
```

### Adjust Token Expiration

Edit `src/lib/auth/jwt.ts`:

```typescript
return jwt.sign(payload, serverEnv.JWT_SECRET, {
  expiresIn: '14d', // Change from 7d to 14d
  // ...
});
```

### Modify Rate Limits

Edit `src/lib/env.ts` and set in `.env.local`:

```env
AUTH_RATE_LIMIT_WINDOW_MS=600000  # 10 minutes
AUTH_RATE_LIMIT_MAX=5              # 5 requests
```

### Change Code Expiration

Edit `src/lib/env.ts` and set in `.env.local`:

```env
AUTH_CODE_TTL_MINUTES=15  # 15 minutes
```

## 🧪 Testing

### Development Mode (Mock Database + Mock Email)

1. Set `.env.local`:
```env
DATABASE_URL=mock
JWT_SECRET=dev-jwt-secret-must-be-at-least-32-characters-long
DEV_BYPASS_CODE=123456
```

2. Start the dev server: `npm run dev`
3. Request a code at `/login`
4. Check the console for the code:

```
============================================================
📧 DEV BYPASS MODE ACTIVE
============================================================
📧 To: user@example.com
🔑 Code: 123456 (DEV BYPASS)
============================================================
```

5. Enter the code at `/verify`

### Production Testing

1. Set real `DATABASE_URL`, `JWT_SECRET`, and `RESEND_API_KEY`
2. Request a code - check your email
3. Enter the code to authenticate

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables (see Configuration section)
4. Deploy!

The API routes will automatically work as serverless functions with Next.js App Router.

## 🐛 Troubleshooting

### "Failed to send authentication code"

**Check:**
- Is `RESEND_API_KEY` set correctly?
- Is your domain verified in Resend dashboard?
- Check Resend dashboard for delivery logs

**Solution:** Run in mock mode (unset `RESEND_API_KEY`) for testing

### "Invalid or expired authentication code"

**Check:**
- Is the code still valid (10-minute window)?
- Was the code already used?
- Is the email correct?

**Solution:** Request a new code

### "Database connection failed"

**Check:**
- Is `DATABASE_URL` set correctly?
- Is the database accessible?
- Have migrations been run?

**Solution:** 
- For development: Use `DATABASE_URL=mock`
- For production: Verify connection string and run `npm run db:migrate`

### "DrizzleKit commands fail with mock database"

**Expected behavior:** DrizzleKit (`db:generate`, `db:migrate`) requires a real PostgreSQL URL. Use a real database URL when running these commands.

### "JWT verification failed"

**Check:**
- Is `JWT_SECRET` the same across all instances?
- Is the cookie being sent with requests?
- Is `JWT_SECRET` at least 32 characters?

**Solution:** Clear cookies and log in again

## 📚 API Reference

### POST /api/auth/request-code

Request a verification code.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication code sent to your email"
}
```

**Errors:**
- `400` - Invalid email
- `429` - Rate limit exceeded
- `500` - Server error

### POST /api/auth/verify-code

Verify code and create session.

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

**Errors:**
- `400` - Invalid or expired code
- `404` - User not found
- `500` - Server error

### GET /api/auth/me

Get current authenticated user.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

**Errors:**
- `401` - Not authenticated
- `404` - User not found
- `500` - Server error

### POST /api/auth/logout

Logout current user.

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

## 🎨 UI Customization

The auth pages use Mantine UI components. Customize them in:

- `app/login/page.tsx` - Email entry page
- `app/verify/page.tsx` - Code verification page

Both pages match the template's design system and can be easily styled with Mantine's theming system.

## 📖 Further Reading

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Resend Documentation](https://resend.com/docs)
- [JWT Best Practices](https://jwt.io/introduction)
- [Mantine UI Documentation](https://mantine.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
