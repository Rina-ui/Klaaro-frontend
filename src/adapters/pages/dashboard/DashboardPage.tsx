import { Search, Bell, AlertTriangle, TrendingUp, MessageCircle } from 'lucide-react'
import Sidebar from '../../components/ui/Sidebar'
import {colors} from "../../../styles/token.ts";

const alerts = [
  { label: 'Anomalie transaction', trend: 'Critique', positive: false },
  { label: 'Ventes en hausse', trend: '+12%', positive: true },
]

export default function DashboardPage() {
  return (
      <div style={{ backgroundColor: colors.background }} className="h-screen p-3 overflow-hidden">
        <div style={{ backgroundColor: colors.surfaceContainerLow }} className="mx-auto max-w-[1100px] h-full rounded-3xl p-3 flex gap-3">

          <Sidebar />

          <main className="flex-1 flex flex-col gap-2.5 min-w-0">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 style={{ color: colors.onSurface }} className="text-base font-medium">Bonjour, Koffi</h1>
                <p style={{ color: colors.onSurfaceVariant }} className="text-[11px]">État de votre business aujourd'hui</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div style={{ backgroundColor: colors.surfaceContainer }} className="rounded-full px-3 py-1 flex items-center gap-1.5 w-28">
                  <Search className="h-3 w-3" style={{ color: colors.onSurfaceVariant }} />
                  <span style={{ color: colors.onSurfaceVariant }} className="text-[11px]">Rechercher...</span>
                </div>
                <button style={{ backgroundColor: colors.surfaceContainer }} className="h-6.5 w-6.5 rounded-full flex items-center justify-center">
                  <Bell className="h-3 w-3" style={{ color: colors.onSurfaceVariant }} />
                </button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-2">
              <div style={{ backgroundColor: colors.surfaceContainer }} className="rounded-xl p-2.5">
                <div style={{ color: colors.onSurfaceVariant }} className="text-[10px]">Score de santé</div>
                <div style={{ color: colors.onSurface }} className="text-lg font-medium mt-0.5">78<span className="text-[11px] font-normal">/100</span></div>
              </div>
              <div style={{ backgroundColor: colors.surfaceContainer }} className="rounded-xl p-2.5">
                <div className="flex items-center gap-1.5">
                  <div style={{ backgroundColor: colors.errorContainer }} className="h-5.5 w-5.5 rounded-full flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-2.5 w-2.5" style={{ color: colors.error }} />
                  </div>
                  <div style={{ color: colors.onSurfaceVariant }} className="text-[10px]">Anomalies</div>
                </div>
                <div style={{ color: colors.onSurface }} className="text-lg font-medium mt-1">2</div>
              </div>
              <div style={{ backgroundColor: colors.surfaceContainer }} className="rounded-xl p-2.5">
                <div className="flex items-center gap-1.5">
                  <div style={{ backgroundColor: colors.primaryFixed }} className="h-5.5 w-5.5 rounded-full flex items-center justify-center shrink-0">
                    <TrendingUp className="h-2.5 w-2.5" style={{ color: colors.primary }} />
                  </div>
                  <div style={{ color: colors.onSurfaceVariant }} className="text-[10px]">Prédiction J+7</div>
                </div>
                <div style={{ color: colors.onSurface }} className="text-base font-medium mt-1">185k</div>
              </div>
              <div style={{ backgroundColor: colors.primary }} className="rounded-xl p-2.5 text-white">
                <div className="text-[10px] opacity-70">Score sécurité</div>
                <div className="text-lg font-medium mt-0.5">64%</div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-2 min-h-0">
              <div style={{ backgroundColor: colors.surfaceContainer }} className="rounded-xl p-3 min-w-0">
                <div className="flex items-center justify-between">
                  <span style={{ color: colors.onSurface }} className="text-sm font-medium">Évolution ventes</span>
                  <span style={{ color: colors.onSurfaceVariant }} className="text-[10px]">30 jours</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  <div style={{ backgroundColor: colors.surfaceContainerLow }} className="rounded-lg px-2 py-1.5">
                    <div style={{ color: colors.onSurfaceVariant }} className="text-[9px]">Ce mois</div>
                    <div style={{ color: colors.onSurface }} className="text-xs font-medium">450k <span style={{ backgroundColor: colors.primaryFixed, color: colors.primary }} className="text-[9px] rounded-full px-1">+12%</span></div>
                  </div>
                  <div style={{ backgroundColor: colors.surfaceContainerLow }} className="rounded-lg px-2 py-1.5">
                    <div style={{ color: colors.onSurfaceVariant }} className="text-[9px]">Panier moyen</div>
                    <div style={{ color: colors.onSurface }} className="text-xs font-medium">8500 <span style={{ backgroundColor: colors.errorContainer, color: colors.error }} className="text-[9px] rounded-full px-1">-5%</span></div>
                  </div>
                </div>
                <svg viewBox="0 0 260 40" className="w-full h-8 mt-1.5">
                  <path d="M0,28 C20,30 25,18 40,20 C55,22 50,30 65,28 C80,26 75,10 90,11 C105,12 100,28 115,26 C130,24 125,14 140,15 C155,16 152,8 167,9 C182,10 180,18 195,18 C210,18 215,14 230,13 C245,12 250,14 260,14" fill="none" stroke={colors.primary} strokeWidth="2" />
                </svg>
              </div>

              <div style={{ backgroundColor: colors.surfaceContainer }} className="rounded-xl p-3 flex flex-col items-center">
                <span style={{ color: colors.onSurface }} className="text-sm font-medium self-start">Sécurité</span>
                <svg viewBox="0 0 100 56" className="w-16 h-9 mt-1">
                  <path d="M10,50 A40,40 0 0 1 90,50" fill="none" stroke={colors.surfaceContainerHighest} strokeWidth="8" strokeLinecap="round" />
                  <path d="M10,50 A40,40 0 0 1 70,16" fill="none" stroke={colors.accent} strokeWidth="8" strokeLinecap="round" />
                </svg>
                <span style={{ color: colors.onSurface }} className="text-sm font-medium mt-0.5">64%</span>
              </div>

              <div style={{ backgroundColor: colors.surfaceContainer }} className="rounded-xl p-3 flex flex-col items-center text-center">
                <div style={{ backgroundColor: colors.primaryDark }} className="h-7.5 w-7.5 rounded-full flex items-center justify-center text-white text-xs font-medium">K</div>
                <span style={{ color: colors.onSurface }} className="text-xs font-medium mt-1.5">Koffi Mensah</span>
                <div className="grid grid-cols-2 gap-2 mt-1.5 text-[9px] w-full" style={{ color: colors.onSurfaceVariant }}>
                  <div>Datasets<div style={{ color: colors.onSurface }} className="text-xs font-medium">4</div></div>
                  <div>Alertes<div style={{ color: colors.onSurface }} className="text-xs font-medium">2</div></div>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
              <div style={{ backgroundColor: colors.surfaceContainer }} className="rounded-xl p-3">
                <span style={{ color: colors.onSurface }} className="text-sm font-medium">Alertes</span>
                <div className="flex flex-col gap-1.5 mt-1.5">
                  {alerts.map((a, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div style={{ backgroundColor: a.positive ? colors.accent : colors.error }} className="w-0.5 h-4" />
                          <span style={{ color: colors.onSurface }} className="text-[10px]">{a.label}</span>
                        </div>
                        <span style={{
                          backgroundColor: a.positive ? colors.primaryFixed : colors.errorContainer,
                          color: a.positive ? colors.primary : colors.error
                        }} className="text-[9px] rounded-full px-1.5 py-0.5">{a.trend}</span>
                      </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: colors.surfaceContainer }} className="rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <MessageCircle className="h-4.5 w-4.5" style={{ color: colors.primary }} />
                <span style={{ color: colors.onSurface }} className="text-xs font-medium mt-1">Discutez avec vos données</span>
                <button style={{ backgroundColor: colors.primary }} className="mt-1.5 text-white text-[11px] rounded-lg px-4 py-1.5">
                  Poser une question
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}