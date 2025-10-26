module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/new-app-template/drizzle/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appExample",
    ()=>appExample,
    "authCodes",
    ()=>authCodes,
    "failedAuthAttempts",
    ()=>failedAuthAttempts,
    "users",
    ()=>users
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/drizzle-orm/pg-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/drizzle-orm/pg-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/drizzle-orm/pg-core/columns/uuid.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/drizzle-orm/pg-core/columns/boolean.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/drizzle-orm/pg-core/indexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
;
;
const appExample = (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('app_example', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').primaryKey().defaultRandom(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('name').notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').defaultNow()
});
const users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('users', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('email').notNull().unique(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').notNull().default(__TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`now()`),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').notNull().default(__TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`now()`)
}, (table)=>({
        emailIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('users_email_idx').on(table.email)
    }));
const authCodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('auth_codes', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('email').notNull(),
    code: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('code').notNull(),
    ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('ip_address'),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('expires_at').notNull(),
    used: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])('used').notNull().default(false),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').notNull().default(__TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`now()`)
}, (table)=>({
        // Composite indexes for efficient rate-limit queries
        emailCreatedIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('auth_codes_email_created_idx').on(table.email, table.createdAt),
        ipCreatedIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('auth_codes_ip_created_idx').on(table.ipAddress, table.createdAt)
    }));
const failedAuthAttempts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('failed_auth_attempts', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('email').notNull(),
    ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('ip_address').notNull(),
    attemptedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('attempted_at').notNull().default(__TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`now()`)
}, (table)=>({
        emailAttemptedIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('failed_attempts_email_attempted_idx').on(table.email, table.attemptedAt),
        ipAttemptedIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('failed_attempts_ip_attempted_idx').on(table.ipAddress, table.attemptedAt)
    }));
}),
"[project]/new-app-template/src/lib/env.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clientEnv",
    ()=>clientEnv,
    "getDevBypassCode",
    ()=>getDevBypassCode,
    "getDevTestEmail",
    ()=>getDevTestEmail,
    "isDevBypassEnabled",
    ()=>isDevBypassEnabled,
    "serverEnv",
    ()=>serverEnv
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
/**
 * Server-side environment variables schema
 * These variables should NEVER be exposed to the client
 */ const serverSchema = __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    // Database
    DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().min(1, 'DATABASE_URL is required'),
    // JWT
    JWT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(32, 'JWT_SECRET must be at least 32 characters'),
    // Email (Resend) - Optional in dev/test with bypass
    RESEND_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    FROM_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email('FROM_EMAIL must be a valid email').default('noreply@example.com'),
    // Development/Test Bypass (NEVER use in production)
    DEV_BYPASS_CODE: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    DEV_TEST_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional(),
    // Auth configuration (optional with defaults)
    AUTH_RATE_LIMIT_WINDOW_MS: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('300000'),
    AUTH_RATE_LIMIT_MAX: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('3'),
    AUTH_CODE_TTL_MINUTES: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('10'),
    // Node environment
    NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'development',
        'production',
        'test'
    ]).default('development'),
    // Vercel (optional)
    VERCEL_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'production',
        'preview',
        'development'
    ]).optional(),
    PROD_DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional(),
    POSTGRES_URL: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional(),
    VERCEL_POSTGRES_URL: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional()
}).refine((data)=>{
    // In production, RESEND_API_KEY is required
    if (data.NODE_ENV === 'production' && !data.RESEND_API_KEY) {
        return false;
    }
    // DEV_BYPASS_CODE should NEVER be used in production
    if (data.NODE_ENV === 'production' && data.DEV_BYPASS_CODE) {
        throw new Error('DEV_BYPASS_CODE must not be set in production!');
    }
    return true;
}, {
    message: 'RESEND_API_KEY is required in production'
});
/**
 * Client-side environment variables schema
 * These variables are prefixed with NEXT_PUBLIC_ and safe to expose
 */ const clientSchema = __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
});
const serverEnv = serverSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL || process.env.PROD_DATABASE_URL || process.env.POSTGRES_URL || process.env.VERCEL_POSTGRES_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
    DEV_BYPASS_CODE: process.env.DEV_BYPASS_CODE,
    DEV_TEST_EMAIL: process.env.DEV_TEST_EMAIL,
    AUTH_RATE_LIMIT_WINDOW_MS: process.env.AUTH_RATE_LIMIT_WINDOW_MS,
    AUTH_RATE_LIMIT_MAX: process.env.AUTH_RATE_LIMIT_MAX,
    AUTH_CODE_TTL_MINUTES: process.env.AUTH_CODE_TTL_MINUTES,
    NODE_ENV: ("TURBOPACK compile-time value", "development"),
    VERCEL_ENV: process.env.VERCEL_ENV,
    PROD_DATABASE_URL: process.env.PROD_DATABASE_URL,
    POSTGRES_URL: process.env.POSTGRES_URL,
    VERCEL_POSTGRES_URL: process.env.VERCEL_POSTGRES_URL
});
function isDevBypassEnabled() {
    return (serverEnv.NODE_ENV === 'development' || serverEnv.NODE_ENV === 'test') && !!serverEnv.DEV_BYPASS_CODE;
}
function getDevBypassCode() {
    return isDevBypassEnabled() ? serverEnv.DEV_BYPASS_CODE : null;
}
function getDevTestEmail() {
    return isDevBypassEnabled() && serverEnv.DEV_TEST_EMAIL ? serverEnv.DEV_TEST_EMAIL : null;
}
const clientEnv = clientSchema.parse({
});
}),
"[project]/new-app-template/src/lib/auth/db.server.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Server-only database module for Next.js
 * This file must NEVER be imported in client components
 */ __turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$neon$2d$http$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/drizzle-orm/neon-http/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$drizzle$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/drizzle/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/src/lib/env.ts [app-route] (ecmascript)");
;
;
;
;
;
// Use validated env from centralized config
const DATABASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serverEnv"].DATABASE_URL;
// Create Neon serverless connection with WebSocket support for multi-statement SQL
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(DATABASE_URL, {
    // Neon serverless driver handles connection pooling automatically
    fetchOptions: {
    }
});
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$neon$2d$http$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"])(sql);
;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/new-app-template/src/lib/auth/jwt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateAuthCode",
    ()=>generateAuthCode,
    "hashAuthCode",
    ()=>hashAuthCode,
    "signToken",
    ()=>signToken,
    "verifyAuthCode",
    ()=>verifyAuthCode,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
function signToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: '7d',
        issuer: 'app-template',
        audience: 'app-template-users'
    });
}
function verifyToken(token) {
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET, {
            issuer: 'app-template',
            audience: 'app-template-users'
        });
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}
function generateAuthCode() {
    // Use crypto.randomInt for secure random generation (0-999,999)
    const code = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomInt(0, 1_000_000);
    // Pad with leading zeros to ensure 6 digits
    return code.toString().padStart(6, '0');
}
function hashAuthCode(code, email) {
    const hmac = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac('sha256', JWT_SECRET);
    hmac.update(`${code}:${email}`);
    return hmac.digest('hex');
}
function verifyAuthCode(code, email, hash) {
    const computedHash = hashAuthCode(code, email);
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
}
}),
"[project]/new-app-template/app/api/auth/me/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$src$2f$lib$2f$auth$2f$db$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/new-app-template/src/lib/auth/db.server.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$drizzle$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/drizzle/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$src$2f$lib$2f$auth$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/new-app-template/src/lib/auth/jwt.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET(req) {
    try {
        // Get token from cookies
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const token = cookieStore.get('auth-token')?.value;
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Not authenticated'
            }, {
                status: 401
            });
        }
        // Verify JWT token
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$src$2f$lib$2f$auth$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        if (!payload) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid token'
            }, {
                status: 401
            });
        }
        // Get current user from database
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$src$2f$lib$2f$auth$2f$db$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$drizzle$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].id,
            email: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$drizzle$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].email,
            createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$drizzle$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].createdAt,
            updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$drizzle$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].updatedAt
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$drizzle$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$drizzle$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].id, payload.userId)).limit(1);
        if (user.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User not found'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            user: user[0]
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$new$2d$app$2d$template$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to get user information'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4a08aa17._.js.map