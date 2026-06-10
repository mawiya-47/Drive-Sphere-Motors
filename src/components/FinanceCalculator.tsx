import React, { useState, useEffect } from "react";
import { Landmark, Calendar, Scale, ShieldCheck, RefreshCw, Calculator, DollarSign, ChevronRight } from "lucide-react";
import { Vehicle } from "../types";

interface FinanceCalculatorProps {
  vehicles: Vehicle[];
}

export default function FinanceCalculator({ vehicles }: FinanceCalculatorProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleCost, setVehicleCost] = useState<number>(7500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [markupRate, setMarkupRate] = useState<number>(14.5); // KIBOR standard rate
  const [selectedBank, setSelectedBank] = useState<string>("Habib Bank Limited (HBL) - Premium Auto");

  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      setSelectedVehicle(vehicles[0]);
      const cost = parseInt(vehicles[0].basePrice.replace(/[^0-9]/g, ""), 10) || 7500000;
      setVehicleCost(cost);
    }
  }, [vehicles]);

  function handleVehicleChange(vId: string) {
    const v = vehicles.find((item) => item.id === vId);
    if (v) {
      setSelectedVehicle(v);
      const cost = parseInt(v.basePrice.replace(/[^0-9]/g, ""), 10) || 7500000;
      setVehicleCost(cost);
    }
  }

  // Monthly payment calculation math:
  // Down payment = VehicleCost * (DownPaymentPercent/100)
  // Loan Amount = VehicleCost - Down payment
  // Monthly rate = InterestRate / 12 / 100
  // Total Months = tenureYears * 12
  // Monthly Payment = [LoanAmount * r * (1+r)^n] / [(1+r)^n - 1]
  const downPaymentAmount = vehicleCost * (downPaymentPercent / 100);
  const loanAmount = vehicleCost - downPaymentAmount;
  const monthlyRate = markupRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let monthlyEMI = 0;
  if (loanAmount > 0 && monthlyRate > 0) {
    monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else {
    monthlyEMI = loanAmount / (totalMonths || 1);
  }

  const formatPKR = (num: number) => {
    return "PKR " + Math.round(num).toLocaleString();
  };

  const partnerBanks = [
    { name: "Habib Bank Limited (HBL) - Premium Auto", rate: 14.5, speed: "Instant 24hr pre-approval status" },
    { name: "Bank Alfalah - Car Financing Special", rate: 13.9, speed: "Lowest rate for Hybrid vehicles" },
    { name: "Meezan Bank - Islamic Car Ijarah", rate: 15.2, speed: "Shariah-compliant fixed tenure rates" },
    { name: "Faysal Bank - Velocity Auto Lease", rate: 14.8, speed: "Includes complimentary tracker & insurance" }
  ];

  function handleBankSelect(bankName: string, rate: number) {
    setSelectedBank(bankName);
    setMarkupRate(rate);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800 bg-[#F8FAFC]">
      
      {/* Header section */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold font-mono tracking-widest text-[#0D7A43] bg-[#0D7A43]/10 px-3 py-1.5 rounded-full uppercase">
          DriveSphere Finance Engine
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 text-slate-950">
          Smart Leasing Calculator
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mt-2 text-sm md:text-base">
          Configure down payment parameters, markup rates, or tenure timelines and coordinate secure pre-approval status with national partner financial institutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sliders Input Section */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6">
          
          <div className="flex items-center gap-2 mb-2 text-[#0D7A43]">
            <Calculator className="w-5 h-5" />
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Configure Lease Parameters</h2>
          </div>

          {/* Selector or Range custom */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Base portfolio Vehicle Model</label>
            <select
              value={selectedVehicle?.id || ""}
              onChange={(e) => handleVehicleChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0D7A43]"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.basePrice})
                </option>
              ))}
            </select>
          </div>

          {/* Model custom price customization */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <label className="font-bold text-slate-700">Customized Value of Vehicle (with accessories)</label>
              <span className="font-mono font-bold text-[#0D7A43]">{formatPKR(vehicleCost)}</span>
            </div>
            <input
              type="range"
              min="4000000"
              max="115000000"
              step="100000"
              value={vehicleCost}
              onChange={(e) => setVehicleCost(parseInt(e.target.value, 10))}
              className="w-full accent-[#0D7A43] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>PKR 4 Million</span>
              <span>PKR 60 Million</span>
              <span>PKR 115 Million (Max Cruiser ZX)</span>
            </div>
          </div>

          {/* Downpayment selection percentage */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <label className="font-bold text-slate-700">Down Payment Ratio Percentage (%)</label>
              <span className="font-mono font-bold text-[#D4AF37]">{downPaymentPercent}% ({formatPKR(downPaymentAmount)})</span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(parseInt(e.target.value, 10))}
              className="w-full accent-[#0D7A43] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>15% (Minimum Standard)</span>
              <span>30%</span>
              <span>50% (Max Down)</span>
            </div>
          </div>

          {/* Amortization Tenure selection */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <label className="font-bold text-slate-700">Amortization Leisure Term (Years)</label>
              <span className="font-mono font-bold text-slate-900">{tenureYears} Years ({totalMonths} monthly installments)</span>
            </div>
            <div className="flex gap-2">
              {[2, 3, 5, 7].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setTenureYears(yr)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    tenureYears === yr
                      ? "bg-[#0D7A43] text-white border-transparent shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {yr} Years
                </button>
              ))}
            </div>
          </div>

          {/* Partner bank selections */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Partner Banking Interlink Rates</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {partnerBanks.map((bk) => {
                const isSelected = selectedBank === bk.name;
                return (
                  <div
                    key={bk.name}
                    onClick={() => handleBankSelect(bk.name, bk.rate)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-50 border-[#0D7A43] ring-1 ring-[#0D7A43]"
                        : "bg-white border-slate-150 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <strong className="text-slate-800 leading-tight block pr-2">{bk.name.split(" - ")[0]}</strong>
                      <span className="font-mono font-bold text-[#D4AF37] whitespace-nowrap bg-[#D4AF37]/10 px-2 py-0.5 rounded leading-none text-[10.5px]">
                        {bk.rate}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1.5">{bk.speed}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Calculations display Column panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111827] text-white rounded-3xl p-6 shadow-xl border border-white/5 relative overflow-hidden text-center md:text-left h-full flex flex-col justify-between min-h-[460px]">
            {/* Background vector */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#0D7A43]/10 blur-3xl rounded-full"></div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] block uppercase mb-1">Amortization Blueprint Result</span>
              <h2 className="text-xl font-bold tracking-tight mb-4">Estimated Monthly Lease Outflow</h2>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center my-6 relative shadow-inner">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">ESTIMATED INSTALMENT</span>
                <span className="text-3xl md:text-4xl font-black text-[#3af584] font-mono block">
                  {formatPKR(monthlyEMI)}
                </span>
                <span className="text-[11px] text-gray-400 font-mono block mt-1">Per Month / Fixed Tenure Status</span>
              </div>

              {/* Specs break down */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Selected Vehicle Portfolio</span>
                  <span className="font-semibold text-[#D4AF37]">{selectedVehicle?.name || "Corolla Base"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Adjusted Vehicle Base Cost</span>
                  <span className="font-semibold text-white font-mono">{formatPKR(vehicleCost)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Paid Downpayment Draft</span>
                  <span className="font-semibold text-white font-mono">{formatPKR(downPaymentAmount)} ({downPaymentPercent}%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Principal Financing Value</span>
                  <span className="font-semibold text-white font-mono">{formatPKR(loanAmount)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Markup Configuration</span>
                  <span className="font-semibold text-white">{markupRate}% ({selectedBank.split(" - ")[0]})</span>
                </div>
              </div>

            </div>

            <div className="my-6 border-t border-white/5 pt-4">
              <div className="flex items-start gap-2 text-[10.5px] text-slate-400 bg-white/5 p-3 rounded-xl border border-white/10 text-left leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-[#3af584] shrink-0" />
                <p>
                  DriveSphere leasing includes complimentary nationwide tracker installations, corporate safety briefings, and standard first year localized mechanical warranty checks.
                </p>
              </div>
            </div>

            <button
              onClick={() => alert("Your lease simulation blueprint has been drafted! You can submit this secure application to Meezan Bank or HBL credit officers via our online booking checkout panels.")}
              className="w-full py-3 bg-[#0D7A43] hover:bg-[#07512a] text-white font-bold rounded-xl text-xs tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              <span>SUBMIT FOR FINANCIAL PRE-APPROVAL</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
