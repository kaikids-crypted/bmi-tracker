import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Calculator from './components/Calculator';
import Records from './components/Records';
import Statistics from './components/Statistics';
import About from './components/About';
import { ViewState, HealthRecord } from './types';
import { Activity, LayoutDashboard, Calculator as CalcIcon, Database, BarChart2, Info, Menu, X } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const handleSaveRecord = (record: Partial<HealthRecord>) => {
    fetchRecords();
    setTimeout(() => {
      setView('records');
    }, 1500);
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await fetch(`/api/records/${id}`, { method: 'DELETE' });
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const NavButton = ({ targetView, icon: Icon, label }: { targetView: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => { setView(targetView); setIsMobileMenuOpen(false); }}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium transition-all w-full text-left ${
        view === targetView 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={18} className={view === targetView ? 'text-blue-100' : 'text-slate-400'} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-200">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Activity size={20} />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">HealthTrack</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              <NavButton targetView="home" icon={LayoutDashboard} label="Dashboard" />
              <NavButton targetView="calculator" icon={CalcIcon} label="Calculator" />
              <NavButton targetView="records" icon={Database} label="Records" />
              <NavButton targetView="statistics" icon={BarChart2} label="Statistics" />
              <NavButton targetView="about" icon={Info} label="About" />
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-500 hover:text-slate-700 p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2 shadow-lg absolute w-full">
            <NavButton targetView="home" icon={LayoutDashboard} label="Dashboard" />
            <NavButton targetView="calculator" icon={CalcIcon} label="Calculator" />
            <NavButton targetView="records" icon={Database} label="Records" />
            <NavButton targetView="statistics" icon={BarChart2} label="Statistics" />
            <NavButton targetView="about" icon={Info} label="About" />
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'home' && <Home setView={setView} />}
        {view === 'calculator' && <Calculator onSave={handleSaveRecord} />}
        {view === 'records' && <Records records={records} onDelete={handleDeleteRecord} />}
        {view === 'statistics' && <Statistics records={records} />}
        {view === 'about' && <About />}
      </main>
    </div>
  );
}
