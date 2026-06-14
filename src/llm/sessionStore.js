/**
 * Session Store — In-memory persistence layer
 * Keyed by sessionId for multi-session support.
 * Structured for easy swap to Redis/DB — change only this file.
 * @module sessionStore
 */

/**
 * @typedef {Object} SessionData
 * @property {string} sessionId
 * @property {Object[]} scores - Array of scorecard results
 * @property {Object[]} intakeSnapshots - Array of intake submissions
 * @property {Object} metadata
 * @property {string} metadata.createdAt - ISO timestamp
 * @property {string} metadata.lastUpdated - ISO timestamp
 */

/**
 * Creates a new session store instance.
 * Uses Map internally — replace with Redis client for production.
 * @returns {Object} Store interface
 */
export function createSessionStore() {
  /** @type {Map<string, SessionData>} */
  const store = new Map()

  return {
    /**
     * Get full session data by ID
     * @param {string} sessionId
     * @returns {SessionData|null}
     */
    get(sessionId) {
      return store.get(sessionId) || null
    },

    /**
     * Set/overwrite session data
     * @param {string} sessionId
     * @param {Partial<SessionData>} data
     */
    set(sessionId, data) {
      const existing = store.get(sessionId)
      const now = new Date().toISOString()

      if (existing) {
        store.set(sessionId, {
          ...existing,
          ...data,
          metadata: {
            ...existing.metadata,
            lastUpdated: now,
          },
        })
      } else {
        store.set(sessionId, {
          sessionId,
          scores: [],
          intakeSnapshots: [],
          ...data,
          metadata: {
            createdAt: now,
            lastUpdated: now,
          },
        })
      }
    },

    /**
     * Append a scorecard to session history
     * @param {string} sessionId
     * @param {Object} scorecard
     */
    addScore(sessionId, scorecard) {
      const session = store.get(sessionId)
      const now = new Date().toISOString()

      if (session) {
        session.scores.push(scorecard)
        session.metadata.lastUpdated = now
      } else {
        store.set(sessionId, {
          sessionId,
          scores: [scorecard],
          intakeSnapshots: [],
          metadata: {
            createdAt: now,
            lastUpdated: now,
          },
        })
      }
    },

    /**
     * Get scoring history for a session
     * @param {string} sessionId
     * @returns {Object[]}
     */
    getHistory(sessionId) {
      const session = store.get(sessionId)
      return session ? session.scores : []
    },

    /**
     * Get the most recent scorecard (useful for cache fallback)
     * @param {string} sessionId
     * @returns {Object|null}
     */
    getLatest(sessionId) {
      const session = store.get(sessionId)
      if (!session || session.scores.length === 0) return null
      return session.scores[session.scores.length - 1]
    },

    /**
     * Clear all data for a session
     * @param {string} sessionId
     */
    clear(sessionId) {
      store.delete(sessionId)
    },

    /**
     * Get total number of active sessions (monitoring)
     * @returns {number}
     */
    size() {
      return store.size
    },
  }
}

export default createSessionStore
