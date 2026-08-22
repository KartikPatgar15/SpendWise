// src/components/ui/ThemeSelector.jsx
// Theme selector supporting Light, Dark, and Grey modes with clean Lucide icons.

import { useTheme } from "../../hooks/useTheme";
import { Sun, Moon, Contrast } from "lucide-react";

export default function ThemeSelector({ theme: propTheme, setTheme: propSetTheme }) {
  const themeContext = useTheme();
  const currentTheme = propTheme || themeContext.theme;
  const changeTheme  = propSetTheme || themeContext.setTheme;

  const options = [
    { value: "light", icon: Sun,      title: "Light mode" },
    { value: "dark",  icon: Moon,     title: "Dark mode" },
    { value: "grey",  icon: Contrast, title: "Monochrome grey" },
  ];

  return (
    <div
      className="inline-flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shrink-0"
      role="group"
      aria-label="Choose theme"
    >
      {options.map((opt) => {
        const isActive = currentTheme === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => changeTheme(opt.value)}
            title={opt.title}
            aria-pressed={isActive}
            className={`
              px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-center
              ${isActive
                ? currentTheme === "dark"
                  ? "bg-[#17242D] text-[#22D3EE] border border-[#22D3EE]/40 shadow-xs scale-105"
                  : currentTheme === "grey"
                  ? "bg-zinc-800 text-zinc-100 shadow-xs scale-105"
                  : "bg-white text-[#2F3E46] shadow-xs scale-105"
                : "opacity-60 hover:opacity-100"
              }
            `}
          >
            <Icon size={14} strokeWidth={isActive ? 2.4 : 1.8} />
          </button>
        );
      })}
    </div>
  );
}
