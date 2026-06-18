import { useState } from "react";

export default function HistoryView({
  data,
  onBack,
  onDelete,
  displayMode,
  setDisplayMode,
  onEdit
}) {
  if (!Array.isArray(data)) {
    return <div>Loading...</div>;
  }

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const filteredData = data.filter((expense) => {
    const matchesSearch =
      expense.description
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      expense.type
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesType =
      filterType === "ALL" ||
      expense.type === filterType;

    return matchesSearch && matchesType;
  });

  // ================= TABLE VIEW =================
  if (displayMode === "table") {
    return (
      <div>
        <h2 className="text-lg font-semibold border-b pb-1">
          All Expenses
        </h2>

        <div style={{ margin: "10px 0" }}>
          <label>Display: </label>

          <select
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value)}
          >
            <option value="table">📋 Table</option>
            <option value="card">📦 Card</option>
          </select>
        </div>

        <div className="flex gap-2 mt-3 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">ALL</option>
            <option value="FOOD">FOOD</option>
            <option value="TRAVEL">TRAVEL</option>
            <option value="MOBILE">MOBILE</option>
            <option value="LENT">LENT</option>
            <option value="ENTERTAINMENT">ENTERTAINMENT</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((e) => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td>{e.type}</td>
                <td>{e.description}</td>
                <td>₹{e.amount}</td>
                <td>
                  <button onClick={() => onEdit(e)}>
                    Edit
                  </button>

                  <button onClick={() => onDelete(e.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={onBack}>
          ← Back
        </button>
      </div>
    );
  }

  // ================= CARD VIEW =================
  return (
    <div>
      <h2 className="text-lg font-semibold border-b pb-1">
        All Expenses
      </h2>

      <div style={{ margin: "10px 0" }}>
        <label>Display: </label>

        <select
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
        >
          <option value="table">📋 Table</option>
          <option value="card">📦 Card</option>
        </select>
      </div>

      <div className="flex gap-2 mt-3 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="ALL">ALL</option>
          <option value="FOOD">FOOD</option>
          <option value="TRAVEL">TRAVEL</option>
          <option value="MOBILE">MOBILE</option>
          <option value="LENT">LENT</option>
          <option value="ENTERTAINMENT">ENTERTAINMENT</option>
          <option value="OTHER">OTHER</option>
        </select>
      </div>

      {filteredData.map((e) => (
        <div
          key={e.id}
          className="bg-white shadow rounded-xl p-3 flex justify-between mt-2"
        >
          <div>
            <p>{e.type}</p>
            <p>{e.description}</p>
          </div>

          <div>
            <p>₹{e.amount}</p>
            <p>{e.date}</p>

            <button onClick={() => onEdit(e)}>
              Edit
            </button>

            <button onClick={() => onDelete(e.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <button onClick={onBack}>
        ← Back
      </button>
    </div>
  );
}