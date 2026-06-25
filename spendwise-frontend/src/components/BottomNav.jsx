// src/components/BottomNav.jsx
// EDIT: Added Analytics link. All other code UNCHANGED.

import { Link, useLocation } from "react-router-dom";

function BottomNav() {
  const { pathname } = useLocation();

  const linkStyle = (path) =>
    `flex-1 text-center text-xs py-1 ${pathname === path ? "text-blue-500" : "text-gray-500"}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex py-2">
      <Link to="/" className={linkStyle("/")}>Expense</Link>
      <Link to="/analytics" className={linkStyle("/analytics")}>Analytics</Link>  {/* NEW */}
      <Link to="/splitter" className={linkStyle("/splitter")}>Splitter</Link>
      <Link to="/notes" className={linkStyle("/notes")}>Notes</Link>
    </div>
  );
}

export default BottomNav;
