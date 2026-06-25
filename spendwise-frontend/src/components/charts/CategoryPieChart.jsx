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
    return (
      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow">
        <p className="font-semibold">{name}</p>
        <p>{formatRupees(value)}</p>
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
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
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
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
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
          formatter={(value) => (
            <span className="text-xs font-medium">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
