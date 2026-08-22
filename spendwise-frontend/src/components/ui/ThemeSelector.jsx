// src/components/ui/ThemeSelector.jsx
// Replaces the inline theme buttons in Tracker.jsx.
// Drop-in: same props as the existing changeTheme pattern.

export default function ThemeSelector({ theme, setTheme }) {
  const options = [
    { value: "light", label: "☀️", title: "Light mode" },
    { value: "dark", label: "🌙", title: "Dark mode" },
    { value: "grey", label: "⚫", title: "Monochrome grey" },
  ];

  return (
    <div
      className="inline-flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md"
      role="group"
      aria-label="Choose theme"
    >
      {options.map((opt) => {
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            title={opt.title}
            aria-pressed={isActive}
            className={`
              px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center
              ${isActive
                ? theme === "dark"
                  ? "bg-[#17242D] text-[#22D3EE] border border-[#22D3EE]/40 shadow-xs scale-105"
                  : theme === "grey"
                  ? "bg-zinc-800 text-zinc-100 shadow-xs scale-105"
                  : "bg-white text-[#2F3E46] shadow-xs scale-105"
                : "opacity-60 hover:opacity-100 hover:scale-102"
              }
            `}
          >
            <span className="text-sm leading-none" aria-hidden="true">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
