// API endpoint to fetch the most recent universal sessions
import { universalSessions } from '../../drizzle/schema'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 9 // Default to 9 sessions per page
  const page = parseInt(query.page as string) || 1 // Default to first page
  const offset = (page - 1) * limit

  const db = useDrizzle(event)
  
  // Get total count for pagination
  const result = await db.select({ 
    count: sql`count(*)` 
  }).from(universalSessions)
  const totalCount = Number(result[0].count)
  
  // Get paginated sessions
  const sessions = await db.query.universalSessions.findMany({
    orderBy: (universalSession, { desc }) => [desc(universalSession.createdAt)],
    limit,
    offset,
    with: {
      frames: {
        limit: 1, // Get only one frame for each session
        orderBy: (frame, { desc }) => [desc(frame.createdAt)], // Get the LAST frame
        with: {
          inputMessage: true,
          outputMessage: true,
        }
      }
    }
  })

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit)

  return {
    sessions,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages
    }
  }
})
