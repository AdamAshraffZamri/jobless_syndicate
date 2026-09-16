import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Plus, Minus, Filter } from 'lucide-react';

const geoUrl = "/malaysia-states.geojson";

const tierColors = {
  "Tier 1": "#ef4444", 
  "Tier 2": "#f59e0b", 
  "Tier 3": "#10b981", 
  "Default": "#1e293b", 
  "FilteredOut": "#0f172a" 
};

export default function MapContainer({ data, onStateClick }) {
  // Center adjusted and zoom reduced significantly (was 2800, now 2100)
  const [position, setPosition] = useState({ coordinates: [109.5, 4.2], zoom: 1 });
  const [activeFilter, setActiveFilter] = useState('All');
  
  // NEW: State to track which territory is currently hovered
  const [hoveredState, setHoveredState] = useState(null);

  const handleZoomIn = () => { if (position.zoom < 4) setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 })); };
  const handleZoomOut = () => { if (position.zoom > 1) setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 })); };

  const getStateColor = (geoStateName) => {
    if (!data) return tierColors["Default"];
    const stateData = data.find((s) => s.state === geoStateName);
    if (!stateData) return tierColors["Default"];
    if (activeFilter !== 'All' && stateData.risk_tier !== activeFilter) return tierColors["FilteredOut"];
    return tierColors[stateData.risk_tier];
  };

  return (
    <div className="w-full h-full min-h-[500px] flex flex-col relative rounded-xl overflow-hidden bg-[#0B1120]">
      
      {/* Top Left: Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-3">
        <div className="bg-[#1F2937]/90 backdrop-blur border border-slate-700 rounded-lg p-1 flex gap-1 shadow-lg">
          {['All', 'Tier 1', 'Tier 2', 'Tier 3'].map(tier => (
            <button
              key={tier}
              onClick={() => setActiveFilter(tier)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                activeFilter === tier ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
        <div className="bg-[#1F2937]/90 backdrop-blur border border-slate-700 rounded-lg flex flex-col shadow-lg w-9">
          <button onClick={handleZoomIn} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 border-b border-slate-700 rounded-t-lg flex justify-center"><Plus className="w-4 h-4" /></button>
          <button onClick={handleZoomOut} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-b-lg flex justify-center"><Minus className="w-4 h-4" /></button>
        </div>
      </div>

      {/* NEW: Top Right Hover Information Popup */}
      {hoveredState && (
        <div className="absolute top-4 right-4 z-10 bg-[#1F2937]/95 backdrop-blur border border-slate-600 rounded-lg p-4 shadow-2xl pointer-events-none w-64 animate-in fade-in zoom-in duration-200">
          <h4 className="text-lg font-black text-white mb-1">{hoveredState.state}</h4>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400">Classification</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${hoveredState.risk_tier === 'Tier 1' ? 'bg-red-500' : hoveredState.risk_tier === 'Tier 2' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
              {hoveredState.risk_tier}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total Visitors</span>
              <span className="text-slate-200 font-bold">{(hoveredState.total_visitor_load / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Water Demand</span>
              <span className="text-slate-200 font-bold">{hoveredState.avg_water_demand} gal</span>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-slate-700 mt-1">
              <span className="text-slate-400 font-semibold">Strain Index</span>
              <span className="text-white font-black">{hoveredState.strain_index.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Map Canvas */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 2100 }} // Scaled down globally
          className="w-[90%] h-[90%]"
        >
          <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={setPosition} maxZoom={6}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.Name || geo.properties.name || geo.properties.state; 
                  const stateData = data ? data.find((s) => s.state === stateName) : null;
                  const isFilteredOut = activeFilter !== 'All' && stateData?.risk_tier !== activeFilter;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStateColor(stateName)}
                      stroke="#1e293b"
                      strokeWidth={0.75}
                      onClick={() => {
                        if (onStateClick && stateData && !isFilteredOut) onStateClick(stateData);
                      }}
                      // NEW: Mouse Enter and Leave triggers the hover popup
                      onMouseEnter={() => {
                        if (stateData && !isFilteredOut) setHoveredState(stateData);
                      }}
                      onMouseLeave={() => setHoveredState(null)}
                      style={{
                        default: { outline: "none", transition: "all 250ms ease" },
                        hover: { fill: isFilteredOut ? tierColors["FilteredOut"] : "#60a5fa", outline: "none", cursor: isFilteredOut ? "default" : "pointer", transition: "all 250ms ease" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}