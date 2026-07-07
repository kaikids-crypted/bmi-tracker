import React from 'react';
import { Info, CheckCircle2, AlertTriangle, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-4">About BMI</h2>
        <p className="text-slate-600 leading-relaxed mb-6">
          Body Mass Index (BMI) is a simple index of weight-for-height that is commonly used to classify 
          underweight, overweight and obesity in adults. It is defined as the weight in kilograms divided 
          by the square of the height in metres (kg/m²).
        </p>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-center mb-8">
          <span className="text-slate-500">Formula:</span> <span className="text-lg font-bold text-slate-800">BMI = weight (kg) / [height (m)]²</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" /> Advantages
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Simple to calculate</li>
              <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Non-invasive screening method</li>
              <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Useful for general population tracking</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" /> Limitations
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Does not distinguish between fat and muscle</li>
              <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> May not be accurate for athletes or elderly</li>
              <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Doesn't account for bone density</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-xl text-white">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Heart className="text-red-400" /> Healthy Lifestyle Advice
        </h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Maintaining a healthy weight is important for heart health and overall well-being.
          Combine a balanced diet rich in fruits, vegetables, and lean proteins with regular 
          physical activity. Aim for at least 150 minutes of moderate aerobic activity per week.
        </p>
        <p className="text-slate-400 text-sm">
          * Please consult with a healthcare provider before starting any new diet or exercise regimen.
        </p>
      </div>
    </div>
  );
}
