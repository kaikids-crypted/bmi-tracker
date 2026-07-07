import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HealthRecord } from '../types';
import { Calculator, TrendingDown, TrendingUp, Users } from 'lucide-react';

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444'];

export default function Statistics({ records }: { records: HealthRecord[] }) {
  const stats = useMemo(() => {
    if (!records.length) return null;
    
    let sumBMI = 0;
    let highest = -Infinity;
    let lowest = Infinity;
    
    const catCounts = {
      'Underweight': 0,
      'Normal': 0,
      'Overweight': 0,
      'Obese': 0
    };

    records.forEach(r => {
      sumBMI += r.bmi;
      if (r.bmi > highest) highest = r.bmi;
      if (r.bmi < lowest) lowest = r.bmi;
      
      if (catCounts[r.category as keyof typeof catCounts] !== undefined) {
        catCounts[r.category as keyof typeof catCounts]++;
      }
    });

    const pieData = Object.entries(catCounts)
      .map(([name, value]) => ({ name, value }))
      .filter(d => d.value > 0);

    const avgBMI = (sumBMI / records.length).toFixed(2);

    return { avgBMI, highest, lowest, pieData };
  }, [records]);

  if (!records.length || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm animate-in fade-in">
        <Calculator size={48} className="mb-4 opacity-20" />
        <p>No data available. Add records to see statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Health Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 mb-2 text-sm font-medium">
            <Users size={16} className="text-blue-500"/> Total Records
          </div>
          <p className="text-3xl font-bold text-slate-800">{records.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 mb-2 text-sm font-medium">
            <Calculator size={16} className="text-slate-500"/> Average BMI
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.avgBMI}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 mb-2 text-sm font-medium">
            <TrendingUp size={16} className="text-red-500"/> Highest BMI
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.highest}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 mb-2 text-sm font-medium">
            <TrendingDown size={16} className="text-blue-500"/> Lowest BMI
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.lowest}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Category Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent BMI Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={records.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }}/>
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                <Bar dataKey="bmi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
