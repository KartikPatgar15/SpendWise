import { useState } from "react";
import { exportToCSV } from "../../utils/exportCsv";

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

        <div className="flex gap-3 items-center mb-3">
          <button
            onClick={() =>
              exportToCSV(
                filteredData,
                "expense-history.csv"
              )
            }
            className="bg-green-500 text-white px-3 py-2 rounded-lg"
          >
            ⬇ Download CSV
          </button>

          <select
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="table">📋 Table</option>
            <option value="card">📦 Card</option>
          </select>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-2"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded-lg p-2"
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
<div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-500">
                        <thead>
                        <tr className="bg-gray-200 text-black">cd
                            <th className="border border-gray-500 p-2">Date</th>
                            <th className="border border-gray-500 p-2">Type</th>
                            <th className="border border-gray-500 p-2">Description</th>
                            <th className="border border-gray-500 p-2">Amount</th>
                            <th className="border border-gray-500 p-2">Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredData.map((e) => (
                            <tr key={e.id}>
                              <td className="border border-gray-500 p-2">{e.date}</td>
                              <td className="border border-gray-500 p-2">{e.type}</td>
                              <td className="border border-gray-500 p-2">{e.description}</td>
                              <td className="border border-gray-500 p-2">₹{e.amount}</td>

                              <td className="border border-gray-500 p-2">
                                <button
                                  onClick={() => onEdit(e)}
                                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => onDelete(e.id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
        <button
          onClick={onBack}
          className="mt-3 text-blue-500"
        >
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

      <div className="flex gap-3 items-center mb-3">
        <button
          onClick={() =>
            exportToCSV(
              filteredData,
              "expense-history.csv"
            )
          }
          className="bg-green-500 text-white px-3 py-2 rounded-lg"
        >
          ⬇ Download CSV
        </button>

        <select
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="table">📋 Table</option>
          <option value="card">📦 Card</option>
        </select>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg p-2"
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
            <p className="font-semibold">{e.type}</p>
            <p>{e.description}</p>
          </div>

          <div>
            <p>₹{e.amount}</p>
            <p>{e.date}</p>

            <button
              onClick={() => onEdit(e)}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(e.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={onBack}
        className="mt-3 text-blue-500"
      >
        ← Back
      </button>
    </div>
  );
}