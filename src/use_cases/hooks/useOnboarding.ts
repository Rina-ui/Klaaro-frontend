import { useState } from 'react'
import type {OnboardingData} from '../../entities/Onboarding'

const initialState: OnboardingData = {
    account_type: null,
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    profession: '',
}

let globalOnboardingData = { ...initialState }

export function useOnboarding() {
    const [data, setData] = useState<OnboardingData>(globalOnboardingData)

    function updateOnboarding(update: Partial<OnboardingData>) {
        globalOnboardingData = { ...globalOnboardingData, ...update }
        setData({ ...globalOnboardingData })
    }

    function resetOnboarding() {
        globalOnboardingData = { ...initialState }
        setData({ ...initialState })
    }

    return { data, updateOnboarding, resetOnboarding }
}