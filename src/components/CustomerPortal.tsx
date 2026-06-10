import React, { useState } from "react";
import { User, ClipboardList, ShieldAlert, Heart, Calendar, PlusCircle, Bookmark, Compass, Clock, CheckCircle } from "lucide-react";
import { Booking, ServiceAppointment, Dealer } from "../types";

interface CustomerPortalProps {
  user: { name: string; email: string; role: string } | null;
  bookings: Booking[];
  appointments: ServiceAppointment[];
  dealers: Dealer[];
  onAddAppointment: (appt: ServiceAppointment) => void;
}

export default function CustomerPortal({ user, bookings, appointments, dealers, onAddAppointment }: CustomerPortalProps) {
  // Saved vehicles state simulator
  const [savedVehicles, setSavedVehicles] = useState<Array<{ id: string; name: string; tag: string }>>([
    { id: "corolla-cross", name: "Corolla Cross Hybrid GR Sport", tag: "HEV SUV" },
    { id: "fortuner", name: "Fortuner Legender Premium 4x4", tag: "Diesel SUV" }
  ]);

  // Appointment scheduler states
  const [vehicleRegNo, setVehicleRegNo] = useState("");
  const [dealerId, setDealerId] = useState("");
  const [serviceType, setServiceType] = useState<"Maintenance" | "Periodic" | "Body & Paint" | "Express Maintenance">("Periodic");
  const [preferredDate, setPreferredDate] = useState("2026-06-15");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Filter appointments for active user
  const userAppointments = appointments;

  async function handleScheduleService(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicleRegNo || !dealerId || !preferredDate || !preferredTime) {
      alert("Please fill in basic vehicle registration and preferred slot details.");
      return;
    }

    setSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleRegNo, dealerId, serviceType, preferredDate, preferredTime, notes })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`SUCCESS! Appointment ${data.appointment.id} has been registered securely.`);
        onAddAppointment(data.appointment);
        // Clear Form inputs
        setVehicleRegNo("");
        setNotes("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function unsaveVehicle(id: string) {
    setSavedVehicles(savedVehicles.filter((v) => v.id !== id));
  }

  const preferredHours = [
    "09:00 AM", "10:30 AM", "11:00 AM", "12:30 PM", "02:00 PM", "03:30 PM", "04:30 PM"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800 bg-[#F8FAFC]">
      
      {/* Intro section */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold font-mono tracking-widest text-[#0D7A43] bg-[#0D7A43]/10 px-3 py-1.5 rounded-full uppercase">
          DriveSphere Customer Hub
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 text-slate-950">
          Your Executive Dashboard
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mt-2 text-sm md:text-base">
          Manage dynamic vehicle bookings, configure parts diagnostics schedules, and monitor service appointments interactively.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile and Bookmarked vehicles column - Left */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* User Profile Info */}
          <div className="bg-[#111827] text-white rounded-3xl p-5 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#0D7A43]/10 blur-2xl rounded-full"></div>
            
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] block mb-2">Authenticated Account</span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center font-bold text-lg text-[#D4AF37]">
                {user ? user.name.slice(0, 2).toUpperCase() : "AH"}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">{user ? user.name : "Ahmed Khan"}</h4>
                <span className="text-[10.5px] text-gray-400 font-mono block leading-none mt-0.5">{user ? user.email : "starpanther0@gmail.com"}</span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/5 text-[10.5px] text-gray-300">
              <span className="block italic mt-0.5">Status: Authorized Customer &bull; Standard loyalty category priority</span>
            </div>
          </div>

          {/* Saved bookmarks matching Saved Vehicles */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3.5 text-slate-900 border-b border-slate-100 pb-2">
              <Bookmark className="w-5 h-5 text-[#0D7A43]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Saved Vehicles & Specs Bookmarks ({savedVehicles.length})</h3>
            </div>

            <div className="space-y-3">
              {savedVehicles.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                  <div>
                    <strong className="text-xs text-slate-800 block">{v.name}</strong>
                    <span className="text-[9.5px] text-slate-400 font-mono italic">{v.tag}</span>
                  </div>
                  <button
                    onClick={() => unsaveVehicle(v.id)}
                    className="text-[10px] text-red-500 hover:underline"
                  >
                    Unsave
                  </button>
                </div>
              ))}

              {savedVehicles.length === 0 && (
                <p className="text-xs italic text-slate-400 text-center py-6">Your saved list is empty.</p>
              )}
            </div>
          </div>

          {/* Quick warranty panel tracker */}
          <div className="bg-yellow-50/70 border border-[#D4AF37]/30 rounded-3xl p-5">
            <span className="text-[9.5px] uppercase font-bold text-amber-700 tracking-wider font-mono block mb-1">Vehicle Warranty Tracker</span>
            <h4 className="text-xs font-bold text-slate-900">3 Years Standard Corporate Cover</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              DriveSphere certifies every local vehicle with **36 months / 100,000 KM** localized warranty. Includes hybrid battery dynamic covers exceeding **10 years**.
            </p>
          </div>

        </div>

        {/* Customer list views and scheduling forms center - Right */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Bookings (slot confirmation) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 text-slate-900">
              <ClipboardList className="w-5 h-5 text-[#0D7A43]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Your Active Vehicle Reservations ({bookings.length})</h3>
            </div>

            <div className="space-y-4">
              {bookings.map((bk) => (
                <div key={bk.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                  
                  {/* Title info */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded mr-1.5">
                        Ref: {bk.id}
                      </span>
                      <strong className="text-sm text-slate-900">{bk.vehicleName}</strong>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      bk.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700 font-medium"
                    }`}>
                      {bk.status}
                    </span>
                  </div>

                  {/* Summary details list */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10.5px] text-slate-600">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Selected Variant</span>
                      <span className="font-semibold text-slate-800 truncate block">{bk.variantName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Shed Color</span>
                      <span className="font-semibold text-slate-800">{bk.color.split(" (")[0]}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Deposit Account Status</span>
                      <span className="font-semibold font-mono text-[#0D7A43]">{bk.paymentStatus}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Booking Date</span>
                      <span className="font-semibold text-slate-800">{bk.date}</span>
                    </div>
                  </div>

                </div>
              ))}

              {bookings.length === 0 && (
                <p className="text-xs italic text-slate-400 text-center py-6">No active reservations slot detected on this authenticated profile.</p>
              )}
            </div>
          </div>

          {/* Routines Service Appointments Scheduler Form */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Form list side */}
            <div className="md:col-span-7 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-900">
                <PlusCircle className="w-5 h-5 text-[#0D7A43]" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Schedule 3S Routine Maintenance</h3>
              </div>

              <form onSubmit={handleScheduleService} className="space-y-3.5 text-xs">
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle registration No.</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BKL-202X"
                      value={vehicleRegNo}
                      onChange={(e) => setVehicleRegNo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Dealer Showroom</label>
                    <select
                      required
                      value={dealerId}
                      onChange={(e) => setDealerId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                    >
                      <option value="">-- Choose Hub --</option>
                      {dealers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Task Type Category</label>
                    <select
                      value={serviceType}
                      onChange={(e: any) => setServiceType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                    >
                      <option value="Periodic">Periodic Lubricants Check</option>
                      <option value="Maintenance">General Engine Tuning</option>
                      <option value="Express Maintenance">Express Maintenance (60 mins)</option>
                      <option value="Body & Paint">Body denting & paintover</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Time Hours</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                      required
                    >
                      <option value="">-- Choose Slot --</option>
                      {preferredHours.map((hr) => (
                        <option key={hr} value={hr}>{hr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Preferred appointment Date</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Custom instructions for mechanics</label>
                  <textarea
                    placeholder="e.g. Please carry out 10,000 KM lubricants change..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                    rows={2}
                  />
                </div>

                {successMsg && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 font-sans">
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#0D7A43] hover:bg-[#07532d] text-white font-bold rounded-xl tracking-wider transition-all"
                >
                  {submitting ? "SCHEDULING WORKFLOW..." : "CONFIRM SERVICE SLOT"}
                </button>

              </form>
            </div>

            {/* Existing Scheduled Appointments List side */}
            <div className="md:col-span-5 bg-[#111827] text-white rounded-3xl p-5 border border-white/5 h-full">
              <div className="flex items-center gap-2 mb-3.5">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Schedules logs ({userAppointments.length})</h3>
              </div>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto text-[10.5px]">
                {userAppointments.map((appt) => (
                  <div key={appt.id} className="bg-white/5 border border-white/10 rounded-xl p-3 relative">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-[#D4AF37] font-mono whitespace-nowrap">{appt.id}</span>
                      <span className="text-[9px] bg-[#0D7A43]/30 text-[#2ae574] font-bold px-1.5 py-0.5 rounded uppercase font-sans">
                        {appt.status}
                      </span>
                    </div>

                    <p className="font-bold text-slate-200">{appt.serviceType}</p>
                    <p className="text-gray-400 mt-1 font-mono leading-none">
                      Date: {appt.preferredDate} &bull; Time: {appt.preferredTime}
                    </p>
                    <p className="text-gray-400 mt-0.5 block truncate">Vehicle Reg: {appt.vehicleRegNo}</p>
                    {appt.notes && (
                      <p className="text-[10px] text-slate-400 font-sans italic mt-1.5 border-t border-white/5 pt-1.5 line-clamp-2">
                        Notes: {appt.notes}
                      </p>
                    )}
                  </div>
                ))}

                {userAppointments.length === 0 && (
                  <p className="text-xs italic text-slate-400 py-6 text-center">No service scheduled.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
