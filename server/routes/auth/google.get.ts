export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user, tokens }) {
    console.warn('Google OAuth success:', user)
    console.warn('Google OAuth tokens:', tokens)
    await setUserSession(event, {
      user: {
        name: user.name,
        email: user.email,
      },
      loggedInAt: new Date().toISOString(),
    })
    return sendRedirect(event, '/')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
