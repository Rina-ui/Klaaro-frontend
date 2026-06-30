import React from "react";
import {
  Search,
  Bell,
  MessageCircle,
  LayoutGrid,
  CreditCard,
  BarChart3,
  Users,
  CalendarDays,
  Settings,
  LogOut,
  TrendingUp,
  Fingerprint,
  ShieldCheck,
  ChevronDown,
  CircleDollarSign,
  UserRound,
  Wallet,
} from "lucide-react";

function MiniBars() {
  return (
    <div className="flex items-end gap-2 h-12">
      {[28, 42, 18, 36, 24].map((h, i) => (
        <div
          key={i}
          className="w-2 rounded-full bg-emerald-900/60"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

function CardWave() {
  return (
    <svg viewBox="0 0 220 80" className="w-full h-20">
      <path
        d="M0,50 C15,50 15,35 30,35 C45,35 45,55 60,55 C75,55 75,22 90,22 C105,22 105,52 120,52 C135,52 135,30 150,30 C165,30 165,42 180,42 C195,42 195,38 220,38"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-emerald-900/50"
      />
    </svg>
  );
}

function BalanceWave() {
  return (
    <svg viewBox="0 0 520 190" className="w-full h-48">
      <path
        d="M0,120 C30,135 35,95 55,105 C75,115 70,135 92,130 C114,125 108,70 130,72 C152,74 146,142 170,135 C194,128 186,95 208,100 C230,105 226,72 248,70 C270,68 268,130 292,126 C316,122 308,84 332,86 C356,88 348,60 372,62 C396,64 394,92 416,92 C438,92 444,82 468,80 C492,78 500,82 520,82"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-slate-500/70"
      />
    </svg>
  );
}

function Gauge() {
  return (
    <div className="relative w-44 h-24 mx-auto">
      <svg viewBox="0 0 200 110" className="w-full h-full">
        <path
          d="M20,100 A80,80 0 0 1 180,100"
          fill="none"
          stroke="#d8ddd7"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M20,100 A80,80 0 0 1 165,46"
          fill="none"
          stroke="#5d7f68"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <line x1="100" y1="100" x2="155" y2="55" stroke="#3b4f43" strokeWidth="5" />
      </svg>
      <div className="absolute inset-0 flex items-end justify-center pb-3">
        <span className="text-2xl font-semibold">80%</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#d7d2cb] p-4 md:p-6 text-slate-800">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-[#d1ccc5] shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-4 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-transparent">
              <div className="h-10 w-10 rounded-full border-[6px] border-emerald-900/70 border-t-transparent" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-medium">Hello, Carlic!</h1>
              <p className="text-sm md:text-base text-slate-700">
                Explore information and activity about your property
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full bg-[#e3dfda] px-5 py-3 w-[340px]">
              <Search className="h-5 w-5 text-slate-500" />
              <input
                className="w-full bg-transparent outline-none text-sm placeholder:text-slate-500"
                placeholder="Search..."
              />
              <button className="h-10 w-10 rounded-full bg-[#1f1f1f] flex items-center justify-center text-white">
                <Search className="h-4 w-4" />
              </button>
            </div>
            <button className="h-12 w-12 rounded-full bg-[#e3dfda] flex items-center justify-center relative">
              <MessageCircle className="h-5 w-5" />
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>
            <button className="h-12 w-12 rounded-full bg-[#e3dfda] flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-4">
          <aside className="col-span-12 md:col-span-1">
            <div className="rounded-[28px] bg-[#ece8e2] p-3 flex md:flex-col items-center justify-between md:justify-start gap-3 md:gap-5 min-h-[560px]">
              <button className="h-12 w-12 rounded-full bg-[#1f1f1f] text-white flex items-center justify-center">
                <LayoutGrid className="h-5 w-5" />
              </button>
              <CreditCard className="h-6 w-6 text-slate-600" />
              <BarChart3 className="h-6 w-6 text-slate-600" />
              <CalendarDays className="h-6 w-6 text-slate-600" />
              <Users className="h-6 w-6 text-slate-600" />
              <Wallet className="h-6 w-6 text-slate-600" />
              <div className="flex-1" />
              <Settings className="h-6 w-6 text-slate-600" />
              <LogOut className="h-6 w-6 text-slate-600" />
              <div className="h-11 w-11 rounded-full bg-[#1f1f1f] overflow-hidden border-2 border-[#ece8e2]">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </aside>

          <main className="col-span-12 md:col-span-11">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="rounded-[22px] bg-[#ece8e2] p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-500">Spent this month</p>
                    <div className="mt-2 text-3xl font-semibold">$682.5</div>
                  </div>
                  <MiniBars />
                </div>
              </div>

              <div className="rounded-[22px] bg-[#ece8e2] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#d7dcd6] flex items-center justify-center">
                      <UserRound className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-slate-500">New clients</p>
                      <div className="text-3xl font-semibold">321</div>
                    </div>
                  </div>
                  <div className="w-16 text-slate-400">
                    <CardWave />
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] bg-[#ece8e2] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#e7dfce] flex items-center justify-center">
                      <CircleDollarSign className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-slate-500">Earnings</p>
                      <div className="text-3xl font-semibold">$350.40</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] bg-[#6d8b78] p-5 text-white shadow-sm">
                <p className="text-white/80">Activity</p>
                <div className="mt-2 text-3xl font-semibold">$540.50</div>
                <div className="mt-3 w-24">
                  <CardWave />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
              <section className="xl:col-span-6 rounded-[22px] bg-[#ece8e2] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-semibold">Balance</h2>
                      <span className="text-sm text-emerald-900/80">● On track</span>
                    </div>
                  </div>
                  <button className="text-sm text-slate-500 flex items-center gap-1">
                    Monthly <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/35 p-4">
                    <p className="text-slate-500">Saves</p>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-semibold">43.50%</div>
                      <span className="text-xs text-emerald-900 bg-emerald-100 px-2 py-1 rounded-full">+2.45%</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/35 p-4">
                    <p className="text-slate-500">Balance</p>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-semibold">$52,422</div>
                      <span className="text-xs text-red-900 bg-red-100 px-2 py-1 rounded-full">-4.75%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-slate-600">
                  <BalanceWave />
                </div>
              </section>

              <section className="xl:col-span-3 rounded-[22px] bg-[#ece8e2] p-5 shadow-sm">
                <h2 className="text-2xl font-semibold">Earnings</h2>
                <p className="text-slate-500 mt-1">Total Expense</p>
                <div className="text-3xl font-semibold mt-2">$6078.76</div>
                <p className="text-slate-600 mt-2 text-sm">
                  Profit is 34% more than last month
                </p>
                <div className="mt-4">
                  <Gauge />
                </div>
              </section>

              <section className="xl:col-span-3 rounded-[22px] bg-[#ece8e2] p-5 shadow-sm text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-[#d9d3ca] flex items-center justify-center text-4xl">
                  🙂
                </div>
                <h3 className="mt-4 text-2xl font-semibold">Carlic Bolomboy</h3>
                <p className="text-slate-500">carlic@gmail.com</p>
                <div className="mt-6 grid grid-cols-3 text-sm text-slate-500">
                  <div>
                    <div>Projects</div>
                    <div className="mt-1 text-2xl text-slate-800 font-semibold">26</div>
                  </div>
                  <div>
                    <div>Followers</div>
                    <div className="mt-1 text-2xl text-slate-800 font-semibold">356</div>
                  </div>
                  <div>
                    <div>Following</div>
                    <div className="mt-1 text-2xl text-slate-800 font-semibold">68</div>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
              <section className="xl:col-span-6 rounded-[22px] bg-[#ece8e2] p-5 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">Available Credit</h2>
                    <h2 className="text-2xl font-semibold">Card in Wallet</h2>
                    <p className="mt-4 text-slate-500 max-w-sm">
                      Lorem ipsum dolor sit amet consectetur. Facilisis tincidunt
                      purus id hendrerit cras massa sollicitudin adipiscing.
                    </p>
                    <button className="mt-6 rounded-xl bg-[#6d8b78] px-4 py-3 text-white text-sm">
                      Add New Card +
                    </button>
                  </div>

                  <div className="relative h-[220px]">
                    <div className="absolute right-10 top-2 w-48 h-28 rounded-2xl bg-[#d9ddd7] rotate-[-22deg] shadow-lg" />
                    <div className="absolute right-8 top-10 w-52 h-32 rounded-2xl bg-[#6d8b78] rotate-[-22deg] shadow-lg" />
                    <div className="absolute right-6 top-18 w-56 h-34 rounded-2xl bg-[#394148] rotate-[-22deg] shadow-lg" />
                    <div className="absolute right-8 top-24 text-white/80 rotate-[-22deg] text-sm">
                      <div className="mb-6">Master Card</div>
                      <div>3245 1234 1234 1234</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="xl:col-span-3 rounded-[22px] bg-[#ece8e2] p-5 shadow-sm">
                <h2 className="text-2xl font-semibold">Your Transfers</h2>
                <div className="mt-5 space-y-4">
                  {[
                    ["From Anna Jones", "Today, 14:34", "+2.45%"],
                    ["To Carlos Brown III", "Today, 15:23", "-4.75%"],
                    ["From Joel Cannan", "Today, 17:54", "+2.45%"],
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-8 w-1 rounded-full bg-emerald-900/80" />
                        <div>
                          <div className="font-medium">{item[0]}</div>
                          <div className="text-sm text-slate-500">{item[1]}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${String(item[2]).startsWith("+") ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>
                        {item[2]}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="xl:col-span-3 rounded-[22px] bg-[#ece8e2] p-5 shadow-sm text-center flex flex-col justify-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-[#d9ddd7] flex items-center justify-center">
                  <Fingerprint className="h-10 w-10 text-emerald-900/80" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold">Keep you safe!</h2>
                <p className="text-slate-500 mt-2">Update your security password</p>
                <button className="mt-6 rounded-xl bg-[#6d8b78] px-4 py-3 text-white text-sm">
                  Update Your Security
                </button>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}