import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Step1AccountType from '../pages/onboarding/Step1AccountType'
import Step2Individual from '../pages/onboarding/Step2Individual'
import Step2Entreprise from '../pages/onboarding/Step2Entreprise'
import Step3BasicInfo from '../pages/onboarding/Step3BasicInfo'
import Step4Welcome from '../pages/onboarding/Step4Welcome'
import LoginPage from '../pages/auth/LoginPage'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/onboarding/step1" />} />
    <Route path="/onboarding/step1" element={<Step1AccountType />} />
    <Route path="/onboarding/step2/individual" element={<Step2Individual />} />
    <Route path="/onboarding/step2/entreprise" element={<Step2Entreprise />} />
    <Route path="/onboarding/step3" element={<Step3BasicInfo />} />
    <Route path="/onboarding/step4" element={<Step4Welcome />} />
    <Route path="/login" element={<LoginPage />} />
    </Routes>
    </BrowserRouter>
)
}