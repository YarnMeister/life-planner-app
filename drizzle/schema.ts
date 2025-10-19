import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Minimal placeholder schema for template consumers to extend
export const appExample = pgTable('app_example', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
