import { getServerSession } from '#auth'

// Require auth to access all API routes except /api/auth
export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/auth')) {
    return
  }
  
  if (event.path.startsWith('/api/')) {
    const session = await getServerSession(event)
    if (!session) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    
    // Add user info to the event context for use in API handlers
    event.context.auth = { user: session.user }
  }
})
