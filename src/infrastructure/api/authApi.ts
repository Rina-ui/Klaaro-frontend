import {API_BASE_URL} from "../../config/api.ts";

const BASE_URL = import.meta.env.VITE_API_URL || `${API_BASE_URL}`

export interface RegisterPayload {
    firstname: string
    lastname: string
    email: string
    password: string
    profession: string
    role: string
    account_type: 'INDIVIDUAL' | 'ENTREPRISE';
    entreprise_id?: string
}

export interface LoginResponse {
    access_token: string
    token_type: string
    user: {
        id: string
        firstname: string
        lastname: string
        email: string
        profession: string
        role: string
        account_type: string
    }
}

export interface EnterprisePayload {
    name: string
    email: string
    number: string
    location: string
}

export async function registerUser(payload: RegisterPayload): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Erreur lors de l\'inscription')
    }
    return response.json()
}

export async function createEnterprise(payload: EnterprisePayload): Promise<never> {
    const token = localStorage.getItem('klaaro_token')

    const response = await fetch(`${BASE_URL}/entreprises/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // On passe le JWT récupéré juste avant
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Erreur lors de la création de l\'entreprise')
    }
    // @ts-ignore
    return response.json()
}