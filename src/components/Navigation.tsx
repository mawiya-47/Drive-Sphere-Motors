import React from "react";
import { Car, Landmark, MapPin, Wrench, Sparkles, ShieldCheck, Heart, User, Settings, Info } from "lucide-react";

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

export default function Navigation({ currentTab, setCurrentTab, user, onLogout, onLoginClick }: NavigationProps) {
  const tabs = [
    { id: "showcase", label: "Showroom", icon: Car },
    { id: "finance", label: "Smart Finance", icon: Landmark },
    { id: "dealers", label: "Find Dealer", icon: MapPin },
    { id: "parts", label: "Parts Store", icon: Wrench },
    { id: "sustainability", label: "Green CSR", icon: Info },
    { id: "assistant", label: "AI Assistant", icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 text-slate-955 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand from Design HTML */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab("showcase")}>
          <div className="w-8 h-8 bg-[#0D7A43] rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tighter uppercase text-[#111827]">
              DriveSphere<span className="text-[#0D7A43]">Motors</span>
            </span>
          </div>
        </div>

        {/* Tab Links - Clean Minimal Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-${tab.id}`}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-[#0D7A43] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#0D7A43] hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Authentication / Portal Accessors */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-50 pr-2 pl-4 py-1 rounded-full border border-slate-200">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">{user.name}</span>
                <span className="text-[9.5px] text-slate-500 font-mono tracking-tight">{user.role}</span>
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                <button
                  id="nav-customer-portal"
                  onClick={() => setCurrentTab("portal")}
                  className={`p-2 rounded-full text-slate-600 hover:text-[#0D7A43] hover:bg-slate-100 transition-all ${
                    currentTab === "portal" ? "bg-[#0D7A43]/10 text-[#0D7A43]" : ""
                  }`}
                  title="My Customer Portal"
                >
                  <User className="w-4 h-4" />
                </button>

                <button
                  id="nav-admin-crm"
                  onClick={() => setCurrentTab("admin")}
                  className={`p-2 rounded-full text-slate-600 hover:text-[#D4AF37] hover:bg-slate-100 transition-all ${
                    currentTab === "admin" ? "bg-amber-100/60 text-amber-800" : ""
                  }`}
                  title="Admin / Partner Portal"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  id="nav-logout"
                  onClick={onLogout}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              id="nav-login-trigger"
              onClick={onLoginClick}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>LOG IN</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
