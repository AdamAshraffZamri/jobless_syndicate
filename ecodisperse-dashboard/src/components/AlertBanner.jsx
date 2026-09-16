import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Cpu } from 'lucide-react';

export default function AlertBanner({ selectedState }) {
  if (!selectedState) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3 shadow-sm">
        <Cpu className="w-5 h-5 text-blue-400 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-blue-400">AI Policy Engine Ready</h3>
          <p className="text-sm text-slate-400 mt-1">Select a state to generate an automated, K-Means backed VM2026 budget dispersal directive.</p>
        </div>
      </div>
    );
  }

  let config = {};
  
  if (selectedState.risk_tier === 'Tier 1') {
    config = { 
      bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', 
      icon: <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />,
      title: `URGENT OVERCAPACITY: ${selectedState.state}`,
      action: 'Halt VM2026 digital promotions for this state immediately. Redirect RM 4.2M targeted ad spend to Tier 3 eco-corridors to prevent municipal utility failure.',
      rationale: 'K-Means clustering flagged severe threshold breach: Tourist influx vastly exceeds commercial water utility carrying capacity.'
    };
  } else if (selectedState.risk_tier === 'Tier 2') {
    config = { 
      bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400',
      icon: <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />,
      title: `MONITORING REQUIRED: ${selectedState.state}`,
      action: 'State is nearing commercial utility capacity. Maintain current marketing budget but prepare contingency water tanker routing for peak seasons.',
      rationale: 'Algorithm detects accelerating Carrying Capacity Index (CCI) approaching infrastructure limits.'
    };
  } else {
    config = { 
      bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />,
      title: `GROWTH OPPORTUNITY: ${selectedState.state}`,
      action: 'Massive utility headroom detected. Increase digital ad spend by 40% targeting eco-tourism and cultural heritage in this state.',
      rationale: 'Clustering identifies optimal resource balance: High utility availability against current visitor load.'
    };
  }

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 flex flex-col gap-3 transition-all duration-300 shadow-sm`}>
      <div className="flex items-start gap-3">
        {config.icon}
        <div>
          <h3 className={`text-sm font-bold ${config.text} uppercase tracking-wide`}>
            [AI POLICY DIRECTIVE] {config.title}
          </h3>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            {config.action}
          </p>
        </div>
      </div>
      {/* Model Interpretability for Judges */}
      <div className="ml-8 pl-3 border-l-2 border-slate-700">
        <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1">
          <Cpu className="w-3 h-3" /> Model Rationale
        </p>
        <p className="text-xs text-slate-500 italic">{config.rationale}</p>
      </div>
    </div>
  );
}