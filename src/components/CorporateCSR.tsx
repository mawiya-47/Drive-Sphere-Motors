import React from "react";
import { Info, ShieldAlert, Award, HelpingHand, Calendar, Globe, Leaf, ArrowUpRight } from "lucide-react";
import { NewsArticle } from "../types";

interface CorporateCSRProps {
  articles: NewsArticle[];
  projects: Array<{ id: string; title: string; metric: string; status: string }>;
}

export default function CorporateCSR({ articles, projects }: CorporateCSRProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800 bg-[#F8FAFC]">
      
      {/* Intro section resembling Toyota Indus Eco corporate design */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold font-mono tracking-widest text-[#0D7A43] bg-[#0D7A43]/10 px-3 py-1.5 rounded-full uppercase">
          DriveSphere Legacy & Care
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 text-slate-950">
          Sustainability & ESG Objectives
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mt-2 text-sm md:text-base">
          Our environment footprint and social assistance programs are deeply integrated within Indus Indus ecosystem projects, restoring ecosystem balance.
        </p>
      </div>

      {/* CSR Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-3xl p-5 border border-slate-150 shadow-sm relative overflow-hidden flex flex-col justify-between h-40 group hover:shadow-md transition-all"
          >
            <div className="absolute top-2 right-2 p-1 bg-[#0D7A43]/10 text-[#0D7A43] rounded-full">
              <Leaf className="w-4 h-4" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider leading-none">Indus Target Campaign</span>
              <h3 className="text-sm font-extrabold text-slate-800 mt-1 leading-tight">{proj.title}</h3>
            </div>

            <div>
              <span className="text-lg font-black text-[#0D7A43] block mt-2 font-mono">{proj.metric}</span>
              <span className="text-[10px] text-yellow-700 bg-amber-50 px-2 py-0.5 rounded font-mono font-medium">
                {proj.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* News & Press Feed - Left */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-[#0D7A43]" />
            <h2 className="text-xl font-bold text-slate-950 tracking-tight">Showroom Press & Corporate News</h2>
          </div>

          <div className="space-y-6">
            {articles.map((art) => (
              <div
                key={art.id}
                id={`news-item-${art.id}`}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-12 gap-4"
              >
                {/* Photo placeholder if available */}
                <div className="md:col-span-4 h-40 bg-slate-100 rounded-2xl overflow-hidden relative">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all"
                  />
                  <span className="absolute top-2 left-2 bg-slate-950/80 text-[#D4AF37] text-[9.5px] font-mono px-2 py-0.5 rounded">
                    {art.category}
                  </span>
                </div>

                {/* News details */}
                <div className="md:col-span-8 flex flex-col justify-between">
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-mono block">Published: {art.date}</span>
                    <h3 className="text-md font-bold text-slate-900 mt-1 leading-snug">{art.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 font-sans font-medium line-clamp-2">{art.summary}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 text-[11px] text-slate-600 leading-relaxed font-sans font-medium">
                    {art.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Corporate careers & green roadmap details - Right */}
        <div className="lg:col-span-4 space-y-6 bg-white rounded-3xl p-6 border border-slate-150 shadow-sm">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#0D7A43] block uppercase mb-1">Corporate Careers Hub</span>
            <h3 className="text-md font-extrabold text-slate-950">Join Indus DriveSphere Network</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              We look for passionate engineers, digital technicians, and customer service experts to lead the sustainable transport revolution across PK assembly facilities.
            </p>
            
            <button
              onClick={() => alert("Current vacancy positions: 1. Hybrid Inverter Assembly Specialist (Port Qasim) - 2. Senior Diagnostics Technician (Lahore Workshop) - 3. Digital CRM Coordinator (Karachi). Please forward portfolios to: careers@drivesphere.com.pk")}
              className="mt-3.5 w-full py-2.5 bg-slate-100 hover:bg-[#0D7A43]/10 hover:text-[#0D7A43] text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <span>View Open Vacancies</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">Our Environmental Charter</h4>
            <ul className="text-xs text-slate-600 space-y-2.5">
              <li className="flex items-start gap-2">
                <Leaf className="w-4 h-4 text-[#0D7A43] shrink-0 mt-0.5" />
                <span>**Zero Carbon Footprint Manufacturing**: Minimizing liquid waste discharge near Clifton.</span>
              </li>
              <li className="flex items-start gap-2">
                <Leaf className="w-4 h-4 text-[#0D7A43] shrink-0 mt-0.5" />
                <span>**Hybrid Localization**: Transferring core inverter assembly mechanics to Pakistani engineers.</span>
              </li>
              <li className="flex items-start gap-2">
                <Leaf className="w-4 h-4 text-[#0D7A43] shrink-0 mt-0.5" />
                <span>**Battery Recyclability Guarantee**: All retired HEV nickel units undergo green recycling.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
