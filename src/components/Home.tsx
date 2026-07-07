import React from 'react';
import { Activity, ArrowRight, HeartPulse, ShieldCheck, FileBarChart } from 'lucide-react';
import { ViewState } from '../types';

export default function Home({ setView }: { setView: (view: ViewState) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-blue-600 to-green-500 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Activity size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Modern Health & BMI Tracker</h1>
          <p className="text-blue-50 text-lg mb-8 leading-relaxed">
            Monitor your body mass index and track your health metrics over time.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setView('calculator')}
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              Calculate BMI <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => setView('records')}
              className="bg-blue-700/30 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700/40 transition-colors backdrop-blur-sm border border-white/20"
            >
              View Records
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <HeartPulse size={24} />
          </div>
          <h3 className="font-semibold text-slate-800 text-lg mb-2">Track Health</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Log your vital stats and keep a secure digital record of your body metrics over time.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
            <FileBarChart size={24} />
          </div>
          <h3 className="font-semibold text-slate-800 text-lg mb-2">Analyze Trends</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            View detailed statistics, charts, and distribution metrics of your historical data.
          </p>
        </div>
      </div>
    </div>
  );
}
