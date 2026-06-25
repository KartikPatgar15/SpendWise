import { useState } from "react";
import API from "../services/api";
import WeeklyView from "../components/expense/WeeklyView";
import HistoryView from "../components/expense/HistoryView";
import MonthlyView from "../components/expense/MonthlyView";
import DashboardView from "../components/expense/DashboardView";
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
const [editingExpense, setEditingExpense] = useState(null);

const [editForm, setEditForm] = useState({
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

  const openEdit = (expense) => {
  setEditingExpense(expense);

  setEditForm({
    date: expense.date,
    amount: expense.amount,
    type: expense.type,
    description: expense.description
  });
};
const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "dark"
);

  const handleDelete = async (id) => {
  try {
    await API.delete(`/expenses/${id}`);

    setData((prev) =>
      prev.filter((expense) => expense.id !== id)
    );

  } catch (e) {
    alert("Failed to delete expense");
  }
};

const handleUpdate = async () => {
  try {

    await API.put(
      `/expenses/${editingExpense.id}`,
      editForm
    );

    const updatedHistory = data.map((e) =>
      e.id === editingExpense.id
        ? { ...e, ...editForm }
        : e
    );

    setData(updatedHistory);

    setEditingExpense(null);

  } catch (e) {
    alert("Failed to update expense");
  }
};
const [displayMode, setDisplayMode] = useState(
  localStorage.getItem("displayMode") || "table"
);

const changeDisplayMode = (mode) => {
  setDisplayMode(mode);
  localStorage.setItem("displayMode", mode);
};
const changeTheme = (newTheme) => {
  setTheme(newTheme);
  localStorage.setItem("theme", newTheme);
};
const fetchDashboard = async () => {
  const res = await API.get("/expenses/history");

  setData(res.data);

  setView("dashboard");
};
return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor:
          theme === "dark"
            ? "black"
            : theme === "light"
            ? "white"
            : "gray",
        color:
          theme === "light"
            ? "black"
            : "white"
      }}
    >
  <h1>Current Theme: {theme}</h1>

<div className="flex gap-2 justify-end">

  <button
    onClick={() => changeTheme("light")}
    className="px-3 py-1 rounded bg-yellow-400 text-black"
  >
    ☀️
  </button>

  <button
    onClick={() => changeTheme("dark")}
    className="px-3 py-1 rounded bg-black text-white border"
  >
    🌙
  </button>

  <button
    onClick={() => changeTheme("grey")}
    className="px-3 py-1 rounded bg-gray-500 text-white"
  >
    ⚫
  </button>

</div>
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

    
            {/* ---------------- WEEKLY ---------------- */}
      {view === "weekly" && data && (
        <WeeklyView
          data={data}
          displayMode={displayMode}
          setDisplayMode={changeDisplayMode}
          onBack={() => setView("menu")}
        />
      )}
   {view === "monthly" && data && (
  <MonthlyView
    data={data}
    displayMode={displayMode}
    setDisplayMode={changeDisplayMode}
    onBack={() => setView("menu")}
  />
   )}

{view === "history" && data && (
  <HistoryView
    data={data}
    displayMode={displayMode}
    setDisplayMode={changeDisplayMode}
    onBack={() => setView("menu")}
    onDelete={handleDelete}
    onEdit={openEdit}
  />
)}

{/* ---------------- EDIT MODAL ---------------- */}
{editingExpense && (
  <div className="fixed insetcurre-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-5 w-[90%] max-w-md space-y-3">

      <h2 className="text-xl font-bold">
        Edit Expense
      </h2>

      <input
        type="date"
        value={editForm.date}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            date: e.target.value
          })
        }
        className="border rounded-lg p-2 w-full"
      />

      <input
        type="number"
        value={editForm.amount}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            amount: e.target.value
          })
        }
        className="border rounded-lg p-2 w-full"
      />

      <select
        value={editForm.type}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            type: e.target.value
          })
        }
        className="border rounded-lg p-2 w-full"
      >
        <option>FOOD</option>
        <option>TRAVEL</option>
        <option>MOBILE</option>
        <option>LENT</option>
        <option>ENTERTAINMENT</option>
        <option>OTHER</option>
      </select>

      <input
        type="text"
        value={editForm.description}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            description: e.target.value
          })
        }
        className="border rounded-lg p-2 w-full"
      />

      <div className="flex gap-2">

        <button
          onClick={() => setEditingExpense(null)}
          className="bg-gray-300 px-4 py-2 rounded-lg w-full"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Save
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Tracker;