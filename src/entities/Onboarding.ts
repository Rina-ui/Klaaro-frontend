// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum AccountType {
    INDIVIDUAL = "INDIVIDUAL",
    ENTREPRISE = "ENTREPRISE"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum UserProfile {
    STUDENT = "STUDENT",
    DEVELOPER = "DEVELOPER",
    DATA_SCIENTIST = "DATA_SCIENTIST",
    FREELANCE = "FREELANCE",
    ENTREPRENEUR = "ENTREPRENEUR",
    OTHER = "OTHER"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum DataLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum BusinessSector {
    COMMERCE = "COMMERCE",
    RESTAURANT = "RESTAURANT",
    TECH = "TECH",
    HEALTH = "HEALTH",
    EDUCATION = "EDUCATION",
    FINANCE = "FINANCE",
    AGRICULTURE = "AGRICULTURE",
    OTHER = "OTHER"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum CompanySize {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE",
    XLARGE = "XLARGE"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum HearAboutUs {
    WORD_OF_MOUTH = "WORD_OF_MOUTH",
    SOCIAL_MEDIA = "SOCIAL_MEDIA",
    GOOGLE = "GOOGLE",
    FRIEND = "FRIEND",
    WHATSAPP = "WHATSAPP",
    OTHER = "OTHER"
}

export interface OnboardingData {
    account_type: AccountType | null
    // Individual
    profile?: UserProfile | null
    objectives?: string[]
    data_level?: DataLevel | null
    // Entreprise
    sector?: BusinessSector | null
    company_size?: CompanySize | null
    hear_about_us?: HearAboutUs | null
    // Common
    firstname: string
    lastname: string
    email: string
    password: string
    profession: string
}