export interface User {
    id: string
    firstname: string
    lastname: string
    email: string
    profession: string
    role: string
    account_type: AccountType
    entreprise_id?: string
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum AccountType {
    INDIVIDUAL = "individual",
    ENTREPRISE = "entreprise"
}

export interface LoginResponse {
    access_token: string
    token_type: string
    user: User
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    firstname: string
    lastname: string
    email: string
    password: string
    profession: string
    role: string
    account_type: AccountType
}