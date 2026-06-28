// src/App.jsx — All routes wired up

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tracker        from "./pages/Tracker";
import Splitter       from "./pages/Splitter";
import Notes          from "./pages/Notes";
import AnalyticsPage  from "./pages/AnalyticsPage";
import RecurringPage  from "./pages/RecurringPage";
import GoalsPage      from "./pages/GoalsPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import BottomNav      from "./components/BottomNav";
import AIBot          from "./components/AIBot";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-16">
        <Routes>
          <Route path="/"          element={<Tracker />} />
          <Route path="/splitter"  element={<Splitter />} />
          <Route path="/notes"     element={<Notes />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/recurring" element={<RecurringPage />} />
          <Route path="/goals"     element={<GoalsPage />} />
          <Route path="/ai"        element={<AIInsightsPage />} />
        </Routes>
      </div>
      <BottomNav />
      <AIBot />
    </BrowserRouter>
  );
}

export default App;
