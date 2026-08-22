// src/components/charts/CategoryPieChart.jsx
// Recharts PieChart showing category breakdown.
// Install: npm install recharts

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CATEGORY_COLORS } from "../../config/themeConfig";
import { formatRupees } from "../../utils/expenseHelpers";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const color = CATEGORY_COLORS[name] || "#657983";
    return (
      <div className="bg-[#0D141B]/95 backdrop-blur-md text-[#E8F1F3] text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-[#263640] flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <div>
          <p className="font-bold tracking-tight">{name}</p>
          <p className="text-[#9AAEB7] font-medium tabular-nums">{formatRupees(value)}</p>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * @param {Array} data - [{ name: "FOOD", value: 1200 }, ...]
 */
export default function CategoryPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#657983] text-xs font-semibold">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={95}
          paddingAngle={4}
          dataKey="value"
          stroke="transparent"
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={CATEGORY_COLORS[entry.name] || "#6b7280"}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-xs font-semibold px-1 opacity-90">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
