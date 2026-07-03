import { useState } from 'react'

const TOKEN_KEY = 'klaaro_token'
const USER_KEY = 'klaaro_user'

export function useAuth() {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem(TOKEN_KEY)
    )

    function saveSession(access_token: string, user: object) {
        localStorage.setItem(TOKEN_KEY, access_token)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        setToken(access_token)
    }

    function clearSession() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
    }

    function getUser() {
        const u = localStorage.getItem(USER_KEY)
        return u ? JSON.parse(u) : null
    }

    function isAuthenticated() {
        return !!token
    }

    return { token, saveSession, clearSession, getUser, isAuthenticated }
}