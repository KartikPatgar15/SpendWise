import React, { useState } from "react";

const CATEGORIES = [
  "FOOD",
  "TRAVEL",
  "MOBILE",
  "LENT",
  "ENTERTAINMENT",
  "OTHER"
];

export default function AddExpenseForm({ onAdd }) {
  const [expense, setExpense] = useState({
    date: "",
    amount: "",
    type: "FOOD",
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!expense.date || !expense.amount) return;

    onAdd({
      ...expense,
      amount: Number(expense.amount)
    });

    setExpense({
      date: "",
      amount: "",
      type: "FOOD",
      description: ""
    });
  };

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-xl font-bold mb-4">
        Add Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          type="date"
          value={expense.date}
          onChange={(e) =>
            setExpense({ ...expense, date: e.target.value })
          }
          className="border rounded-lg p-2 w-full"
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={expense.amount}
          onChange={(e) =>
            setExpense({ ...expense, amount: e.target.value })
          }
          className="border rounded-lg p-2 w-full"
          required
        />

        <select
          value={expense.type}
          onChange={(e) =>
            setExpense({ ...expense, type: e.target.value })
          }
          className="border rounded-lg p-2 w-full"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Description"
          value={expense.description}
          onChange={(e) =>
            setExpense({
              ...expense,
              description: e.target.value
            })
          }
          className="border rounded-lg p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded-lg"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}