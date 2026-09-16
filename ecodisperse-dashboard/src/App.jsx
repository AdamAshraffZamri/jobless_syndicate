import React, { useState, useMemo } from 'react';
import { Activity, Map as MapIcon, BarChart3, ArrowRight } from 'lucide-react';
import clusterData from './data/clusterData.json';
import MapContainer from './components/MapContainer';
import AlertBanner from './components/AlertBanner';
import StateDetailPane from './components/StateDetailPane';

export default function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [activeTab, setActiveTab] = useState('map');

  const globalKPIs = useMemo(() => {
    const totalVis = clusterData.reduce((acc, curr) => acc + curr.total_visitor_load, 0);
    const avgStrain = clusterData.reduce((acc, curr) => acc + curr.strain_index, 0) / clusterData.length;
    const criticalStates = clusterData.filter(c => c.risk_tier === 'Tier 1').length;
    return { totalVis, avgStrain, criticalStates };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] font-sans text-slate-300">
      
      <header className="bg-[#111827] border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="text-blue-500 w-6 h-6" />
            <h1 className="text-xl font-bold text-white tracking-tight">EcoDisperse AI <span className="text-slate-500 font-normal text-sm ml-2">— DOSM VM2026 Capacity Monitor</span></h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 h-[calc(100vh-88px)] flex flex-col">
        
        {/* Global KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
          <div className="bg-[#1F2937] border border-slate-700 rounded-lg p-4 shadow-lg">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total National Visitors</p>
            <p className="text-3xl font-black text-blue-400">{(globalKPIs.totalVis / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-[#1F2937] border border-slate-700 rounded-lg p-4 shadow-lg">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Avg National Strain</p>
            <p className="text-3xl font-black text-amber-400">{globalKPIs.avgStrain.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
          </div>
          <div className="bg-[#1F2937] border border-slate-700 rounded-lg p-4 shadow-lg">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Tier 1 Critical States</p>
            <p className="text-3xl font-black text-red-500">{globalKPIs.criticalStates}</p>
          </div>
          <div className="bg-[#1F2937] border border-slate-700 rounded-lg p-4 shadow-lg">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Target AI Model</p>
            <p className="text-3xl font-black text-emerald-400">K-Means</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-6 gap-6 shrink-0">
          <button onClick={() => setActiveTab('map')} className={`pb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'map' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
            <MapIcon className="w-4 h-4" /> Spatial Risk Map
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`pb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'analytics' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
            <BarChart3 className="w-4 h-4" /> Advanced Diagnostics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 animate-in fade-in">
            <section className="lg:col-span-2 bg-[#111827] rounded-xl border border-slate-800 shadow-xl overflow-hidden p-2">
              <MapContainer data={clusterData} onStateClick={setSelectedState} />
            </section>
            
            <aside className="bg-[#111827] rounded-xl border border-slate-800 shadow-xl p-4 flex flex-col h-full overflow-hidden">
              <div className="mb-4 shrink-0">
                <AlertBanner selectedState={selectedState} />
              </div>
              
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
                  Full Territory Directory
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
                  {clusterData.map((item) => (
                    <div
                      key={item.state}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        selectedState?.state === item.state
                          ? 'bg-slate-800 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                          : 'bg-[#1F2937] border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setSelectedState(item)}
                      >
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.state}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Strain: {item.strain_index.toLocaleString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-black text-white ${
                          item.risk_tier === 'Tier 1' ? 'bg-red-500' :
                          item.risk_tier === 'Tier 2' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}>
                          {item.risk_tier}
                        </span>
                      </div>
                      
                      {/* The Auto-Switch Analytics Button */}
                      {selectedState?.state === item.state && (
                        <button 
                          onClick={() => setActiveTab('analytics')}
                          className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-md transition-colors"
                        >
                          View Diagnostics <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="flex-1 min-h-0 animate-in fade-in overflow-y-auto pb-10">
             <StateDetailPane selectedState={selectedState} allData={clusterData} />
          </div>
        )}
      </main>
    </div>
  );
}