// src/components/ui/ThemeSelector.jsx
// Replaces the inline theme buttons in Tracker.jsx.
// Drop-in: same props as the existing changeTheme pattern.

export default function ThemeSelector({ theme, setTheme }) {
  const options = [
    { value: "light", label: "☀️", title: "Light" },
    { value: "dark", label: "🌙", title: "Dark" },
    { value: "grey", label: "⚫", title: "Grey" },
  ];

  return (
    <div className="flex gap-1" role="group" aria-label="Choose theme">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.title}
          aria-pressed={theme === opt.value}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all
            ${theme === opt.value
              ? "ring-2 ring-blue-500 bg-blue-500/20"
              : "opacity-60 hover:opacity-100"
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
