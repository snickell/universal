import { sqliteTable, text, integer, check, SQLiteColumn, index } from "drizzle-orm/sqlite-core"
import { sql, relations } from "drizzle-orm"
import { MessageTypes } from "~/shared/statefulTypes"

// Using ULIDs for IDs, its like uuid but lexicographically sortable: https://github.com/ulid/spec
const ulid = () => text("id", { length: 26 }).notNull()
const validULID = (field: SQLiteColumn) => sql`LENGTH(${field}) = 26`

export const users = sqliteTable("users", {
  id: ulid().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  google_auth_id: text().unique().notNull(),
  createdAt: integer({ mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
}, (table) => [
  index("google_auth_id__users").on(table.google_auth_id),
])

export const universalSessions = sqliteTable("universal_sessions", {
  id: ulid().primaryKey(),
  userID: text().notNull().references(() => users.id),
  createdAt: integer({ mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
}, (table) => [
  check("id__validULID__universal_sessions", validULID(table.id)),
  index("userID__universal_sessions").on(table.userID),
])

export const messages = sqliteTable("messages", {
  id: ulid().primaryKey(),
  type: text().notNull().$type<MessageTypes>(),

  role: text().notNull().$type<"user" | "system">(),
  content: text().notNull(),

  createdAt: integer({ mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
  universalSessionID: text().notNull().references(() => universalSessions.id),
}, (table) => [
  check("id__validULID__messages", validULID(table.id)),
  check("type_matches_role__messages", sql`
    (${table.role} = 'user' AND (${table.type} = 'prompt' OR ${table.type} = 'events')) OR 
    (${table.role} = 'system' AND ${table.type} = 'raw_screen_html')
  `),
  index("universalSessionID__messages").on(table.universalSessionID),
])

export const frames = sqliteTable("frames", {
  id: ulid().primaryKey(),
  modelID: text().notNull(),

  screenHTML: text(), // TODO, implement and make .notNull()
  createdAt: integer({ mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
  
  renderStartTime: integer({ mode: "timestamp_ms" }).notNull(),
  renderEndTime: integer({ mode: "timestamp_ms" }).notNull(),
  renderTimeSecs: integer().notNull(),

  inputMessageID: text().notNull().references(() => messages.id),
  outputMessageID: text().notNull().references(() => messages.id),
  universalSessionID: text().notNull().references(() => universalSessions.id),
  prevFrameID: text(), // TODO: implement
}, (table) => [
  check("id__validULID__frames", validULID(table.id)),
  index("universalSessionID__frames").on(table.universalSessionID),
  index("prevFrameID__frames").on(table.prevFrameID),
])

export const usersRelations = relations(users, ({ many }) => ({
  universalSessions: many(universalSessions),
}))

export const universalSessionsRelations = relations(universalSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [universalSessions.userID],
    references: [users.id],
  }),
  messages: many(messages),
  frames: many(frames),
}))

export const messagesRelations = relations(messages, ({ one, many }) => ({
  universalSession: one(universalSessions, {
    fields: [messages.universalSessionID],
    references: [universalSessions.id],
  }),
  inputFrames: many(frames, {
    relationName: "inputMessageFrames",
  }),
  outputFrames: many(frames, {
    relationName: "outputMessageFrames",
  }),
}))

export const framesRelations = relations(frames, ({ one }) => ({
  universalSession: one(universalSessions, {
    fields: [frames.universalSessionID],
    references: [universalSessions.id],
  }),
  inputMessage: one(messages, {
    fields: [frames.inputMessageID],
    references: [messages.id],
    relationName: "inputMessageFrames",
  }),
  outputMessage: one(messages, {
    fields: [frames.outputMessageID],
    references: [messages.id],
    relationName: "outputMessageFrames",
  }),
  prevFrame: one(frames, {
    fields: [frames.prevFrameID],
    references: [frames.id],
  }),
}))

export type UniversalSession = typeof universalSessions.$inferSelect
export type Frame = typeof frames.$inferSelect

// Message types:
export type Message = typeof messages.$inferSelect
export type InputMessage = Message & { role: "user", type: MessageTypes.Prompt | MessageTypes.Events }
export type OutputMessage = Message & { role: "system", type: MessageTypes.RawScreenHTML }
