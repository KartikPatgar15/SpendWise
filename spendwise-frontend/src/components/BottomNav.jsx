// src/components/BottomNav.jsx
// 3 links with Lucide icons matching theme tokens and responsive navbar

import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { Wallet, Users, NotebookPen } from "lucide-react";

const NAV_LINKS = [
  { path: "/",         icon: Wallet,      title: "Expense"  },
  { path: "/splitter", icon: Users,       title: "Splitter" },
  { path: "/notes",    icon: NotebookPen, title: "Notes"    },
];

function BottomNav() {
  const { pathname } = useLocation();
  const { tokens } = useTheme();

  return (
    <nav aria-label="Main Navigation" className={`fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:min-w-[360px] sm:max-w-md sm:rounded-2xl sm:border ${tokens.nav} border-t sm:border z-40 shadow-xl backdrop-blur-xl transition-all duration-200`}>
      <div className="flex items-center justify-around px-3 py-2 sm:py-2">
        {NAV_LINKS.map(({ path, icon: Icon, title }) => {
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
              <Icon size={20} strokeWidth={active ? 2.3 : 1.9} />
              <span className="tracking-tight text-[11px] sm:text-xs">{title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
