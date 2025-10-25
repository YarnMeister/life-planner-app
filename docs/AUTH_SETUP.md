# Email Authentication Setup Guide

This template includes a complete passwordless email authentication system using Resend.com for email delivery.

## 🎯 Features

- ✅ **Passwordless authentication** with 6-digit email codes
- ✅ **10-minute code expiration** for security
- ✅ **Rate limiting** (3 requests per 5 minutes per email)
- ✅ **JWT tokens** with 7-day expiration
- ✅ **HttpOnly cookies** for secure token storage
- ✅ **Route protection** for authenticated pages
- ✅ **Auto-user creation** on first login
- ✅ **Mock mode** for development without email API

## 📋 Quick Start

### 1. Set Up Environment Variables

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

Configure the following variables:

```env
# Required: Database connection
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Required: JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secure-random-string

# Optional: Resend API key (if not set, codes print to console)
RESEND_API_KEY=re_xxxxxxxxxx
```

### 2. Run Database Migrations

Generate and apply migrations for auth tables:

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

Visit `http://localhost:5173` - you'll be redirected to `/auth/login`

## 🔧 Configuration

### Resend.com Setup (Optional for Production)

1. Sign up at [https://resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add your domain for sending emails
4. Add `RESEND_API_KEY` to your environment variables

**For development:** If `RESEND_API_KEY` is not set, authentication codes will be logged to the console instead of being emailed.

### JWT Secret Generation

Generate a secure JWT secret:

```bash
openssl rand -base64 32
```

Add this to your `.env.local` as `JWT_SECRET`.

### Vercel Environment Variables

For production deployment on Vercel, add these environment variables:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - `DATABASE_URL` or `PROD_DATABASE_URL` (Production scope)
   - `JWT_SECRET` (Production scope)
   - `RESEND_API_KEY` (Production scope)
   - `NODE_ENV=production` (Production scope)

## 🏗️ Architecture

### Backend (Vercel Serverless Functions)

Located in `/api/auth/`:

- **`request-code.ts`** - Sends verification code via email
  - Rate limiting (3 requests per 5 minutes)
  - Auto-creates user if doesn't exist
  - Stores code in database with 10-minute expiration

- **`verify-code.ts`** - Verifies code and creates session
  - Validates code against database
  - Marks code as used (one-time use)
  - Generates JWT token
  - Sets HttpOnly cookie

- **`me.ts`** - Returns current authenticated user
  - Verifies JWT token from cookie
  - Returns user information

- **`logout.ts`** - Clears authentication session
  - Expires the auth cookie

### Frontend Components

#### Auth Context (`src/contexts/AuthContext.tsx`)
Provides global authentication state and methods:
```typescript
const { user, isLoading, isAuthenticated, login, logout, requestCode } = useAuth();
```

#### Auth Pages
- **`/auth/login`** - Email entry page
- **`/auth/verify`** - 6-digit code verification page

#### Protected Routes
Wrap routes with `ProtectedRoute` component:
```tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <Index />
    </ProtectedRoute>
  }
/>
```

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
- **Zod schema validation** for all inputs
- **Email format validation**
- **Code length validation** (exactly 6 digits)

## 📝 Customization

### Change Email Template

Edit `src/lib/auth/email.ts` to customize the email design:

```typescript
await resend.emails.send({
  from: 'Your App <auth@yourdomain.com>',
  subject: 'Your custom subject',
  html: `...your custom HTML...`,
});
```

### Adjust Token Expiration

Edit `src/lib/auth/jwt.ts`:

```typescript
return jwt.sign(payload, JWT_SECRET, {
  expiresIn: '14d', // Change from 7d to 14d
  // ...
});
```

### Modify Rate Limits

Edit `api/auth/request-code.ts`:

```typescript
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5; // 5 requests per window
```

### Change Code Expiration

Edit `api/auth/request-code.ts`:

```typescript
const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
```

## 🧪 Testing

### Development Mode (Without Resend)

1. Leave `RESEND_API_KEY` unset in `.env.local`
2. Start the dev server
3. Request a code at `/auth/login`
4. Check the console for the code:

```
============================================================
📧 MOCK EMAIL MODE - No RESEND_API_KEY configured
============================================================
To: user@example.com
Code: 123456
Expires: 10 minutes
============================================================
```

5. Enter the code at `/auth/verify`

### Production Testing

1. Set `RESEND_API_KEY` in environment
2. Request a code - check your email
3. Enter the code to authenticate

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables (see Configuration section)
4. Deploy!

The API routes will automatically work as serverless functions.

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

**Solution:** Verify connection string and run `npm run db:migrate`

### "JWT verification failed"

**Check:**
- Is `JWT_SECRET` the same across all instances?
- Is the cookie being sent with requests?

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

- `src/pages/auth/Login.tsx` - Email entry page
- `src/pages/auth/Verify.tsx` - Code verification page

Both pages match the template's design system and can be easily styled with Mantine's theming system.

## 📖 Further Reading

- [Resend Documentation](https://resend.com/docs)
- [JWT Best Practices](https://jwt.io/introduction)
- [Mantine UI Documentation](https://mantine.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
