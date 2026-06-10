import React, { useState, useEffect } from "react";
import { Info, Sparkles, Scale, Sliders, CheckCircle, HelpCircle, ArrowRight, Star, Heart, MessageSquarePlus, DollarSign, CreditCard } from "lucide-react";
import { Vehicle, VehicleVariant } from "../types";

interface ShowcaseProps {
  vehicles: Vehicle[];
  dealers: { id: string; name: string; city: string }[];
  currentUserId: string;
  onBookingSuccess: () => void;
  openBookingTab: () => void;
}

export default function Showcase({ vehicles, dealers, currentUserId, onBookingSuccess, openBookingTab }: ShowcaseProps) {
  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [hybridOnly, setHybridOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceSort, setPriceSort] = useState<string>("None"); // LowToHigh, HighToLow

  // Active highlighted vehicle
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [angleIndex, setAngleIndex] = useState<number>(0); // 0 to 3 angles for 360 view

  // Comparison states
  const [compareList, setCompareList] = useState<Vehicle[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Booking details modal
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [bookingVariant, setBookingVariant] = useState<VehicleVariant | null>(null);
  const [bookingDealerId, setBookingDealerId] = useState<string>("");
  const [payNow, setPayNow] = useState<boolean>(true);
  const [bookingCardNumber, setBookingCardNumber] = useState<string>("4000 1234 5678 9010");
  const [bookingStatusText, setBookingStatusText] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      setActiveVehicle(vehicles[0]);
      if (vehicles[0].variants && vehicles[0].variants.length > 0) {
        setSelectedVariant(vehicles[0].variants[0]);
      }
      if (vehicles[0].colors && vehicles[0].colors.length > 0) {
        setSelectedColor(vehicles[0].colors[0]);
      }
    }
  }, [vehicles]);

  function handleVehicleSelect(v: Vehicle) {
    setActiveVehicle(v);
    if (v.variants && v.variants.length > 0) {
      setSelectedVariant(v.variants[0]);
    }
    if (v.colors && v.colors.length > 0) {
      setSelectedColor(v.colors[0]);
    }
    setAngleIndex(0);
  }

  // Handle comparison lists
  function toggleCompare(v: Vehicle) {
    if (compareList.find((item) => item.id === v.id)) {
      setCompareList(compareList.filter((item) => item.id !== v.id));
    } else {
      if (compareList.length >= 2) {
        alert("You can compare up to 2 vehicles at a time.");
        return;
      }
      setCompareList([...compareList, v]);
    }
  }

  // Submit Booking request to database
  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingVehicle || !bookingVariant || !bookingDealerId) {
      setBookingStatusText("Please select a preferred localized dealership point.");
      return;
    }

    setBookingLoading(true);
    setBookingStatusText("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: bookingVehicle.id,
          variantName: bookingVariant.name,
          color: selectedColor || bookingVehicle.colors[0],
          dealerId: bookingDealerId,
          payNow: payNow
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookingStatusText(`SUCCESS! Booking ${data.booking.id} has been registered securely. Redirecting to your Customer Dashboard...`);
        setTimeout(() => {
          setBookingVehicle(null);
          onBookingSuccess();
          openBookingTab();
        }, 2200);
      } else {
        setBookingStatusText(data.message || "Failed booking.");
      }
    } catch (err) {
      setBookingStatusText("Server response delay. Please reconfirm details.");
    } finally {
      setBookingLoading(false);
    }
  }

  // Filters application
  const filteredVehicles = vehicles.filter((v) => {
    const matchesCategory = selectedCategory === "All" || v.category === selectedCategory;
    const matchesHybrid = !hybridOnly || v.isHybrid === true;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesHybrid && matchesSearch;
  });

  if (priceSort === "LowToHigh") {
    filteredVehicles.sort((a, b) => {
      const numA = parseInt(a.basePrice.replace(/[^0-9]/g, ""), 10);
      const numB = parseInt(b.basePrice.replace(/[^0-9]/g, ""), 10);
      return numA - numB;
    });
  } else if (priceSort === "HighToLow") {
    filteredVehicles.sort((a, b) => {
      const numA = parseInt(a.basePrice.replace(/[^0-9]/g, ""), 10);
      const numB = parseInt(b.basePrice.replace(/[^0-9]/g, ""), 10);
      return numB - numA;
    });
  }

  const anglesList = [
    { title: "Dynamic Front View", desc: "Premium styling paired with Bi-Beam LED technology" },
    { title: "Aerodynamic Side Profile", desc: "Fluid geometric lines and optimized wind resistance" },
    { title: "Rear Majesty & Tailgate", desc: "Touch-less kick sensor activation ready" },
    { title: "Executive Inner Cockpit view", desc: "Luxurious soft leather trimming and premium MID cluster" }
  ];

  return (
    <div className="bg-[#F8FAFC] pb-12">
      
      {/* Immersive Cinematic Hero Unit - Clean Minimalist Style */}
      <div className="relative bg-white text-slate-900 overflow-hidden py-16 md:py-24 border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/55 to-transparent z-10"></div>
        
        {/* Soft elegant graphical light element */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 z-0 hidden lg:block">
          <div className="w-full h-full bg-gradient-to-br from-[#0D7A43] to-slate-200 relative">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#0D7A43] blur-3xl opacity-30"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-md">New Arrival 2026</span>
              <span className="w-12 h-[1px] bg-slate-300"></span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Luxury Redefined</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-light tracking-tighter leading-[1.1] mb-6 text-slate-950">
              DriveSphere <span className="font-bold text-[#111827]">Motors</span><br/>
              <span className="text-[#0D7A43]">HEV Legacy</span>
            </h1>

            <p className="text-slate-500 max-w-xl mb-8 leading-relaxed font-light text-base md:text-lg">
              Experience Pakistani-assembled, premium hybrid technology synthesized with executive precision. Inspired by unyielding dependability, optimized for national highways, and crafted in aesthetic detail.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a
                href="#showroom-catalogue"
                className="bg-[#111827] hover:bg-slate-800 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md"
              >
                Explore Showroom
              </a>
              <button
                onClick={() => {
                  const el = document.getElementById("comparison-panel");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="border border-[#111827] text-[#111827] hover:bg-slate-50 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
              >
                Compare Specifications ({compareList.length}/2)
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl transition-all relative">
            <div className="absolute top-4 right-4 bg-white/80 p-1.5 rounded-xl border border-slate-100 z-10 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500">Live Configurator</span>
            </div>

            <span className="text-xs font-bold text-[#D4AF37] font-mono uppercase tracking-wider block mb-1">Interactive Focus</span>
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Corolla Cross HEV Sport</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">The high synergy of advanced 4th Generation Hybrid technology and versatile luxury styling.</p>
            
            {/* Spec grid aligned to design theme */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold leading-none mb-1.5">Economy</span>
                <span className="text-xs font-extrabold text-[#0D7A43] font-mono">26.2 km/l</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-105">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold leading-none mb-1.5">Hybrid Power</span>
                <span className="text-xs font-extrabold text-slate-900 font-mono">196 hp</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-105">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold leading-none mb-1.5">CO2 Cut</span>
                <span className="text-xs font-extrabold text-[#D4AF37] font-mono">-35% Less</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Standard local warranty coverage</span>
              <span className="font-mono text-slate-900 font-bold">100,000 KM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Showroom Experience Page Grid */}
      <div id="showroom-catalogue" className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Dynamic Navigation and Filtering Header */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category List */}
          <div className="flex flex-wrap items-center gap-1">
            {["All", "Cars & MPVs", "SUVs & Pickups", "Buses & Vans"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === cat
                    ? "bg-[#0D7A43] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick search & Hybrid Filter controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Yaris, Corolla..."
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0D7A43] flex-1 md:flex-initial"
            />

            <button
              onClick={() => setHybridOnly(!hybridOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                hybridOnly
                  ? "bg-[#0D7A43]/10 border-[#0D7A43] text-[#0D7A43]"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hybrid Only</span>
            </button>

            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value="None">Sort Price</option>
              <option value="LowToHigh">Price: Low to High</option>
              <option value="HighToLow">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* 2-Column Dashboard layout for Vehicle detailing and grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Vehicle Roster Grid Selection */}
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVehicles.map((vehicle) => {
              const isActive = activeVehicle?.id === vehicle.id;
              const hasCompare = compareList.some((item) => item.id === vehicle.id);
              return (
                <div
                  key={vehicle.id}
                  id={`vehicle-card-${vehicle.id}`}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`bg-white rounded-2xl p-4 cursor-pointer border hover:shadow-md transition-all relative flex flex-col justify-between ${
                    isActive
                      ? "ring-2 ring-[#0D7A43] border-transparent"
                      : "border-slate-100"
                  }`}
                >
                  {/* Top tags */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{vehicle.category}</span>
                    <div className="flex items-center gap-1">
                      {vehicle.isHybrid && (
                        <span className="text-[9px] bg-green-50 text-[#0D7A43] font-bold px-1.5 py-0.5 rounded">HYBRID</span>
                      )}
                      {vehicle.isGRSport && (
                        <span className="text-[9px] bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded">GR-S</span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail and title */}
                  <div>
                    <h3 className="text-md font-bold text-slate-900 leading-tight">{vehicle.name}</h3>
                    <p className="text-[10px] text-slate-500 line-clamp-1 italic mt-0.5">{vehicle.tagline}</p>
                    
                    <div className="my-3 w-full h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden flex items-center justify-center relative">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        referrerPolicy="no-referrer"
                        className="max-h-20 object-contain hover:scale-105 transition-all"
                      />
                    </div>
                  </div>

                  {/* Bottom values */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-mono">Starts from</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{vehicle.basePrice}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        id={`btn-compare-toggle-${vehicle.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(vehicle);
                        }}
                        className={`p-1.5 rounded-lg transition-all ${
                          hasCompare
                            ? "bg-slate-800 text-[#D4AF37]"
                            : "bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                        title="Add to spec comparisons"
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-[#0D7A43] font-black tracking-wider uppercase">Details &raquo;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Fully Interactive 360 Vehicle Viewer & Variant Selector details */}
          <div className="lg:col-span-7">
            {activeVehicle ? (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                
                {/* Vehicle Header info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-bold font-mono text-[#0D7A43] tracking-widest block uppercase">ACTIVE MODEL DETAILS</span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center gap-2">
                      {activeVehicle.name}
                      {activeVehicle.isGRSport && (
                        <span className="text-xs bg-red-600 text-white font-black px-2 py-0.5 rounded tracking-wide">GAZOO RACING</span>
                      )}
                    </h2>
                    <span className="text-xs text-slate-500 italic mt-0.5">{activeVehicle.tagline}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block uppercase font-mono">National Standard Price</span>
                    <span className="text-xl font-mono font-black text-[#0D7A43]">{activeVehicle.basePrice}</span>
                  </div>
                </div>

                {/* 360 Interactive Angle Showcase Area */}
                <div className="bg-gradient-to-b from-slate-50 to-slate-150 rounded-2xl p-6 text-center relative overflow-hidden group">
                  
                  {/* Backdrop lights */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-[#0D7A43]/10 blur-3xl rounded-full"></div>
                  
                  <div className="relative z-10 py-4 h-48 flex items-center justify-center">
                    <img
                      src={activeVehicle.image}
                      alt={activeVehicle.name}
                      referrerPolicy="no-referrer"
                      className="max-h-44 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-300"
                      style={{
                        transform: `rotate(${angleIndex * 15}deg) scaleX(${angleIndex % 2 === 0 ? 1 : -1})`,
                      }}
                    />
                  </div>

                  {/* Manual Rotation Slider Control */}
                  <div className="relative z-20 max-w-sm mx-auto mt-4 px-4 bg-white/70 backdrop-blur-sm p-3.5 rounded-xl text-xs border border-slate-200">
                    <span className="font-bold text-slate-800 block text-[11px] mb-1.5 uppercase font-mono">
                      {anglesList[angleIndex].title}
                    </span>
                    <p className="text-[11px] text-slate-500 mb-2 leading-tight">
                      {anglesList[angleIndex].desc}
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="1"
                      value={angleIndex}
                      onChange={(e) => setAngleIndex(parseInt(e.target.value, 10))}
                      className="w-full accent-[#0D7A43] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                      <span>Front View</span>
                      <span>Side Profile</span>
                      <span>Rear view</span>
                      <span>Cabin Trim</span>
                    </div>
                  </div>

                  {/* Dynamic Color Selector */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 px-2.5 py-1.5 rounded-lg scale-90 md:scale-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase font-mono pr-1 border-r border-slate-200 leading-none">COLOR</span>
                    {activeVehicle.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`w-4 h-4 rounded-full border border-slate-400 transition-all ${
                          selectedColor === c ? "ring-2 ring-slate-800 ring-offset-1 scale-110" : ""
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>

                  {/* Hybrid technology specs block */}
                  {activeVehicle.isHybrid && (
                    <div className="absolute top-4 right-4 bg-green-950/90 text-[#3af584] text-[9.5px] font-mono px-2.5 py-1 rounded-full border border-green-500/20 shadow-md">
                      Self-Charging Hybrid Synergy
                    </div>
                  )}

                </div>

                {/* Technical Specifications */}
                <div className="my-6">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 mb-2">Technical Matrix Parameters</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block">Performance CC</span>
                      <strong className="text-slate-900">{activeVehicle.specs.engineSize}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block">Combined Output</span>
                      <strong className="text-slate-900">{activeVehicle.specs.power}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block">Localized Fuel Economy</span>
                      <strong className="text-yellow-700 font-mono">{activeVehicle.specs.efficiency}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block">Cabin Seating</span>
                      <strong className="text-slate-900">{activeVehicle.specs.seating}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block">Drivetrain System</span>
                      <strong className="text-slate-900">{activeVehicle.specs.drivetrain}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block">Safety Shield NCAP</span>
                      <strong className="text-slate-900">{activeVehicle.specs.safetyRating}</strong>
                    </div>
                  </div>
                </div>

                {/* Variant list and variant price */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 mb-6">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 mb-2">Variants & Custom Assemblies</h3>
                  <div className="space-y-2">
                    {activeVehicle.variants.map((variant) => {
                      const isVActive = selectedVariant?.name === variant.name;
                      return (
                        <div
                          key={variant.name}
                          onClick={() => setSelectedVariant(variant)}
                          className={`p-3 rounded-xl border text-xs flex justify-between items-center cursor-pointer transition-all ${
                            isVActive
                              ? "bg-white border-[#0D7A43] ring-1 ring-[#0D7A43] shadow-sm"
                              : "bg-white/40 hover:bg-white border-slate-200"
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-slate-900 block">{variant.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {variant.engine} &bull; {variant.transmission} &bull; {variant.fuelType}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-[#0D7A43]">{variant.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Primary CTA Action Hooks */}
                <div className="flex gap-3">
                  <button
                    id={`btn-book-now-${activeVehicle.id}`}
                    onClick={() => {
                      setBookingVehicle(activeVehicle);
                      setBookingVariant(selectedVariant || activeVehicle.variants[0]);
                      setBookingStatusText("");
                    }}
                    className="flex-1 py-3 bg-[#0D7A43] hover:bg-[#084f29] text-white font-bold rounded-xl text-xs tracking-wider shadow-[0_4px_15px_rgba(13,122,67,0.3)] transition-all flex items-center justify-center gap-1"
                  >
                    <span>ONLINE BOOKING REGISTRY</span>
                  </button>
                  
                  <button
                    id={`btn-add-to-comp-${activeVehicle.id}`}
                    onClick={() => toggleCompare(activeVehicle)}
                    className={`px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center justify-center gap-2 ${
                      compareList.some((it) => it.id === activeVehicle.id) ? "bg-[#D4AF37]/15 text-yellow-800 border-yellow-300" : ""
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span className="hidden md:inline">COMPARE</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 italic bg-white rounded-3xl border border-slate-100">
                Please select any vehicle catalog card on left to see specs.
              </div>
            )}
          </div>

        </div>

        {/* ----------------------------------------------------
            COMPARISON BAR PANEL
           ---------------------------------------------------- */}
        <div id="comparison-panel" className="mt-12 group">
          <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-white/5 relative overflow-hidden">
            
            {/* Ambient luxury lights */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#D4AF37]/20 blur-3xl opacity-60"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold font-mono text-[#D4AF37] tracking-widest block uppercase">EXPERIMENT MATRIX</span>
                <h2 className="text-2xl font-black text-white">Compare Engine Arena</h2>
                <p className="text-xs text-gray-400 mt-0.5">Dual matrix analysis based on official DriveSphere specs.</p>
              </div>

              {compareList.length > 0 && (
                <button
                  onClick={() => setCompareList([])}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-[10px] uppercase font-mono transition-all"
                >
                  Clear Selection Queue
                </button>
              )}
            </div>

            {compareList.length === 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Visual arrow divider */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0D7A43] text-white items-center justify-center font-bold text-xs ring-4 ring-[#111827]">
                  VS
                </div>

                {compareList.map((comp) => (
                  <div key={comp.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#D4AF37]/30 transition-all">
                    <span className="text-[10px] text-gray-400 block font-mono uppercase">{comp.category}</span>
                    <h3 className="text-xl font-bold text-white mt-1 underline decoration-[#D4AF37]/40">{comp.name}</h3>
                    
                    <div className="my-4 h-24 flex items-center justify-center">
                      <img src={comp.image} alt={comp.name} referrerPolicy="no-referrer" className="max-h-20 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]" />
                    </div>

                    {/* Compare characteristics table */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Standard Price Range</span>
                        <strong className="text-white font-mono">{comp.basePrice}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Engine displacement</span>
                        <span className="text-white">{comp.specs.engineSize}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Total System Power</span>
                        <span className="text-white">{comp.specs.power}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">PK Transport Efficiency</span>
                        <span className="text-[#3af584] font-mono font-black">{comp.specs.efficiency}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Seating Density</span>
                        <span className="text-white">{comp.specs.seating}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">Safety Features Suite</span>
                        <span className="text-white text-right font-semibold text-[11px] max-w-xs">{comp.features.slice(0, 2).join(", ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 italic text-xs flex flex-col items-center justify-center">
                <Sliders className="w-10 h-10 mb-2 stroke-[1.2] text-[#D4AF37]" />
                <p>Selected list currently has ({compareList.length}/2) vehicles. Select two models to trigger full matrix comparison sheets.</p>
                <div className="flex gap-1.5 mt-3">
                  {vehicles.slice(0, 2).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => toggleCompare(v)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-[10px] text-gray-300"
                    >
                      + Add {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ----------------------------------------------------
          ONLINE BOOKING REALTIME OVERLAY CHECKOUT MODAL
         ---------------------------------------------------- */}
      {bookingVehicle && bookingVariant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            
            {/* Close */}
            <button
              onClick={() => setBookingVehicle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold text-lg"
            >
              &times;
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
              <div className="w-10 h-10 bg-[#0D7A43]/10 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-[#0D7A43]" />
              </div>
              <div>
                <h3 className="text-md font-extrabold text-[#111827]">DriveSphere Secured Booking Registry</h3>
                <span className="text-[10px] text-slate-500 font-mono">ENCRYPTED GATEWAY // STRIPE SIMULATION</span>
              </div>
            </div>

            <form onSubmit={submitBooking} className="space-y-3.5 text-xs">
              
              {/* Selected Vehicle Info summarized */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[9px] uppercase font-mono text-slate-400">Selected Vehicle & Variant</span>
                <span className="block font-bold text-slate-900 leading-tight">{bookingVehicle.name}</span>
                <span className="block text-[11px] text-[#0D7A43] font-bold mt-0.5">{bookingVariant.name}</span>
                <span className="block text-[10px] font-mono text-yellow-700 mt-0.5">{bookingVariant.price}</span>
              </div>

              {/* Step 1: Dealer point selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Localized Showroom Point</label>
                <select
                  required
                  value={bookingDealerId}
                  onChange={(e) => setBookingDealerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-[#0D7A43]"
                >
                  <option value="">-- Choose Showroom Hub --</option>
                  {dealers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.city})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">Your designated dealer coordinates delivery scheduling & physical documentation checks.</span>
              </div>

              {/* Step 2: Pay security deposit? */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={payNow}
                  onChange={() => setPayNow(!payNow)}
                  className="mt-1 accent-[#0D7A43] scale-110"
                />
                <div>
                  <label className="font-bold text-slate-800 block leading-tight">Secure Registry Reservation Slot</label>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
                    Pay a fully refundable deposit of **PKR 500,000** now to receive priority reservation priority. This deposit is verified via demo Stripe credentials.
                  </p>
                </div>
              </div>

              {payNow && (
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-[9px] block uppercase text-slate-400 font-bold font-mono">Demo Credit/Debit Card Details</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={bookingCardNumber}
                      onChange={(e) => setBookingCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 pl-8 font-mono tracking-wider focus:outline-none"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="MM/YY" className="bg-white border border-slate-200 rounded-lg p-2 font-mono text-center focus:outline-none" defaultValue="12/28" />
                    <input type="password" placeholder="CVV" className="bg-white border border-slate-200 rounded-lg p-2 font-mono text-center focus:outline-none" defaultValue="123" />
                  </div>
                </div>
              )}

              {bookingStatusText && (
                <div className={`p-3 rounded-lg text-[10.5px] font-sans ${
                  bookingStatusText.includes("SUCCESS") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {bookingStatusText}
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingVehicle(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 py-2.5 bg-[#0D7A43] hover:bg-[#074726] text-white font-bold rounded-lg tracking-wider transition-all"
                >
                  {bookingLoading ? "VERIFYING ENCRYPTION..." : "SUBMIT SLOT APPLICATION"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
