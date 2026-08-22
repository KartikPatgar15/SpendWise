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
      <div className="bg-[#0D141B]/95 backdrop-blur-md text-[#E8F1F3] text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-[#263640]">
        <p className="text-[#9AAEB7] font-semibold mb-0.5">{label}</p>
        <p className="text-sm font-extrabold text-[#22D3EE] tabular-nums">{formatRupees(payload[0].value)}</p>
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
      <div className="flex items-center justify-center h-48 text-[#657983] text-xs font-semibold">
        No data to display
      </div>
    );
  }

  // Highlight today's bar
  const todayStr = new Date().toISOString().split("T")[0];
  const maxVal = Math.max(...data.map((d) => d.total));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(38, 54, 64, 0.6)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#9AAEB7", fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9AAEB7", fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(38, 54, 64, 0.3)", radius: 6 }} />
        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.date}
              fill={
                entry.date === todayStr
                  ? "#22D3EE"
                  : entry.total === maxVal && maxVal > 0
                  ? "#FF6B3D"
                  : "#14B8A6"
              }
              opacity={entry.total === 0 ? 0.25 : 0.9}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
