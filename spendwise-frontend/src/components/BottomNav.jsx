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
    <div className={`fixed bottom-0 left-0 right-0 ${tokens.nav} border-t flex py-1 z-40`}>
      {NAV_LINKS.map(({ path, label, title }) => {
        const active = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
              active ? tokens.navActive : tokens.navInactive
            }`}
          >
            <span className="text-base leading-none">{label}</span>
            <span>{title}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default BottomNav;
