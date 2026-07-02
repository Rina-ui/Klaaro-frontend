import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Step1AccountType from '../pages/onboarding/Step1AccountType.tsx'
import Step2Individual from "../pages/onboarding/Step2Individual.tsx";
import Step2Entreprise from "../pages/onboarding/Step2Entreprise.tsx";
import Step3BasicInfo from "../pages/onboarding/Step3BasicInfo.tsx";
import Step4Welcome from "../pages/onboarding/Step4Welcome.tsx";
import DashboardPage from "../pages/dashboard/DashboardPage.tsx";
import UploadPage from "../pages/Upload/UploadPage.tsx";
import PredictionsPage from "../pages/Prediction/PredictionPage.tsx";
import LandingPage from "../pages/landing page/LandingPage.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Onboarding */}
                <Route path="/" element={<Navigate to="/onboarding/step1" />} />
                <Route path="/onboarding/step1" element={<Step1AccountType />} />
                <Route path="/onboarding/step2/individual" element={<Step2Individual />} />
                <Route path="/onboarding/step2/entreprise" element={<Step2Entreprise />} />
                <Route path="/onboarding/step3" element={<Step3BasicInfo />} />
                <Route path="/onboarding/step4" element={<Step4Welcome />} />

                <Route path="/welcome" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/prediction" element={<PredictionsPage />} />
            </Routes>
        </BrowserRouter>
    )
}