// API endpoint to fetch the most recent universal sessions
import { universalSessions, frames } from '../../drizzle/schema'
import { sql, eq, desc, gt, getTableColumns } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const sessionMustHaveAtLeastNFrames = 2

  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 9 // Default to 9 sessions per page
  const page = parseInt(query.page as string) || 1 // Default to first page
  const offset = (page - 1) * limit

  const db = useDrizzle(event)

  console.log("/api/universal-session 1", { limit, page })

  const sessions = await db.select({
      ...getTableColumns(universalSessions),
      lastFrame: getTableColumns(frames),
      numFrames: db.$count(frames, eq(frames.universalSessionID, universalSessions.id)),
    })
    .from(universalSessions)
    .innerJoin(frames, eq(frames.id, db.select({ id: frames.id })
      .from(frames)
      .where(eq(frames.universalSessionID, universalSessions.id))
      .orderBy(desc(frames.createdAt))
      .limit(1)
    ))
    .where((t) => gt(t.numFrames, sessionMustHaveAtLeastNFrames))
    .orderBy(desc(universalSessions.createdAt))
    .limit(limit)
    .offset(offset)

  console.log("/api/universal-session 2", { sessions_length: sessions.length })

  sessions.forEach(session => {
    console.log("/api/universal-session 3", { session_id: session.id, frame_id: session.lastFrame.id })
  })

  return {
    sessions,
    pagination: {
      page,
      limit,
    }
  }
})
