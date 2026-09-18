import { useState, useMemo } from 'react';
import { Map as MapIcon, BarChart3, Info, Download, Database } from 'lucide-react';
import clusterData from './data/clusterData.json';
import MapContainer from './components/MapContainer';
import StateDetailPane from './components/StateDetailPane';

export default function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [activeTab, setActiveTab] = useState('map'); 

  const globalKPIs = useMemo(() => {
    const totalVis = clusterData.reduce((acc, curr) => acc + curr.total_visitor_load, 0);
    const avgStrain = clusterData.reduce((acc, curr) => acc + curr.strain_index, 0) / clusterData.length;
    const tier1 = clusterData.filter(c => c.risk_tier === 'Tier 1').length;
    const tier2 = clusterData.filter(c => c.risk_tier === 'Tier 2').length;
    const tier3 = clusterData.filter(c => c.risk_tier === 'Tier 3').length;
    return { totalVis, avgStrain, tier1, tier2, tier3 };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] print:bg-white font-sans text-slate-300 print:text-slate-900">
      
      <header className="bg-[#111827] print:bg-white border-b border-slate-800 print:border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="text-blue-500 w-6 h-6 print:text-blue-700" />
            <h1 className="text-xl font-bold text-white print:text-black tracking-tight">
              EcoDisperse <span className="text-slate-500 print:text-slate-600 font-normal text-sm ml-2">— VM2026 Carrying Capacity Monitor</span>
            </h1>
          </div>
          <button 
            onClick={() => window.print()}
            className="print:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 min-h-[calc(100vh-88px)] print:h-auto flex flex-col">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 shrink-0 print:grid-cols-3">
          <div className="bg-[#1F2937] print:bg-slate-50 border border-slate-700 print:border-slate-300 rounded-lg p-4 shadow-lg print:shadow-none">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total National Visitors</p>
            <p className="text-2xl font-black text-blue-400">{(globalKPIs.totalVis / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-[#1F2937] print:bg-slate-50 border border-slate-700 print:border-slate-300 rounded-lg p-4 shadow-lg print:shadow-none">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Avg Capacity Index</p>
            <p className="text-2xl font-black text-blue-400">{globalKPIs.avgStrain.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
          </div>
          <div className="bg-[#1F2937] print:bg-slate-50 border border-slate-700 print:border-slate-300 rounded-lg p-4 shadow-lg print:shadow-none">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tier 1 States (Critical)</p>
            <p className="text-2xl font-black text-red-500">{globalKPIs.tier1}</p>
          </div>
          <div className="bg-[#1F2937] print:bg-slate-50 border border-slate-700 print:border-slate-300 rounded-lg p-4 shadow-lg print:shadow-none print:hidden">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tier 2 States (Monitor)</p>
            <p className="text-2xl font-black text-amber-500">{globalKPIs.tier2}</p>
          </div>
          <div className="bg-[#1F2937] print:bg-slate-50 border border-slate-700 print:border-slate-300 rounded-lg p-4 shadow-lg print:shadow-none print:hidden">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tier 3 States (Growth)</p>
            <p className="text-2xl font-black text-emerald-500">{globalKPIs.tier3}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-6 gap-6 shrink-0 print:hidden">
          <button onClick={() => setActiveTab('map')} className={`pb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'map' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
            <MapIcon className="w-4 h-4" /> Spatial Risk Map
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`pb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'analytics' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
            <BarChart3 className="w-4 h-4" /> Advanced Diagnostics
          </button>
          <button onClick={() => setActiveTab('info')} className={`pb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'info' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
            <Info className="w-4 h-4" /> Methodology & Data
          </button>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 print:block print:h-auto animate-in fade-in">
            <section className="lg:col-span-2 bg-[#111827] rounded-xl border border-slate-800 shadow-xl overflow-hidden p-2 print:mb-6">
              <MapContainer data={clusterData} onStateClick={setSelectedState} />
            </section>
            
            <aside className="bg-[#111827] rounded-xl border border-slate-800 shadow-xl p-4 flex flex-col print:hidden">
              
              {/* Data Conclusion Box */}
              {selectedState ? (
                <div className={`p-4 rounded-lg mb-4 border shrink-0 shadow-lg ${
                  selectedState.risk_tier === 'Tier 1' ? 'bg-red-500/10 border-red-500/30' : 
                  selectedState.risk_tier === 'Tier 2' ? 'bg-amber-500/10 border-amber-500/30' : 
                  'bg-emerald-500/10 border-emerald-500/30'
                }`}>
                  <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wide border-b border-slate-700/50 pb-1">
                    {selectedState.state} - Data Conclusion
                  </h4>
                  <div className="space-y-1 mt-2 text-xs text-slate-300">
                    <p className="flex justify-between"><span>Historical Load:</span> <span className="font-bold text-white">{(selectedState.total_visitor_load/1000000).toFixed(2)}M visitors</span></p>
                    <p className="flex justify-between"><span>Water Demand:</span> <span className="font-bold text-white">{selectedState.avg_water_demand} Gal</span></p>
                    <p className="flex justify-between"><span>Capacity Index:</span> <span className="font-bold text-white">{selectedState.strain_index.toLocaleString()}</span></p>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-400 italic leading-relaxed">
                    <span className="font-bold">Directive:</span> {
                      selectedState.risk_tier === 'Tier 1' ? 'Critical resource overcapacity. Pause promotional marketing to prevent municipal utility failure.' : 
                      selectedState.risk_tier === 'Tier 2' ? 'Approaching capacity limits. Active monitoring advised before increasing marketing spend.' : 
                      'Healthy resource overhead. Optimal target for VM2026 marketing dispersal.'
                    }
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-lg mb-4 border border-slate-800 bg-slate-800/30 shrink-0 flex items-center justify-center h-[168px]">
                  <p className="text-slate-500 text-sm font-medium text-center">Select a state to view Data Conclusion.</p>
                </div>
              )}
              
              {/* Fixed Height Scrolling Territory Directory */}
              <div className="flex flex-col flex-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2 shrink-0">
                  Full Territory Directory
                </h3>
                
                {/* 
                  NEW: Fixed height (h-[360px]) makes it only show about 6 items at once.
                  overflow-y-auto adds the scrollbar for the rest.
                */}
                <div className="overflow-y-auto pr-2 space-y-2 h-[360px]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 transparent' }}>
                  {clusterData.map((item) => (
                    <div
                      key={item.state}
                      onClick={() => setSelectedState(item)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                        selectedState?.state === item.state 
                          ? 'bg-slate-800 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                          : 'bg-[#1F2937] border-slate-700 hover:border-slate-500 hover:bg-slate-700/50'
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.state}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">CCI: {item.strain_index.toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${
                        item.risk_tier === 'Tier 1' ? 'bg-red-500' :
                        item.risk_tier === 'Tier 2' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}>
                        {item.risk_tier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="flex-1 min-h-0 animate-in fade-in overflow-y-auto pb-10 print:overflow-visible">
             <StateDetailPane 
               selectedState={selectedState} 
               allData={clusterData} 
               onStateChange={setSelectedState} 
             />
          </div>
        )}

        {activeTab === 'info' && (
          <div className="animate-in fade-in max-w-4xl mx-auto space-y-8 pb-10">
            <div className="bg-[#111827] rounded-xl border border-slate-800 p-8 shadow-xl">
              <h2 className="text-2xl font-black text-white mb-4 border-b border-slate-800 pb-4">Project Methodology & Data Dictionary</h2>
              
              <div className="space-y-6 text-sm leading-relaxed text-slate-300">
                <section>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">1. Dashboard Objective</h3>
                  <p>The VM2026 Carrying Capacity Monitor is designed to solve a core data challenge for MOTAC: identifying which states possess the municipal infrastructure (specifically water utility) to handle aggressive tourism marketing, and which states require active dispersal to prevent urban decay (SDG 8, 11, 12).</p>
                </section>
                
                <section>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">2. Official DOSM Datasets Merged</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">Domestic Tourism 2025:</strong> Provided baseline domestic traveler volumes per state.</li>
                    <li><strong className="text-slate-200">International Arrivals (SOE):</strong> Provided foreign entry statistics, normalized across 2020-2022.</li>
                    <li><strong className="text-slate-200">Water Consumption (Commercial):</strong> Evaluated non-residential water utility stress points.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">3. Data Science Engine (K-Means Clustering)</h3>
                  <p>Instead of relying on arbitrary thresholds, this system utilizes unsupervised Machine Learning (K-Means Clustering). By processing log-transformed visitor and water demand metrics, the algorithm objectively categorized the 16 states and territories into three behavioral clusters:</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-500/10 border border-red-500/30 p-3 rounded">
                      <strong className="text-red-400 block mb-1">Tier 1 (Critical)</strong>
                      <span className="text-xs">Extremely high visitor volume relative to water utility output.</span>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded">
                      <strong className="text-amber-400 block mb-1">Tier 2 (Monitor)</strong>
                      <span className="text-xs">Stable but approaching infrastructure limitations.</span>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded">
                      <strong className="text-emerald-400 block mb-1">Tier 3 (Growth)</strong>
                      <span className="text-xs">Massive utility headroom; prime candidates for increased marketing.</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}