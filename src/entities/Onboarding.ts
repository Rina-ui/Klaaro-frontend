// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum AccountType {
    INDIVIDUAL = "individual",
    ENTREPRISE = "entreprise"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum UserProfile {
    STUDENT = "Etudiant",
    DEVELOPER = "Developpeur",
    DATA_SCIENTIST = "Data Scientist",
    FREELANCE = "Freelance",
    ENTREPRENEUR = "Entrepreneur",
    OTHER = "Autre"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum DataLevel {
    BEGINNER = "Debutant",
    INTERMEDIATE = "Intermediaire",
    ADVANCED = "Avance"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum BusinessSector {
    COMMERCE = "Commerce & Distribution",
    RESTAURANT = "Restauration & Food",
    TECH = "Technologie",
    HEALTH = "Sante",
    EDUCATION = "Education",
    FINANCE = "Finance",
    AGRICULTURE = "Agriculture",
    OTHER = "Autre"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum CompanySize {
    SMALL = "1-5 employes",
    MEDIUM = "6-20 employes",
    LARGE = "21-50 employes",
    XLARGE = "50+ employes"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum HearAboutUs {
    WORD_OF_MOUTH = "Bouche a oreille",
    SOCIAL_MEDIA = "Reseaux sociaux",
    GOOGLE = "Google",
    FRIEND = "Un ami me l'a recommande",
    WHATSAPP = "WhatsApp",
    OTHER = "Autre"
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