import { useState } from "react";
import API from "../services/api";

const categories = [
  "FOOD",
  "TRAVEL",
  "MOBILE",
  "LENT",
  "ENTERTAINMENT",
  "OTHER"
];

function Tracker() {
  const [view, setView] = useState("form");
  const [expense, setExpense] = useState({
    date: "",
    amount: "",
    type: "FOOD",
    description: ""
  });

  const [data, setData] = useState(null);

  const handleAdd = async () => {
    await API.post("/expenses", {
      ...expense,
      amount: Number(expense.amount)
    });

    alert("Expense added ✅");

    setExpense({
      date: "",
      amount: "",
      type: "FOOD",
      description: ""
    });
  };

  const fetchWeekly = async () => {
    const res = await API.get("/expenses/weekly");
    setData(res.data);
    setView("weekly");
  };

  const fetchMonthly = async () => {
    const res = await API.get("/expenses/monthly");
    setData(res.data);
    setView("monthly");
  };

  const fetchHistory = async () => {
    const res = await API.get("/expenses/history");
    setData(res.data);
    setView("history");
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-5">

      {/* ---------------- FORM ---------------- */}
      {view === "form" && (
        <>
          <h1 className="text-2xl font-bold text-center">
            Expense Tracker
          </h1>

          <div className="bg-white shadow-lg rounded-2xl p-4 space-y-3">

            <input
              type="date"
              value={expense.date}
              onChange={(e) =>
                setExpense({ ...expense, date: e.target.value })
              }
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="number"
              placeholder="Amount"
              value={expense.amount}
              onChange={(e) =>
                setExpense({ ...expense, amount: e.target.value })
              }
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
            />

            <select
              value={expense.type}
              onChange={(e) =>
                setExpense({ ...expense, type: e.target.value })
              }
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Description"
              value={expense.description}
              onChange={(e) =>
                setExpense({ ...expense, description: e.target.value })
              }
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handleAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl w-full shadow"
            >
              Add Expense
            </button>
          </div>

          <button
            onClick={() => setView("menu")}
            className="bg-black text-white p-2 w-full rounded-xl shadow"
          >
            View Expense History
          </button>
        </>
      )}

      {/* ---------------- MENU ---------------- */}
      {view === "menu" && (
        <div className="space-y-3">

          <button
            onClick={fetchWeekly}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 w-full rounded-xl shadow"
          >
            Weekly Expense
          </button>

          <button
            onClick={fetchMonthly}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 w-full rounded-xl shadow"
          >
            Monthly Expense
          </button>

          <button
            onClick={fetchHistory}
            className="bg-gray-800 text-white p-3 w-full rounded-xl shadow"
          >
            Expense History
          </button>

          <button
            onClick={() => setView("form")}
            className="text-blue-500 text-sm"
          >
            ← Back
          </button>
        </div>
      )}

      {/* ---------------- WEEKLY / MONTHLY ---------------- */}
      {(view === "weekly" || view === "monthly") && data && (
        <div className="space-y-4">

          {/* Expense List */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-1">
              Expenses
            </h2>

            {data.expenses.map((e) => (
              <div
                key={e.id}
                className="bg-white shadow rounded-xl p-3 flex justify-between mt-2"
              >
                <div>
                  <p className="font-semibold">{e.type}</p>
                  <p className="text-sm text-gray-500">
                    {e.description}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium">₹{e.amount}</p>
                  <p className="text-xs text-gray-500">
                    {e.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Category */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-1">
              Category Analysis
            </h2>

            {Object.entries(data.categorySummary).map(([k, v]) => (
              <p key={k} className="text-sm mt-1">
                {k} → ₹{v}
              </p>
            ))}
          </div>

          {/* Comparison */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-1">
              Comparison
            </h2>

            <p>Total: ₹{data.total}</p>
            <p>
              {view === "weekly" ? "Last Week" : "Last Month"}: ₹
              {view === "weekly"
                ? data.lastWeekTotal
                : data.lastMonthTotal}
            </p>
            <p className="font-medium">
              Difference: ₹{data.difference}
            </p>
          </div>

          <button
            onClick={() => setView("menu")}
            className="text-blue-500 text-sm"
          >
            ← Back
          </button>
        </div>
      )}

      {/* ---------------- HISTORY ---------------- */}
      {view === "history" && data && (
        <div>

          <h2 className="text-lg font-semibold border-b pb-1">
            All Expenses
          </h2>

          {data.map((e) => (
            <div
              key={e.id}
              className="bg-white shadow rounded-xl p-3 flex justify-between mt-2"
            >
              <div>
                <p className="font-semibold">{e.type}</p>
                <p className="text-sm text-gray-500">
                  {e.description}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium">₹{e.amount}</p>
                <p className="text-xs text-gray-500">
                  {e.date}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={() => setView("menu")}
            className="text-blue-500 text-sm mt-3"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

export default Tracker;