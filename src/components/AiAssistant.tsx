import React, { useState } from "react";
import { Sparkles, Send, BrainCircuit, ShieldAlert, ArrowRight, Compass, HelpCircle } from "lucide-react";

export default function AiAssistant() {
  // Recommendation Wizard states
  const [budget, setBudget] = useState("PKR 8,000,000 - 15,000,000");
  const [primaryUse, setPrimaryUse] = useState("Urban Commute & Executive Prestige");
  const [fuelPref, setFuelPref] = useState("Eco Hybrid");
  const [driveRange, setDriveRange] = useState("Frequent Intercity Driving");
  const [recLoading, setRecLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    recommendedModelName: string;
    recommendedReason: string;
    altModelName: string;
    altReason: string;
    summaryTip: string;
  } | null>(null);

  // Chat Assistant states
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Welcome to DriveSphere Luxury Concierge. I am your specialized intelligent assistant. Ask me anything about our hybrid vehicle models, custom smart financing calculations, localized fuel efficiency, or parts matching." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  async function handleRecommend() {
    setRecLoading(true);
    setRecommendation(null);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget, primaryUse, fuelPref, driveRange }),
      });
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRecLoading(false);
    }
  }

  async function handleSendChat(textToSend?: string) {
    const userText = textToSend || chatInput;
    if (!userText.trim()) return;

    const newMessages = [...messages, { sender: "user" as const, text: userText }];
    setMessages(newMessages);
    if (!textToSend) setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "ai", text: "I apologize, our corporate AI proxy is currently updating. Please review our vehicle tabs or try again in a few moments." }]);
    } finally {
      setChatLoading(false);
    }
  }

  const promptChips = [
    "Tell me about locally assembled Corolla Cross Hybrid",
    "Compare Fortuner with Hilux Revo specification",
    "Explain Smart Purchase finance options",
    "Where is the Karachi DHA Sunset Boulevard dealer?"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800 bg-[#F8FAFC]">
      {/* Intro Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold font-mono tracking-widest text-[#0D7A43] bg-[#0D7A43]/10 px-3 py-1.5 rounded-full uppercase">
          DriveSphere Intelligence Engine
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 text-slate-950">
          Futuristic AI Vehicle Guidance
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mt-2 text-sm md:text-base">
          Unleash deep learning algorithms to analyze, match, or detail the ultimate luxury vehicle that complements your lifestyle perfectly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Recommendation Engine Side */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col justify-between h-full min-h-[580px]">
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#0D7A43]">
              <BrainCircuit className="w-6 h-6" />
              <h2 className="text-lg font-bold tracking-tight text-slate-900">AI Ride Recommendation Engine</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Answer the questions below to match the dynamic portfolio models. Our system contrasts fuel economies, seating density, and regional conditions.
            </p>

            <div className="space-y-4">
              {/* Question 1: Budget */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Budget Parameter</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0D7A43]"
                >
                  <option value="Under PKR 6,000,000">Under PKR 6,000,000 (Compact sedans)</option>
                  <option value="PKR 6,000,000 - 11,000,000">PKR 6,000,000 - 11,000,000 (Mid-level comfort)</option>
                  <option value="PKR 11,000,000 - 15,000,000">PKR 11,000,000 - 15,000,000 (Premium or Hybrid SUV)</option>
                  <option value="Over PKR 15,000,000">Over PKR 15,000,000 (Absolute sovereign luxury / Trucks)</option>
                </select>
              </div>

              {/* Question 2: Primary Use */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Primary Role & Intended Driving Surface</label>
                <select
                  value={primaryUse}
                  onChange={(e) => setPrimaryUse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0D7A43]"
                >
                  <option value="Urban Commute & Executive Prestige">Urban Commute & Executive Prestige</option>
                  <option value="Heavy Family Commutes & Spacious Seating">Heavy Family Commutes & Spacious Seating</option>
                  <option value="Off-roading & Utility">Off-roading & Utility (Construction, Farms, Desert routes)</option>
                  <option value="VIP Escorts & Ultimate Road Stature">VIP Escorts & Ultimate Road Stature</option>
                </select>
              </div>

              {/* Question 3: Fuel Type */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Fuel Technology Preference</label>
                <select
                  value={fuelPref}
                  onChange={(e) => setFuelPref(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0D7A43]"
                >
                  <option value="Eco Hybrid">Self-charging Eco Hybrid (Lowest emissions & highest fuel economy)</option>
                  <option value="Standard Petrol">Standard Petrol (Direct power output & high local repair ease)</option>
                  <option value="Diesel Turbocharged">Diesel Turbocharged (Maximum towing torque & extreme reliability)</option>
                </select>
              </div>

              {/* Question 4: Drive style */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Highway / Route Routine</label>
                <select
                  value={driveRange}
                  onChange={(e) => setDriveRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0D7A43]"
                >
                  <option value="Strictly City Driving">Strictly City Commuting</option>
                  <option value="Frequent Intercity Driving">Frequent Intercity Highways (High acceleration & active crash protection needed)</option>
                  <option value="Unfettered Mountain Expeditions">Unfettered Northern Mountains Expeditions</option>
                </select>
              </div>

              <button
                id="recommend-trigger-btn"
                onClick={handleRecommend}
                disabled={recLoading}
                className="w-full py-3 bg-[#0D7A43] hover:bg-[#07532d] disabled:bg-slate-300 text-white font-bold rounded-xl text-xs tracking-wider transition-all mt-4 flex items-center justify-center gap-2"
              >
                {recLoading ? "PROCESSING DIAGNOSTIC MATRIX..." : "COMPUTE BEST MATCH VEHICLES"}
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recommendation Results Presentation */}
          <div className="mt-6 pt-6 border-t border-slate-100 min-h-[200px]">
            {recommendation ? (
              <div className="bg-[#003B1E]/10 border border-[#0D7A43]/20 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-[#0D7A43] tracking-widest block uppercase mb-1">Matched Vehicle Variant</span>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5 underline decoration-[#D4AF37] decoration-2">
                  {recommendation.recommendedModelName}
                </h3>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {recommendation.recommendedReason}
                </p>

                <div className="mt-4 pt-3 border-t border-[#0D7A43]/15 flex flex-col md:flex-row justify-between gap-4 text-xs">
                  <div className="flex-1">
                    <span className="text-[10px] uppercase block tracking-wider text-slate-500 font-bold">Alternative Choice</span>
                    <span className="font-semibold text-slate-900">{recommendation.altModelName}</span>
                    <span className="block text-[11px] text-slate-600 mt-0.5 font-sans leading-none">{recommendation.altReason}</span>
                  </div>
                  <div className="flex-1 bg-yellow-50/70 border border-[#D4AF37]/20 p-2.5 rounded-xl">
                    <span className="text-[9px] uppercase tracking-wider text-amber-700 font-black block">Pakistan Driving Pro Tip</span>
                    <span className="text-[11px] font-sans font-medium block leading-snug mt-0.5 text-slate-800">{recommendation.summaryTip}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <BrainCircuit className="w-12 h-12 stroke-[1.2] mb-2 text-slate-300" />
                <p className="text-xs italic">Submit specifications to visualize top matched vehicles instantaneously.</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Chat Assistant Side */}
        <div className="bg-[#111827] text-white rounded-3xl p-6 shadow-xl border border-white/5 flex flex-col h-[580px]">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-tr from-[#0D7A43] to-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#111827] rounded-full"></span>
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-white">DRIVESPHERE CONCIERGE</h2>
              <span className="text-[10px] font-mono text-[#D4AF37] block">ACTIVE ENGINE // GEMINI INTEL</span>
            </div>
          </div>

          {/* Messages Log Panel */}
          <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-[#0D7A43] text-white rounded-tr-none"
                      : "bg-white/5 border border-white/10 text-slate-100 rounded-tl-none font-sans"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3 max-w-[80%] flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[10px] text-gray-400 font-mono pl-1">Consulting portfolio parameters...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chips Help Area */}
          <div className="mb-3">
            <span className="text-[10px] text-gray-500 block mb-1 font-mono tracking-wider">SUGGESTED DISCOVERY POINTS</span>
            <div className="flex flex-wrap gap-1.5">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(chip)}
                  className="bg-white/5 hover:bg-[#0D7A43]/20 border border-white/10 hover:border-[#0D7A43]/40 text-gray-300 hover:text-white px-2.5 py-1 rounded-lg text-[9px] text-left transition-all max-w-full truncate"
                  title={chip}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Form Entry Field */}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Ask about Prices, Hybrid systems, booking lead times..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D7A43] placeholder-gray-500"
            />
            <button
              onClick={() => handleSendChat()}
              className="px-4 bg-[#0D7A43] hover:bg-[#07532d] text-white rounded-xl transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
