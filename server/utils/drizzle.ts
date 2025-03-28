import { ulid } from '~/shared/ulid'
export { ulid } from '~/shared/ulid'

import { drizzle as drizzleD1, DrizzleD1Database } from 'drizzle-orm/d1'
import { drizzle as drizzleLibSQL, LibSQLDatabase } from 'drizzle-orm/libsql'

import { H3Event, EventHandlerRequest } from 'h3'

import { getDurableObject } from '@/server/plugins/cache-durable-object'

import { User, UniversalSession, Frame } from '~/shared/statefulTypes'

import * as schema from '../drizzle/schema'
export * as schema from '../drizzle/schema'
import * as sql from 'drizzle-orm/sql'
export * as sql from 'drizzle-orm/sql'

// TODO: technically, our type can be either of these, but including the union appears
// to be confusing VSCode, and making a mess of using TS
type DrizzleDB = LibSQLDatabase<typeof schema> // | DrizzleD1Database<typeof schema>

export function useDrizzle(event?: H3Event<EventHandlerRequest>): DrizzleDB {
  if (event?.context?.cloudflare?.env?.DB) {
    // we're in a cloudflare worker
    return drizzleD1(event.context.cloudflare.env.DB, {schema})
  } else if (getDurableObject()?.env?.DB) {
    // we're on a cloudflare durable object, in a websocket handler
    return drizzleD1(getDurableObject().env.DB, {schema})
  } else {
    // we're running locally in dev
    return drizzleLibSQL(process.env.DB_FILE_NAME!, {schema, logger: true})
  }
}

// TODO: return a User from statefulTypes instance instead of a plain object, see statefulTypes.ts
export async function selectOrCreateUser(db: DrizzleDB, { google_auth_id, name, email }: { google_auth_id: string, name: string, email: string }): Promise<User> {  
  // Try to find existing user
  const existingUsers = await db
    .select()
    .from(schema.users)
    .where(sql.eq(schema.users.google_auth_id, google_auth_id))
    .limit(1)
  
  if (existingUsers.length > 0) {
    return new User(existingUsers[0])
  }
  
  // User doesn't exist, create new one  
  const newUser = await db.insert(schema.users).values({
    id: ulid(),
    google_auth_id,
    name,
    email
  }).returning()
  
  return new User(newUser[0])
}

// const session = selectOrCreateSession(db, {universalSesssionID, user})
export async function selectOrCreateUniversalSession(db: DrizzleDB, { universalSesssionID, user }: { universalSesssionID: string, user: User }): Promise<UniversalSession> {
  if (universalSesssionID) {
    // Try to find existing session
    const existingSessions = await db
      .select()
      .from(schema.universalSessions)
      .where(sql.eq(schema.universalSessions.id, universalSesssionID))
      .limit(1)
    
    if (existingSessions.length > 0) {
      if (existingSessions[0].userID === user.id) {
        return new UniversalSession(existingSessions[0])
      } else {
        // FIXME / TODO: the user is trying to access somebody else's session, that's
        // totally allowed because session's are public, but we need to first ensure
        // the access is read-only. Read? Yes. Write? No.
        throw new Error('TODO: session does not belong to user, allow access without write permissions')
      }
    }
  }
  
  // Session doesn't exist, create new one  
  const newSession = await db.insert(schema.universalSessions).values({
    id: ulid(),
    userID: user.id
  }).returning()
  
  return new UniversalSession(newSession[0])
}

// TODO: implement:
// await insertFrame(db, {frame, universalSession})
export async function insertFrame(db: DrizzleDB, { frame, universalSession }: { frame: Frame, universalSession: UniversalSession }) {
  if (frame.universalSesssionID !== universalSession.id) {
    throw new Error('insertFrame(): frame.universalSesssionID does not match universalSession.id')
  }

  // TODO: use schema.messages to insert frame.inputMessage and frame.outputMessage
  const newInputMessage = await db.insert(schema.messages).values({
    ...frame.inputMessage,
    universalSessionID: frame.universalSesssionID
  }).returning().get()
  if (!newInputMessage?.id) throw new Error('insertFrame(): failed to create new inputMessage')

  const newOutputMessage = await db.insert(schema.messages).values({
    ...frame.outputMessage,
    universalSessionID: frame.universalSesssionID
  }).returning().get()
  if (!newOutputMessage?.id) throw new Error('insertFrame(): failed to create new outputMessage')

  const newFrame = await db.insert(schema.frames).values({
    universalSessionID: universalSession.id,
    inputMessageID: newInputMessage.id,
    outputMessageID: newOutputMessage.id,
    ...frame
  }).returning().get()
  if (!newFrame?.id) throw new Error('insertFrame(): failed to create new frame')
}