import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tracker from "./pages/Tracker";
import Splitter from "./pages/Splitter";
import Notes from "./pages/Notes";
import BottomNav from "./components/BottomNav";
import AIBot from "./components/AIBot";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-16"> {/* padding for bottom nav */}
        <Routes>
          <Route path="/" element={<Tracker />} />
          <Route path="/splitter" element={<Splitter />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </div>

      <BottomNav />
      <AIBot />
    </BrowserRouter>
  );
}

export default App;
