/**
 * Database client exports.
 *
 * Drizzle ORM is the database layer.
 */

// Re-export Drizzle client and utilities from @breeze/db
export { getDb, resetDb, type Database } from "@breeze/db";

// Re-export common Drizzle utilities
export {
	eq,
	ne,
	gt,
	gte,
	lt,
	lte,
	and,
	or,
	not,
	inArray,
	notInArray,
	isNull,
	isNotNull,
	sql,
	desc,
	asc,
} from "@breeze/db";
export type { InferSelectModel, SQL } from "@breeze/db";

// Re-export schema
export * from "@breeze/db/schema";
