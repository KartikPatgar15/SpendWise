// src/components/notes/ColorPicker.jsx

export const NOTE_COLORS = {
  white:  { bg: "bg-white",        card: "bg-white",        label: "⬜ White"  },
  yellow: { bg: "bg-yellow-50",    card: "bg-yellow-50",    label: "🟡 Yellow" },
  blue:   { bg: "bg-blue-50",      card: "bg-blue-50",      label: "🔵 Blue"   },
  green:  { bg: "bg-emerald-50",   card: "bg-emerald-50",   label: "🟢 Green"  },
  pink:   { bg: "bg-pink-50",      card: "bg-pink-50",      label: "🩷 Pink"   },
  gray:   { bg: "bg-gray-100",     card: "bg-gray-100",     label: "⚫ Gray"   },
};

export const NOTE_COLORS_DARK = {
  white:  "bg-gray-800",
  yellow: "bg-yellow-900/60",
  blue:   "bg-blue-900/60",
  green:  "bg-emerald-900/60",
  pink:   "bg-pink-900/60",
  gray:   "bg-gray-700",
};

export default function ColorPicker({ value, onChange }) {
  const colors = Object.entries(NOTE_COLORS);
  return (
    <div className="flex gap-2 flex-wrap p-2">
      {colors.map(([key, { bg, label }]) => (
        <button
          key={key}
          title={label}
          onClick={() => onChange(key)}
          className={`w-7 h-7 rounded-full border-2 transition-all active:scale-90 ${bg} ${
            value === key ? "border-blue-500 scale-110" : "border-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
