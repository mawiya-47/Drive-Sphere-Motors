import React, { useState } from "react";
import { Search, MapPin, Phone, Mail, Compass, Star, Navigation, ArrowUpRight } from "lucide-react";
import { Dealer } from "../types";

interface DealerLocatorProps {
  dealers: Dealer[];
}

export default function DealerLocator({ dealers }: DealerLocatorProps) {
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeDealer, setActiveDealer] = useState<Dealer | null>(dealers[0] || null);

  const cities = ["All", "Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta"];

  const filtered = dealers.filter((d) => {
    const matchesCity = selectedCity === "All" || d.city === selectedCity;
    const matchesQuery =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800 bg-[#F8FAFC]">
      
      {/* Header section */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold font-mono tracking-widest text-[#0D7A43] bg-[#0D7A43]/10 px-3 py-1.5 rounded-full uppercase">
          DriveSphere Connection Network
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 text-slate-950">
          Find Your Partner Showroom
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mt-2 text-sm md:text-base">
          Our standard 3S (Sales, Service, Spare Parts) authorized dealership web spans major highways and cities across Pakistan. Choose your najbliži point.
        </p>
      </div>

      {/* Main Grid layout with listings and simulated map canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dealership listing Panel - Left */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filtering tool cards */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search dealer by name, main road..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* City pills */}
            <div className="flex flex-wrap gap-1">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-wide transition-all ${
                    selectedCity === city
                      ? "bg-[#0D7A43] text-white shadow"
                      : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Core Dealers roster */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((d) => {
              const isActive = activeDealer?.id === d.id;
              return (
                <div
                  key={d.id}
                  id={`dealer-card-${d.id}`}
                  onClick={() => setActiveDealer(d)}
                  className={`bg-white rounded-2xl p-4 cursor-pointer border hover:shadow-md transition-all ${
                    isActive ? "ring-2 ring-[#0D7A43] border-transparent" : "border-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight block">{d.name}</h3>
                    <span className="text-[9.5px] uppercase font-mono font-black text-yellow-700 bg-amber-50 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
                      {d.city}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">{d.address}</p>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-50 text-[10px] text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#0D7A43] shrink-0" />
                      <span className="truncate">{d.phone}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#0D7A43] shrink-0" />
                      <span className="truncate">{d.email}</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-400 italic text-xs bg-white rounded-2xl border border-slate-100">
                No official DriveSphere dealers match your search query.
              </div>
            )}
          </div>

        </div>

        {/* Dynamic Map Visualizer Canvas - Right */}
        <div className="lg:col-span-7 bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-white/5 relative min-h-[500px] flex flex-col justify-between">
          
          {/* Header context */}
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] block uppercase">INTERACTIVE GPS MAP CONTAINER</span>
              <h2 className="text-md font-bold text-white">Showroom Vector Grid Simulator</h2>
            </div>
            <span className="text-[10px] bg-[#0D7A43]/20 border border-[#0D7A43]/50 text-white px-2.5 py-1 rounded font-mono">
              GPS RELIABLE STATUS
            </span>
          </div>

          {/* Stylized vector canvas representing dealer mapping */}
          <div className="flex-1 my-6 rounded-2xl bg-black/40 border border-white/5 relative p-4 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Visual geographic drawing indicating grid */}
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(13,122,67,0.15)_0,transparent_70%] pointer-events-none"></div>
            
            {/* Grid coordinate lines */}
            <div className="absolute inset-x-0 top-1/4 border-b border-white/5"></div>
            <div className="absolute inset-x-0 top-2/4 border-b border-white/5"></div>
            <div className="absolute inset-x-0 top-3/4 border-b border-white/5"></div>
            <div className="absolute inset-y-0 left-1/3 border-r border-white/5"></div>
            <div className="absolute inset-y-0 left-2/3 border-r border-white/5"></div>

            {/* Render selected dealer's GPS layout */}
            {activeDealer ? (
              <div className="relative z-10 text-center max-w-sm space-y-4">
                
                {/* Visual marker */}
                <div className="w-14 h-14 bg-gradient-to-tr from-[#0D7A43] to-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#0D7A43]/25 border-2 border-white/10 relative animate-pulse">
                  <MapPin className="w-7 h-7 text-white" />
                  <div className="absolute -inset-2 rounded-full border border-dashed border-[#D4AF37]/50 animate-spin [animation-duration:8s]"></div>
                </div>

                <div className="bg-slate-900 border border-white/10 rounded-xl p-4 shadow-xl">
                  <span className="text-[#D4AF37] text-[10px] font-mono font-bold tracking-widest uppercase block mb-1">SELECTED GPS COORDINATES</span>
                  <p className="text-xs font-bold text-white">{activeDealer.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-1 italic">
                    Latitude: {activeDealer.coordinates.lat.toFixed(4)} &deg; N &bull; Longitude: {activeDealer.coordinates.lng.toFixed(4)} &deg; E
                  </p>
                  
                  <div className="mt-3 text-left border-t border-white/5 pt-2 text-[10.5px] text-gray-300">
                    <span className="block font-semibold">Authorized 3S (Sales, Service, Spares) Status:</span>
                    <span className="block mt-0.5 text-gray-400 font-sans leading-relaxed">
                      Equipped with diagnostic hybrid scanner interfaces and 100% genuine parts warehouses synchronized daily.
                    </span>
                  </div>
                </div>

                {/* Simulated navigation */}
                <button
                  onClick={() => alert(`Launching localized route tracker to: ${activeDealer.address}. Please carry out safe driving parameters!`)}
                  className="px-5 py-2.5 bg-[#0D7A43] hover:bg-[#07532d] text-white font-bold rounded-xl text-[11px] tracking-wider transition-all inline-flex items-center gap-1.5 shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>START ROUTE NAVIGATION</span>
                </button>

              </div>
            ) : (
              <div className="text-center text-gray-500 italic text-xs">
                Select from authorized dealerships on left panel to overlay GPS vectors.
              </div>
            )}

            {/* Static background list representing other cities pins */}
            {activeDealer && (
              <div className="absolute bottom-4 right-4 bg-[#111827]/90 border border-white/10 p-2.5 rounded-lg text-[9px] font-mono text-gray-400">
                <span className="text-white block uppercase font-bold text-[8px] tracking-wider mb-0.5">GPS SECTOR LINKS:</span>
                <div>Karachi Hub: active (3 pins)</div>
                <div>Lahore Hub: active (2 pins)</div>
                <div>Islamabad Hub: active (2 pins)</div>
              </div>
            )}

          </div>

          <p className="text-[10.5px] text-gray-400 leading-snug border-t border-white/5 pt-3 mb-0 text-center md:text-left">
            Customer helpline availability: **+92 21 111-86-86-86** &bull; DriveSphere Care agents are available 24/7 for intercity roadside mechanical support assistance.
          </p>

        </div>

      </div>
    </div>
  );
}
