import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Step1AccountType from '../pages/onboarding/Step1AccountType.tsx'
import Step2Individual from "../pages/onboarding/Step2Individual.tsx";
import Step2Entreprise from "../pages/onboarding/Step2Entreprise.tsx";
import Step3BasicInfo from "../pages/onboarding/Step3BasicInfo.tsx";
import Step4Welcome from "../pages/onboarding/Step4Welcome.tsx";
import DashboardPage from "../pages/dashboard/DashboardPage.tsx";
import UploadPage from "../pages/Upload/UploadPage.tsx";
import LandingPage from "../pages/landing page/LandingPage.tsx";
import LoginPage from "../pages/auth/LoginPage.tsx";
import PredictionsPage from "../pages/Prediction/PredictionPage.tsx";
import PageAnimation from "../components/ui/PageAnimation.tsx";
import Step3EnterpriseInfo from "../pages/onboarding/Step3EntrepriseBasicInfo.tsx";
import SettingsPage from "../pages/setting/SettingsPage.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/welcome" />} />
                <Route path="/welcome" element={<LandingPage />} />

                {/* Authentification */}
                <Route path="/login" element={<LoginPage />} />

                {/* Tunnel d'Onboarding  */}
                <Route path="/onboarding/step1" element={<Step1AccountType />} />
                <Route path="/onboarding/step2/individual" element={<Step2Individual />} />
                <Route path="/onboarding/step2/entreprise" element={<Step2Entreprise />} />
                <Route path="/onboarding/step3" element={<Step3BasicInfo />} />
                <Route path="/onboarding/step4" element={<Step4Welcome />} />
                <Route path="/onboarding/step3.1" element={<Step3EnterpriseInfo />} />

                {/* Application Principale */}
                <Route path="/dashboard" element={<PageAnimation><DashboardPage /></PageAnimation>} />
                <Route path="/upload" element={<PageAnimation><UploadPage /></PageAnimation>} />
                <Route path="/prediction" element={<PageAnimation><PredictionsPage /></PageAnimation>} />
                <Route path="/setting" element={<PageAnimation><SettingsPage /></PageAnimation>} />

            </Routes>
        </BrowserRouter>
    )
}