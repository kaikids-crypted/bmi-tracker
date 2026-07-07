import React, { useState } from 'react';
import { Save, RefreshCw, Info } from 'lucide-react';
import { HealthRecord } from '../types';

export default function Calculator({ 
  onSave 
}: { 
  onSave: (record: Partial<HealthRecord>) => void 
}) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');

  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [weightKg, setWeightKg] = useState('');
  const [weightLbs, setWeightLbs] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [calculatedRecord, setCalculatedRecord] = useState<HealthRecord | null>(null);

  const calculate = async () => {
    setError('');
    
    if (!name.trim()) return setError('Please enter a name.');
    if (!age || Number(age) <= 0) return setError('Please enter a valid age.');

    let heightInMeters = 0;
    if (heightUnit === 'cm') {
      if (!heightCm || Number(heightCm) <= 0) return setError('Please enter a valid height.');
      heightInMeters = Number(heightCm) / 100;
    } else {
      if (!heightFt && !heightIn) return setError('Please enter a valid height.');
      const ft = Number(heightFt) || 0;
      const inch = Number(heightIn) || 0;
      heightInMeters = (ft * 0.3048) + (inch * 0.0254);
      if (heightInMeters <= 0) return setError('Please enter a valid height.');
    }

    let weightInKg = 0;
    if (weightUnit === 'kg') {
      if (!weightKg || Number(weightKg) <= 0) return setError('Please enter a valid weight.');
      weightInKg = Number(weightKg);
    } else {
      if (!weightLbs || Number(weightLbs) <= 0) return setError('Please enter a valid weight.');
      weightInKg = Number(weightLbs) * 0.453592;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          age: Number(age),
          gender,
          height: heightInMeters,
          weight: weightInKg
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      
      setCalculatedRecord(data);
      onSave(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setName(''); setAge(''); setGender('Male');
    setHeightCm(''); setHeightFt(''); setHeightIn('');
    setWeightKg(''); setWeightLbs('');
    setCalculatedRecord(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <RefreshCw size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">BMI Calculator</h2>
            <p className="text-slate-500 text-sm">Enter your details to calculate and save your BMI</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100">
            <Info size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="e.g. Jane Doe"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
                <input type="number" min="1" value={age} onChange={e => setAge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-700">Height</label>
                <select value={heightUnit} onChange={e => setHeightUnit(e.target.value as any)}
                  className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium outline-none"
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft / in</option>
                </select>
              </div>
              {heightUnit === 'cm' ? (
                <input type="number" min="1" value={heightCm} onChange={e => setHeightCm(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Centimeters"
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" min="1" value={heightFt} onChange={e => setHeightFt(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Feet"
                  />
                  <input type="number" min="0" value={heightIn} onChange={e => setHeightIn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Inches"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-700">Weight</label>
                <select value={weightUnit} onChange={e => setWeightUnit(e.target.value as any)}
                  className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
              {weightUnit === 'kg' ? (
                <input type="number" min="1" value={weightKg} onChange={e => setWeightKg(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Kilograms"
                />
              ) : (
                <input type="number" min="1" value={weightLbs} onChange={e => setWeightLbs(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Pounds"
                />
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={calculate} disabled={loading}
                className="flex-1 bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Calculating...' : <><Save size={18} /> Calculate & Save</>}
              </button>
              <button onClick={reset}
                className="px-6 py-3 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
            {calculatedRecord ? (
              <div className="text-center animate-in zoom-in-95 duration-300">
                <p className="text-slate-500 font-medium uppercase tracking-wider text-xs mb-2">Your BMI</p>
                <h3 className="text-6xl font-bold text-slate-800 tracking-tighter mb-4">{calculatedRecord.bmi}</h3>
                
                <div className={`inline-flex px-4 py-1.5 rounded-full font-medium text-sm mb-6 ${
                  calculatedRecord.category === 'Normal' ? 'bg-green-100 text-green-700' :
                  calculatedRecord.category === 'Underweight' ? 'bg-blue-100 text-blue-700' :
                  calculatedRecord.category === 'Overweight' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {calculatedRecord.category}
                </div>

                <div className="text-left space-y-3 bg-white p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Name</span>
                    <span className="font-medium text-slate-800">{calculatedRecord.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date Logged</span>
                    <span className="font-medium text-slate-800">{calculatedRecord.date} {calculatedRecord.time}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <RefreshCw size={48} className="mx-auto mb-4 opacity-20" />
                <p>Fill out the form and calculate your BMI to see results here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
