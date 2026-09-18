# 🌍 EcoDisperse: VM2026 Carrying Capacity Monitor

**DOSM Datathon 2026 Submission** | **Sustainable Tourism & Infrastructure**  
*Aligning with UN SDGs: Goal 8 (Decent Work & Economic Growth), Goal 11 (Sustainable Cities), Goal 12 (Responsible Consumption).*

![Dashboard Preview](https://via.placeholder.com/1000x500?text=EcoDisperse+Dashboard+Preview)

## 📌 Project Overview
As Malaysia prepares for the massive influx of tourists for Visit Malaysia 2026 (VM2026), policymakers face a critical challenge: balancing economic growth with the physical limits of municipal infrastructure. 

**EcoDisperse** is a custom-coded, interactive analytical command center. By fusing official Department of Statistics Malaysia (DOSM) datasets, this system utilizes unsupervised machine learning to objectively measure the **Carrying Capacity Index (CCI)** of all 16 Malaysian states and territories. It translates raw utility and visitor data into actionable MOTAC budget dispersal directives—preventing infrastructure failure in over-strained regions while identifying high-growth eco-corridors.

## ✨ Core Features
*   **Spatial Risk Map:** A fully interactive, blueprint-styled geographic visualization of Malaysia, dynamically colored by K-Means risk tiers.
*   **Data Conclusion Directives:** Objective, automated policy recommendations generated for each state based on historical visitor loads and water utility demand.
*   **Advanced Diagnostics (CCI Trajectory):** High-density analytics featuring a National Capacity Matrix (Scatter Plot) and Historical Load vs. CCI Trajectory (Composed Charts) with multi-variable filtering.
*   **Full Territory Directory:** Complete integration of all main states and Federal Territories (W.P. Kuala Lumpur, Putrajaya, Labuan) via a streamlined directory interface.
*   **Native MOTAC Report Export:** A one-click PDF generation tool configured with print-specific CSS to instantly produce professional, ink-friendly administrative policy briefs.

## 📊 Data Science Methodology
Instead of relying on arbitrary thresholds, EcoDisperse employs **K-Means Clustering** to categorize spatial carrying capacity.
1.  **Data Fusing:** Merged DOSM Domestic Tourism (2025), International Arrivals (SOE), and Commercial Water Consumption datasets across a normalized 2020–2022 timeline.
2.  **Processing:** Log-transformed visitor and water demand metrics to handle heavy spatial outliers.
3.  **Clustering:** Grouped states into three distinct, objective tiers:
    *   🔴 **Tier 1 (Critical):** Extremely high visitor volume relative to water utility output. Pause marketing spend.
    *   🟠 **Tier 2 (Monitor):** Stable but approaching infrastructure limitations.
    *   🟢 **Tier 3 (Growth):** Massive utility headroom. Prime targets for VM2026 digital marketing dispersal.

## 💻 Tech Stack
*   **Frontend Framework:** React 18, Vite (Client-side SPA for zero-latency rendering)
*   **Styling & UI:** Tailwind CSS v4, Lucide-React Icons
*   **Data Visualization:** Recharts, React-Simple-Maps, d3-geo
*   **Data Pipeline & ML Engine:** Python, Pandas, scikit-learn (K-Means)
