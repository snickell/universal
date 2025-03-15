export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        name: user.name,
        email: user.email,
        // google says to use the "sub" field (a huge string of numbers) as the unique identifier
        // see: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
        google_auth_id: user.sub,
        google: { user, tokens }
      },
      loggedInAt: new Date().toISOString(),
    })
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
