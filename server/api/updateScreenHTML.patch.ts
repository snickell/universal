export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const { frameID, screenHTML } = await readBody(event)

  const db = useDrizzle(event)

  const userSession = await requireUserSession(event)
  const { name, email, google_auth_id} = userSession.user as any
  const user = await selectOrCreateUser(db, {google_auth_id, name, email})

  // verify the frame ID is correct, and its owned by the user
  const frame = await db.query.frames.findFirst({
    columns: { id: true, universalSessionID: true },
    where: (frame, {eq}) => eq(frame.id, frameID),
  })
  if (!frame) throw new Error(`frame ${frameID} not found`)

  const universalSession = await db.query.universalSessions.findFirst({
    where: (session, {eq}) => eq(session.id, frame.universalSessionID),
  })
  if (!universalSession) throw new Error(`universalSession ${frame.universalSessionID} not found`)
  if (universalSession.userID !== user.id) throw new Error(`frame ${frameID} not owned by user ${user.id}`)

  const updatedRows = await db.update(schema.frames).set({screenHTML}).where(sql.eq(schema.frames.id, frameID))
  if (updatedRows.rowsAffected !== 1) throw new Error(`expected to update 1 row, but updated ${updatedRows} rows`)

  console.log(`updateScreenHTML: updated ${frameID} with ~${(screenHTML.length / 1024).toFixed(1)}kb of materialized screenHTML`)

  return '👍'
})
