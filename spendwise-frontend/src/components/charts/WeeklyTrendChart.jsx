// src/components/charts/WeeklyTrendChart.jsx
// Recharts BarChart for daily spending over the last 7 days.
// Install: npm install recharts

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatRupees } from "../../utils/expenseHelpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow">
        <p className="font-semibold mb-1">{label}</p>
        <p>{formatRupees(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

/**
 * @param {Array} data - [{ day: "Mon", date: "2025-06-01", total: 540 }, ...]
 */
export default function WeeklyTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data to display
      </div>
    );
  }

  // Highlight today's bar
  const todayStr = new Date().toISOString().split("T")[0];
  const maxVal = Math.max(...data.map((d) => d.total));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.date}
              fill={
                entry.date === todayStr
                  ? "#3b82f6"
                  : entry.total === maxVal
                  ? "#f97316"
                  : "#6366f1"
              }
              opacity={entry.total === 0 ? 0.25 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
