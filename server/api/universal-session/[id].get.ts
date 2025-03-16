// all sessions are currently public, this is intentional, to permit
// a non-login-required gallery
export default defineEventHandler(async (event) => {
  const universalSessionID = event.context.params?.id
  if (!universalSessionID) throw createError({ statusCode: 400, statusMessage: "Missing universalSessionID" })

  const db = useDrizzle(event)
  const universalSession = await db.query.universalSessions.findFirst({
    where: (universalSession, { eq }) => eq(universalSession.id, universalSessionID),
    with: {
      frames: {
        with: {
          inputMessage: true,
          //outputMessage: true,
        }
      }
    }
  })

  if (!universalSession) throw createError({ statusCode: 404, statusMessage: "Session not found" })

  return universalSession
})
