import React, { useState, useEffect } from "react";
import { Settings, RefreshCw, BarChart2, ShieldAlert, CheckCircle, Scale, Database, Clock, RefreshCw as LoopIcon } from "lucide-react";
import { Booking, Dealer } from "../types";

interface AdminCRMProps {
  bookings: Booking[];
  dealers: Dealer[];
  onUpdateBookingStatus: (id: string, nextStatus: any) => void;
}

export default function AdminCRM({ bookings, dealers, onUpdateBookingStatus }: AdminCRMProps) {
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; user: string; action: string; timestamp: string }>>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeStatuses, setActiveStatuses] = useState<{ [key: string]: string }>({});

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/logs");
      const data = await res.json();
      setAuditLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Initialize select status mapping
    const initialMap: { [key: string]: string } = {};
    bookings.forEach((b) => {
      initialMap[b.id] = b.status;
    });
    setActiveStatuses(initialMap);
  }, [bookings]);

  async function handleStatusChange(id: string, nextStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        onUpdateBookingStatus(id, nextStatus);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  // Amortization Revenue matrices
  const stripePaidCount = bookings.filter((b) => b.paymentStatus.includes("Stripe Paid")).length;
  const simulatedRevenue = stripePaidCount * 500000;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800 bg-[#F8FAFC]">
      
      {/* Header section */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold font-mono tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full uppercase">
          DriveSphere Partner Console
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 text-slate-950">
          Enterprise Admin CRM
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mt-2 text-sm md:text-base">
          This secure administrative module monitors national reservation inflows, checks Stripe deposit balances, and updates localized delivery scheduling.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        <div className="bg-[#111827] text-white rounded-2xl p-5 border border-white/5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-mono uppercase block">Validated Stripe Cash flow</span>
            <strong className="text-xl md:text-2xl font-black text-[#3af584] block font-mono mt-1">
              PKR {simulatedRevenue.toLocaleString()}
            </strong>
          </div>
          <div className="text-[#3af584] bg-[#3af584]/10 p-2.5 rounded-xl font-mono text-xs font-bold">
            +{stripePaidCount} Deposits
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Delivery Pipelines</span>
            <strong className="text-xl md:text-2xl font-black text-slate-900 block font-mono mt-1">
              {bookings.length} Vehicles Reserved
            </strong>
          </div>
          <div className="text-[#0D7A43] bg-[#0D7A43]/10 px-2 py-1 rounded font-mono text-xs font-bold">
            3S Authorized
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Dealership Points verified</span>
            <strong className="text-xl md:text-2xl font-black text-slate-900 block font-mono mt-1">
              9 Locations
            </strong>
          </div>
          <button
            onClick={fetchLogs}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-all"
            title="Refresh Trace Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Reservation Slot Management CRM - Left */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-1o0 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2 text-slate-900">
            <h2 className="text-md font-bold uppercase tracking-wider font-mono text-slate-800">Corporate Customer Leads (BOOKINGS)</h2>
            <span className="text-[10px] font-mono text-slate-400">Total count: {bookings.length}</span>
          </div>

          <div className="space-y-4">
            {bookings.map((bk) => {
              const currentDealer = dealers.find((d) => d.id === bk.dealerId);
              return (
                <div
                  key={bk.id}
                  id={`admin-booking-card-${bk.id}`}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[#D4AF37] font-mono bg-slate-800 text-white px-2 py-0.5 rounded leading-none text-[10px]">
                        Ref: {bk.id}
                      </span>
                      <strong className="text-slate-900 block text-sm">{bk.vehicleName}</strong>
                    </div>

                    <p className="text-[11px] text-slate-600 italic">
                      Variant: <span className="font-semibold">{bk.variantName}</span> &bull; Color: <span className="font-mono">{bk.color.split(" (")[0]}</span>
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Client: <span className="font-bold">{bk.userName}</span> ({bk.userEmail}) &bull; Showroom: <span className="font-semibold text-slate-800">{currentDealer ? currentDealer.name : bk.dealerId}</span>
                    </p>

                    <div className="pt-1 select-none text-[10px] inline-flex items-center gap-1 opacity-70">
                      <span>Deposit Status:</span>
                      <strong className="text-[#0D7A43] font-mono">{bk.paymentStatus}</strong>
                    </div>
                  </div>

                  {/* Right Status updating mechanism */}
                  <div className="w-full md:w-auto bg-white border border-slate-200 p-2 rounded-xl flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <div>
                      <span className="text-[9px] block text-slate-400 uppercase font-mono font-bold">Resort Status</span>
                      <select
                        value={activeStatuses[bk.id] || bk.status}
                        onChange={(e) => handleStatusChange(bk.id, e.target.value)}
                        disabled={updatingId === bk.id}
                        className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none"
                      >
                        <option value="Pending">Pending Audit</option>
                        <option value="Confirmed">Confirmed reservation</option>
                        <option value="Documents Submitted">Documents Checked</option>
                        <option value="Ready for Delivery">Ready for Delivery</option>
                      </select>
                    </div>

                    {updatingId === bk.id && (
                      <span className="w-3.5 h-3.5 border-2 border-[#0D7A43] border-t-transparent rounded-full animate-spin"></span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Audit Logs System trails panel - Right */}
        <div className="lg:col-span-4 bg-[#111827] text-white rounded-3xl p-6 shadow-xl border border-white/5">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Database className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono">Real-Time Trace logs</h2>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto text-[10px] font-mono pr-1 leading-normal">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                <div className="flex justify-between text-[9px] text-[#D4AF37]">
                  <span className="truncate max-w-[150px]" title={log.user}>{log.user}</span>
                  <span className="text-gray-400">{log.timestamp.split(" ")[1] || log.timestamp}</span>
                </div>
                <p className="text-slate-100 font-sans font-medium text-[10.5px] leading-snug">{log.action}</p>
              </div>
            ))}

            {auditLogs.length === 0 && (
              <p className="text-[10px] italic text-gray-500 py-6 text-center">No trace signals detected.</p>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 select-none font-mono text-[9px] text-gray-400 flex items-center justify-between">
            <span>DATABASE: IN-MEMORY (RAM)</span>
            <span>SERVER INGRESS: PORT 3000</span>
          </div>

        </div>

      </div>
    </div>
  );
}
