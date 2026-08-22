// src/components/BottomNav.jsx
// 3 links only — Analytics moved to Reports menu in Tracker.jsx

import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const NAV_LINKS = [
  { path: "/",         label: "💰", title: "Expense"  },
  { path: "/splitter", label: "✂️", title: "Splitter" },
  { path: "/notes",    label: "📝", title: "Notes"    },
];

function BottomNav() {
  const { pathname } = useLocation();
  const { tokens } = useTheme();

  return (
    <nav aria-label="Main Navigation" className={`fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:min-w-[360px] sm:max-w-md sm:rounded-2xl sm:border ${tokens.nav} border-t sm:border z-40 shadow-xl backdrop-blur-xl transition-all duration-200`}>
      <div className="flex items-center justify-around px-3 py-2 sm:py-2">
        {NAV_LINKS.map(({ path, label, title }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl text-xs transition-all duration-150 ${
                active
                  ? `${tokens.navActive} shadow-2xs font-extrabold`
                  : `${tokens.navInactive} opacity-70 hover:opacity-100 font-medium`
              }`}
            >
              <span className="text-lg leading-none" aria-hidden="true">{label}</span>
              <span className="tracking-tight text-[11px] sm:text-xs">{title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
