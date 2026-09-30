import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const campusData = sqliteTable('campus_data', {id:text('id').primaryKey(), payload:text('payload').notNull(), version:integer('version').notNull().default(1), updatedAt:text('updated_at').notNull()});
