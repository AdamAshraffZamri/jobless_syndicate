import { useMemo, useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, CartesianGrid,
  ComposedChart, Bar, Line, Legend 
} from 'recharts';
import { Database } from 'lucide-react';
import masterData from '../data/masterData.json'; 

export default function StateDetailPane({ selectedState, allData, onStateChange }) {
  
  // Local state for the Scatterplot Filters
  const [scatterYear, setScatterYear] = useState('All');
  const [scatterState, setScatterState] = useState('All');

  const getTierColor = (tier) => {
    if (tier === 'Tier 1') return '#ef4444'; // Red
    if (tier === 'Tier 2') return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  // 1. Prepare dynamic data for Scatter Plot based on User Filters
  const filteredScatterData = useMemo(() => {
    let raw = masterData;
    if (scatterYear !== 'All') raw = raw.filter(d => d.year.toString() === scatterYear);
    if (scatterState !== 'All') raw = raw.filter(d => d.state === scatterState);

    return raw.map(d => {
      // Find the cluster tier for coloring
      const clusterInfo = allData.find(c => c.state === d.state);
      return {
        name: d.state,
        year: d.year,
        visitors: d.total_visitors / 1000000, // Format to Millions
        water: d.water_demand,
        tier: clusterInfo ? clusterInfo.risk_tier : 'Tier 3'
      };
    });
  }, [scatterYear, scatterState, allData]);

  // 2. Prepare data for the Bar/Line Chart based on active state dropdown
  const stateHistoricalData = useMemo(() => {
    if (!selectedState) return [];
    return masterData
      .filter(row => row.state === selectedState.state)
      .map(row => ({
        name: row.year.toString(),
        Domestic: row.domestic_visitors,
        International: row.international_visitors,
        Strain: row.strain_index
      }));
  }, [selectedState]);

  if (!selectedState) {
    return (
      <div className="h-64 bg-[#111827] border border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Database className="w-12 h-12 opacity-20" />
        <p className="text-sm font-medium">Please select a state to view advanced analytics.</p>
        
        {/* State Dropdown Fallback if none selected */}
        <select 
          onChange={(e) => {
            const newState = allData.find(d => d.state === e.target.value);
            onStateChange(newState);
          }}
          className="mt-4 bg-[#1F2937] text-white border border-slate-700 rounded px-4 py-2"
        >
          <option value="" disabled selected>Select a State...</option>
          {allData.map(d => <option key={d.state} value={d.state}>{d.state}</option>)}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* State Selection Dropdown & Header */}
      <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-4 mb-1">
            <h2 className="text-3xl font-black text-white">{selectedState.state}</h2>
            {/* The direct state switcher dropdown */}
            <select 
              value={selectedState.state}
              onChange={(e) => {
                const newState = allData.find(d => d.state === e.target.value);
                onStateChange(newState);
              }}
              className="bg-[#1F2937] text-sm text-white border border-slate-700 rounded px-3 py-1 outline-none focus:border-blue-500"
            >
              {allData.map(d => <option key={d.state} value={d.state}>{d.state}</option>)}
            </select>
          </div>
          <p className="text-sm text-slate-400">Cross-referencing DOSM domestic arrivals, international inflows, and commercial water utilities.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Risk Classification</p>
          <span className="px-4 py-2 rounded text-sm font-black text-white" style={{ backgroundColor: getTierColor(selectedState.risk_tier) }}>
            {selectedState.risk_tier}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: The Capacity Matrix (Scatter Plot) with Filters */}
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 shadow-xl h-96 flex flex-col">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">National Capacity Matrix</h4>
            
            {/* Filter Controls for Scatterplot */}
            <div className="flex gap-2">
              <select 
                value={scatterYear} 
                onChange={e => setScatterYear(e.target.value)}
                className="bg-[#1F2937] text-xs text-white border border-slate-700 rounded px-2 py-1"
              >
                <option value="All">All Years</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
              </select>
              <select 
                value={scatterState} 
                onChange={e => setScatterState(e.target.value)}
                className="bg-[#1F2937] text-xs text-white border border-slate-700 rounded px-2 py-1"
              >
                <option value="All">All States</option>
                {allData.map(d => <option key={d.state} value={d.state}>{d.state}</option>)}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" dataKey="visitors" name="Visitors (M)" stroke="#94a3b8" label={{ value: 'Total Visitors (Millions)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} />
                <YAxis type="number" dataKey="water" name="Water (MLD)" stroke="#94a3b8" label={{ value: 'Water Demand (MLD)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{strokeDasharray: '3 3'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                  formatter={(value, name) => {
                    if(name === 'Visitors (M)') return [`${value.toFixed(2)}M`, 'Total Visitors'];
                    return [`${value} MLD`, 'Water Demand'];
                  }}
                />
                <Scatter name="States" data={filteredScatterData}>
                  {filteredScatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getTierColor(entry.tier)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: True Historical Load vs Strain Trend (Composed Chart) */}
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 shadow-xl h-96 flex flex-col">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Load Composition vs. Capacity Index (2020-2022)</h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stateHistoricalData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#94a3b8" tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                <RechartsTooltip formatter={(val, name) => [val.toLocaleString(), name]} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                
                <Bar yAxisId="left" dataKey="Domestic" stackId="a" fill="#3b82f6" name="Domestic Arrivals" />
                <Bar yAxisId="left" dataKey="International" stackId="a" fill="#8b5cf6" name="Intl Arrivals" />
                <Line yAxisId="right" type="monotone" dataKey="Strain" stroke="#f43f5e" strokeWidth={3} name="Capacity Index (CCI)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}