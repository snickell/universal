/**
 * Registry of send backends for The Universal Program.
 *
 * A send backend is an async function with this signature:
 *   async function sendMessage({ msg, initialPromptName, receiveFrame, receiveScreenHTMLDelta, onError })
 *
 * Built-in backends: 'websocket' and 'http'
 * The active backend is controlled by USE_WEB_SOCKET in shared/utils/constants.js,
 * or can be overridden at runtime via setActiveSendBackend().
 *
 * To add a custom backend without forking, create a Nuxt client plugin, e.g.
 * plugins/my-send-backend.client.js, and call registerSendBackend/setActiveSendBackend there.
 * See plugins/custom-send-backend.client.js.example for a full working example.
 */

const backends = new Map()
let activeSendBackendName = null

/**
 * Register a named send backend.
 * @param {string} name - Unique name for this backend (e.g. 'my-backend')
 * @param {Function} fn  - async ({ msg, initialPromptName, receiveFrame, receiveScreenHTMLDelta, onError }) => void
 */
export function registerSendBackend(name, fn) {
  backends.set(name, fn)
}

/**
 * Override the active send backend at runtime.
 * Call this after registering your backend with registerSendBackend().
 * @param {string} name - The name passed to registerSendBackend()
 */
export function setActiveSendBackend(name) {
  activeSendBackendName = name
}

/**
 * Return the currently active backend name, or null if using the default
 * (determined by USE_WEB_SOCKET in constants).
 * @returns {string|null}
 */
export function getActiveSendBackendName() {
  return activeSendBackendName
}

/**
 * Retrieve a registered send backend by name.
 * Throws if the name is not found.
 * @param {string} name
 * @returns {Function}
 */
export function getSendBackend(name) {
  const backend = backends.get(name)
  if (!backend) {
    const available = [...backends.keys()].join(', ')
    throw new Error(
      `Unknown send backend: "${name}". Available backends: ${available || '(none registered)'}`
    )
  }
  return backend
}
