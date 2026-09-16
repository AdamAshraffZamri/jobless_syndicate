import React, { useMemo } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, CartesianGrid,
  ComposedChart, Bar, Line, Legend 
} from 'recharts';
import { Activity } from 'lucide-react';

// 1. We import the real dataset you just created
import masterData from '../data/masterData.json'; 

export default function StateDetailPane({ selectedState, allData }) {
  if (!selectedState) {
    return (
      <div className="h-64 bg-[#111827] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Activity className="w-12 h-12 opacity-20" />
        <p className="text-sm font-medium">Please select a state from the Spatial Risk Map first.</p>
      </div>
    );
  }

  const getTierColor = (tier) => {
    if (tier === 'Tier 1') return '#ef4444'; // Red
    if (tier === 'Tier 2') return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  // Prepare data for the Scatter Plot (All States - K-Means Clustering View)
  const scatterData = allData.map(d => ({
    name: d.state,
    visitors: d.total_visitor_load / 1000000, // Millions
    water: d.avg_water_demand,
    tier: d.risk_tier
  }));

  // 2. TRUE DATA INJECTION: Filter masterData for the clicked state
  const stateHistoricalData = useMemo(() => {
    return masterData
      .filter(row => row.state === selectedState.state)
      .map(row => ({
        name: row.year.toString(),
        Domestic: row.domestic_visitors,
        International: row.international_visitors,
        Strain: row.strain_index
      }));
  }, [selectedState]);

  return (
    <div className="space-y-6">
      
      {/* State Header Banner */}
      <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white">{selectedState.state} <span className="text-slate-500 font-normal text-lg ml-2">Capacity Profile</span></h2>
          <p className="text-sm text-slate-400 mt-1">Cross-referencing DOSM domestic arrivals, international inflows, and commercial water utilities.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Risk Classification</p>
          <span className="px-4 py-2 rounded text-sm font-black text-white" style={{ backgroundColor: getTierColor(selectedState.risk_tier) }}>
            {selectedState.risk_tier}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: The Strain Matrix (Scatter Plot) */}
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 shadow-xl h-96 flex flex-col">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">National Strain Matrix (Clustering View)</h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" dataKey="visitors" name="Visitors (M)" stroke="#94a3b8" label={{ value: 'Total Visitors (Millions)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} />
                <YAxis type="number" dataKey="water" name="Water (Gal)" stroke="#94a3b8" label={{ value: 'Water Demand (Gal)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{strokeDasharray: '3 3'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Scatter name="States" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getTierColor(entry.tier)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: True Historical Load vs Strain Trend (Composed Chart) */}
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 shadow-xl h-96 flex flex-col">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Load Composition vs. Infrastructure Strain (2020-2022)</h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              {/* 3. Render the true stateHistoricalData here */}
              <ComposedChart data={stateHistoricalData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#94a3b8" tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                <RechartsTooltip formatter={(val, name) => [val.toLocaleString(), name]} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                
                <Bar yAxisId="left" dataKey="Domestic" stackId="a" fill="#3b82f6" name="Domestic Arrivals" />
                <Bar yAxisId="left" dataKey="International" stackId="a" fill="#8b5cf6" name="Intl Arrivals" />
                <Line yAxisId="right" type="monotone" dataKey="Strain" stroke="#f43f5e" strokeWidth={3} name="Strain Index Trajectory" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}