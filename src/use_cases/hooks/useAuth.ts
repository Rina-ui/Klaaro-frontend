import { useState } from 'react'

const TOKEN_KEY = 'klaaro_token'
const USER_KEY = 'klaaro_user'

export interface UserProfile {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    profession: string;
    role: string;
    account_type: string;
}

export function useAuth() {
    // État pour le token
    const [token, setToken] = useState<string | null>(
        localStorage.getItem(TOKEN_KEY)
    )

    // AJOUT : État pour l'utilisateur pour forcer React à se mettre à jour
    const [user, setUser] = useState<UserProfile | null>(() => {
        const u = localStorage.getItem(USER_KEY)
        return u ? JSON.parse(u) : null
    })

    function saveSession(access_token: string, userProfile: UserProfile) {
        localStorage.setItem(TOKEN_KEY, access_token)
        localStorage.setItem(USER_KEY, JSON.stringify(userProfile))

        // On met à jour les deux états React en même temps
        setToken(access_token)
        setUser(userProfile)
    }

    function clearSession() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
    }

    function isAuthenticated() {
        return !!token
    }

    // On retourne directement la variable 'user'
    return { token, user, saveSession, clearSession, isAuthenticated }
}