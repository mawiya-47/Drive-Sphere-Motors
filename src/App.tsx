import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Showcase from "./components/Showcase";
import FinanceCalculator from "./components/FinanceCalculator";
import DealerLocator from "./components/DealerLocator";
import PartsStore from "./components/PartsStore";
import CorporateCSR from "./components/CorporateCSR";
import AiAssistant from "./components/AiAssistant";
import CustomerPortal from "./components/CustomerPortal";
import AdminCRM from "./components/AdminCRM";
import { Vehicle, Dealer, Booking, ServiceAppointment, NewsArticle, PartsItem } from "./types";
import { Sparkles, CheckCircle, ShieldAlert, Wifi, Key } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("showcase");
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Core synchronized data states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [appointments, setAppointments] = useState<ServiceAppointment[]>([]);
  const [parts, setParts] = useState<PartsItem[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [projects, setProjects] = useState<Array<{ id: string; title: string; metric: string; status: string }>>([]);

  // Authenticated User session (pre-authenticated with active demo Customer for smoother initial use)
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>({
    id: "user-1",
    name: "Ahmed Khan",
    email: "starpanther0@gmail.com",
    role: "Customer"
  });

  const [loginEmail, setLoginEmail] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Sync datasets from backend rest points on mount
  const syncData = async () => {
    try {
      const vRes = await fetch("/api/vehicles");
      const vData = await vRes.json();
      setVehicles(vData);

      const dRes = await fetch("/api/dealers");
      const dData = await dRes.json();
      setDealers(dData);

      const bRes = await fetch("/api/bookings");
      const bData = await bRes.json();
      setBookings(bData);

      const aRes = await fetch("/api/appointments");
      const aData = await aRes.json();
      setAppointments(aData);

      const pRes = await fetch("/api/parts");
      const pData = await pRes.json();
      setParts(pData);

      const nRes = await fetch("/api/news");
      const nData = await nRes.json();
      setNews(nData);

      const sRes = await fetch("/api/sustainability");
      const sData = await sRes.json();
      setProjects(sData);

      setIsOnline(true);
    } catch (err) {
      console.error("Delayed backend synchronizations:", err);
      setIsOnline(false); // offline fallback mode
    }
  };

  useEffect(() => {
    syncData();
    // Periodically fetch any CRM state updates placed by admin/dealer actions
    const intervalRef = setInterval(syncData, 5000);
    return () => clearInterval(intervalRef);
  }, []);

  // Update client indicators on manual login
  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail.includes("@")) {
      setLoginError("Please enter a valid active email.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setShowLoginModal(false);
        setLoginEmail("");
        // Redirect dynamically
        if (data.user.role === "Admin") {
          setCurrentTab("admin");
        } else if (data.user.role === "Dealer") {
          setCurrentTab("admin");
        } else {
          setCurrentTab("portal");
        }
      }
    } catch (err) {
      setLoginError("Authentication server timeout. Proceeding as offline user.");
    }
  }

  function handleLogout() {
    setUser(null);
    setCurrentTab("showcase");
  }

  // Active sync addition to client
  function handleAddAppointmentLocal(appt: ServiceAppointment) {
    setAppointments((prev) => [appt, ...prev]);
  }

  function handleUpdateBookingStatusLocal(id: string, nextStatus: any) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b))
    );
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#0D7A43] selection:text-white pb-6">
      
      {/* Dynamic Offline / Online Indicator Bar */}
      <div className="bg-slate-50 border-b border-slate-200 py-1.5 px-6 flex justify-between items-center text-[10.5px]">
        <div className="flex items-center gap-2 text-slate-500">
          <Wifi className={`w-3.5 h-3.5 ${isOnline ? "text-green-500" : "text-amber-500"}`} />
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider">{isOnline ? "REAL-TIME SYNC: ACTIVE // PORT 3000" : "OFFLINE LOCAL STORAGE ACTIVE"}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Quick demo role logs
              setUser({ id: "admin-s", name: "INDUS PARTNER", email: "admin@drivesphere.com.pk", role: "Admin" });
              setCurrentTab("admin");
            }}
            className="text-[10px] uppercase font-mono bg-[#0D7A43]/5 hover:bg-[#0D7A43]/10 text-[#0D7A43] border border-[#0D7A43]/10 px-2.5 py-0.5 rounded-full transition-all font-bold"
            title="Switch easily to inspect full enterprise CRM ledger"
          >
            Switch to Admin Demo Panel &raquo;
          </button>
          
          <span className="text-slate-400 font-mono text-[10px] hidden md:inline">SYSTEM STATUS: OPERATIONAL</span>
        </div>
      </div>

      {/* Persistent Glass Navbar */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
      />

      {/* Main Tab Render Container */}
      <main id="tab-rendering-wrapper" className="flex-1 animate-fade-in duration-300">
        {currentTab === "showcase" && (
          <Showcase
            vehicles={vehicles}
            dealers={dealers}
            currentUserId={user ? user.id : "guest"}
            onBookingSuccess={syncData}
            openBookingTab={() => setCurrentTab("portal")}
          />
        )}

        {currentTab === "finance" && (
          <FinanceCalculator vehicles={vehicles} />
        )}

        {currentTab === "dealers" && (
          <DealerLocator dealers={dealers} />
        )}

        {currentTab === "parts" && (
          <PartsStore initialParts={parts} userEmail={user ? user.email : "guest"} />
        )}

        {currentTab === "sustainability" && (
          <CorporateCSR articles={news} projects={projects} />
        )}

        {currentTab === "assistant" && (
          <AiAssistant />
        )}

        {currentTab === "portal" && (
          <CustomerPortal
            user={user}
            bookings={bookings}
            appointments={appointments}
            dealers={dealers}
            onAddAppointment={handleAddAppointmentLocal}
          />
        )}

        {currentTab === "admin" && (
          <AdminCRM
            bookings={bookings}
            dealers={dealers}
            onUpdateBookingStatus={handleUpdateBookingStatusLocal}
          />
        )}
      </main>

      {/* Luxury Footer panel */}
      <footer className="mt-12 bg-[#111827] text-gray-400 border-t border-[#0D7A43]/20 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h4 className="text-white font-black tracking-widest text-sm font-sans">
              DRIVESPHERE MOTORS
            </h4>
            <p className="text-[11.5px] leading-relaxed">
              Leading the hybrid shift across national highways. Inspired by the legendary engineering of Toyota Indus and Mercedes aesthetics.
            </p>
            <span className="text-[10px] block font-mono text-[#D4AF37]">3S AUTHORIZED SYSTEM SPAN // 2026</span>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Vehicle Categories</h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => { setCurrentTab("showcase") }} className="hover:text-[#0D7A43]">Corolla Cross HEV (Hybrid SUV)</button></li>
              <li><button onClick={() => { setCurrentTab("showcase") }} className="hover:text-[#0D7A43]">Yaris Sedan ATIV X</button></li>
              <li><button onClick={() => { setCurrentTab("showcase") }} className="hover:text-[#0D7A43]">Fortuner Legender (Premium AWD)</button></li>
              <li><button onClick={() => { setCurrentTab("showcase") }} className="hover:text-[#0D7A43]">Hilux Revo GR SPORT (Rocco Offroad)</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Company Information</h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => { setCurrentTab("sustainability") }} className="hover:text-white">Eco Coastal Forests Mangroves Canopy</button></li>
              <li><button onClick={() => { setCurrentTab("sustainability") }} className="hover:text-white">Nationwide 5S Highways Safety Caravan</button></li>
              <li><button onClick={() => { setCurrentTab("sustainability") }} className="hover:text-white">Toyota-Indus Technical Academy grs</button></li>
              <li><button onClick={() => { setCurrentTab("sustainability") }} className="hover:text-white">Corporate Careers Portal</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Customer Support</h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => { setCurrentTab("assistant") }} className="hover:text-white">DriveSphere AI Concierge Chatbot</button></li>
              <li><button onClick={() => { setCurrentTab("finance") }} className="hover:text-white">HBL & Meezan Bank Lease Planners</button></li>
              <li><button onClick={() => { setCurrentTab("dealers") }} className="hover:text-white">Karachi, Lahore & Islamabad Locators</button></li>
              <li><span className="font-mono text-[10.5px] text-[#D4AF37]">UAN helpline: +92 21 111-86-86-86</span></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 pt-4 text-center text-xs text-slate-500 space-y-2">
          <p>&copy; 2026 DriveSphere Motors (Pakistan) & Indus Automotive Group. Created with extreme care and digital craftsmanship for pre-approval reservations slot allocations.</p>
          <p className="text-[#0D7A43] font-semibold text-xs tracking-wider uppercase font-mono">Made by Muhammad Mawiya</p>
        </div>
      </footer>

      {/* SIMULATED DYNAMIC AUTHENTICATION ENTRY SHEETS */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold text-lg"
            >
              &times;
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 bg-linear-to-tr from-[#0D7A43] to-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-md">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-tight uppercase font-sans">Showroom Portal Gateway</h3>
              <p className="text-xs text-slate-500">Enter your email. Account roles automatically preset based on your coordinates.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@demo.pk or partner-admin@demo.pk"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-1.5 block leading-none">
                  * Note: Use email containing **admin** to trigger Partner admin status easily!
                </span>
              </div>

              {loginError && <p className="text-xs text-red-500 font-medium">{loginError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-[#0D7A43] hover:bg-[#07532d] text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all"
              >
                VERIFY ACCOUNT ACCESSORS
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
