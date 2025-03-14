import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { drizzle as drizzleLibSQL} from 'drizzle-orm/libsql'

import { H3Event, EventHandlerRequest } from 'h3'

import { getDurableObject } from '@/server/plugins/cache-durable-object'

export * as schema from '../drizzle/schema'
export * as sql from 'drizzle-orm/sql'

export function useDrizzle(event?: H3Event<EventHandlerRequest>) {
  if (event?.context?.cloudflare?.env?.DB) {
    // we're in a cloudflare worker
    return drizzleD1(event.context.cloudflare.env.DB)
  } else if (getDurableObject()?.env?.DB) {
    // we're on a cloudflare durable object, in a websocket handler
    return drizzleD1(getDurableObject().env.DB)
  } else {
    // we're running locally in dev
    return drizzleLibSQL(process.env.DB_FILE_NAME!)
  }
}

//export type User = typeof schema.users.$inferSelect

/* Example of using:

export default eventHandler(async (event) => {
  return await useDrizzle(event).select().from(schema.users).all()
})

*/
