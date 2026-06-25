// src/App.jsx
// EDIT: Added import AnalyticsPage + one <Route> for /analytics.
// All other code is UNCHANGED.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tracker from "./pages/Tracker";
import Splitter from "./pages/Splitter";
import Notes from "./pages/Notes";
import AnalyticsPage from "./pages/AnalyticsPage";   // NEW
import BottomNav from "./components/BottomNav";
import AIBot from "./components/AIBot";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-16">
        <Routes>
          <Route path="/" element={<Tracker />} />
          <Route path="/splitter" element={<Splitter />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/analytics" element={<AnalyticsPage />} />  {/* NEW */}
        </Routes>
      </div>

      <BottomNav />
      <AIBot />
    </BrowserRouter>
  );
}

export default App;
