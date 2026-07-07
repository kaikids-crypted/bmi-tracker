import React, { useState, useMemo } from 'react';
import { Search, Download, Trash2, Calendar, User, Activity, Edit2 } from 'lucide-react';
import { HealthRecord } from '../types';

export default function Records({ 
  records, 
  onDelete 
}: { 
  records: HealthRecord[], 
  onDelete: (id: string) => void 
}) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof HealthRecord>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredAndSorted = useMemo(() => {
    return records
      .filter(r => 
        (filterCategory === 'All' || r.category === filterCategory) &&
        (r.name.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [records, search, sortField, sortOrder, filterCategory]);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "health_records.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Normal': return 'bg-green-100 text-green-700 border-green-200';
      case 'Underweight': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Overweight': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Obese': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Health Records</h2>
        <button onClick={exportJSON} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors">
          <Download size={16} /> Export JSON
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={filterCategory} 
            onChange={e => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm"
          >
            <option value="All">All Categories</option>
            <option value="Underweight">Underweight</option>
            <option value="Normal">Normal</option>
            <option value="Overweight">Overweight</option>
            <option value="Obese">Obese</option>
          </select>
          <select 
            value={sortField} 
            onChange={e => setSortField(e.target.value as any)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="bmi">Sort by BMI</option>
            <option value="age">Sort by Age</option>
          </select>
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-sm font-medium text-slate-600"
          >
            {sortOrder === 'asc' ? 'Asc↑' : 'Desc↓'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSorted.map(record => (
          <div key={record.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg text-slate-800">{record.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <Calendar size={12} /> {record.date} at {record.time}
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(record.category)}`}>
                {record.category}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-xs text-slate-500 font-medium">BMI</p>
                <p className="text-xl font-bold text-slate-800">{record.bmi}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Profile</p>
                <p className="text-sm font-medium text-slate-700">{record.age}y • {record.gender}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Weight</p>
                <p className="text-sm font-medium text-slate-700">{record.weight} kg</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Height</p>
                <p className="text-sm font-medium text-slate-700">{record.height} m</p>
              </div>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => onDelete(record.id)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {filteredAndSorted.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 border-dashed">
            <Activity size={48} className="mx-auto mb-4 opacity-20" />
            <p>No records found. Try adjusting your filters or add a new record.</p>
          </div>
        )}
      </div>
    </div>
  );
}
