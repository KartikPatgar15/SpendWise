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
  white:  "bg-[#121C24]",
  yellow: "bg-[#17242D] border border-[#F5B942]/30",
  blue:   "bg-[#17242D] border border-[#22D3EE]/30",
  green:  "bg-[#17242D] border border-[#35D07F]/30",
  pink:   "bg-[#17242D] border border-[#FF6B3D]/30",
  gray:   "bg-[#17242D] border border-[#263640]",
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
            value === key ? "border-[#22D3EE] scale-110" : "border-[#263640]/50"
          }`}
        />
      ))}
    </div>
  );
}
