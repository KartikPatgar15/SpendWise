export default function WeeklyView({
  data,
  onBack,
  displayMode,
  setDisplayMode
}) {
  const downloadCSV = () => {
    const headers =
      "Date,Type,Description,Amount\n";

    const rows = data.expenses
      .map(
        (e) =>
          `${e.date},${e.type},${e.description},${e.amount}`
      )
      .join("\n");

    const csvContent = headers + rows;

    const blob = new Blob(
      [csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "weekly-expenses.csv"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // ================= TABLE VIEW =================
  if (displayMode === "table") {
    return (
      <div className="space-y-4">

        <h2 className="text-lg font-semibold border-b pb-1">
          Weekly Expenses
        </h2>

        <div className="flex gap-3 items-center">

          <button
            onClick={downloadCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Download Weekly Report
          </button>

          <select
            value={displayMode}
            onChange={(e) =>
              setDisplayMode(e.target.value)
            }
            className="border rounded-lg p-2"
          >
            <option value="table">
              📋 Table
            </option>

            <option value="card">
              📦 Card
            </option>
          </select>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-500">

            <thead>
              <tr className="bg-gray-800 text-white">

                <th className="border border-gray-300 p-2">
                  Date
                </th>

                <th className="border border-gray-300 p-2">
                  Type
                </th>

                <th className="border border-gray-300 p-2">
                  Description
                </th>

                <th className="border border-gray-300 p-2">
                  Amount
                </th>

              </tr>
            </thead>

            <tbody>
              {data.expenses.map((e) => (
                <tr key={e.id}>

                  <td className="border border-gray-500 p-2">
                    {e.date}
                  </td>

                  <td className="border border-gray-500 p-2">
                    {e.type}
                  </td>

                  <td className="border border-gray-500 p-2">
                    {e.description}
                  </td>

                  <td className="border border-gray-500 p-2 text-right">
                    ₹{e.amount}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div>
          <h2 className="text-lg font-semibold border-b pb-1">
            Category Analysis
          </h2>

          {Object.entries(data.categorySummary).map(
            ([k, v]) => (
              <p key={k}>
                {k} → ₹{v}
              </p>
            )
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold border-b pb-1">
            Comparison
          </h2>

          <p>Total: ₹{data.total}</p>

          <p>
            Last Week: ₹{data.lastWeekTotal}
          </p>

          <p className="font-medium">
            Difference: ₹{data.difference}
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-blue-500"
        >
          ← Back
        </button>

      </div>
    );
  }

  // ================= CARD VIEW =================
  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold border-b pb-1">
        Weekly Expenses
      </h2>

      <div className="flex gap-3 items-center">

        <button
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Download Weekly Report
        </button>

        <select
          value={displayMode}
          onChange={(e) =>
            setDisplayMode(e.target.value)
          }
          className="border rounded-lg p-2"
        >
          <option value="table">
            📋 Table
          </option>

          <option value="card">
            📦 Card
          </option>
        </select>

      </div>

      {data.expenses.map((e) => (
        <div
          key={e.id}
          className="bg-white shadow rounded-xl p-3 flex justify-between"
        >

          <div>
            <p className="font-semibold">
              {e.type}
            </p>

            <p>
              {e.description}
            </p>
          </div>

          <div className="text-right">
            <p>
              ₹{e.amount}
            </p>

            <p>
              {e.date}
            </p>
          </div>

        </div>
      ))}

      <div>
        <h2 className="text-lg font-semibold border-b pb-1">
          Category Analysis
        </h2>

        {Object.entries(data.categorySummary).map(
          ([k, v]) => (
            <p key={k}>
              {k} → ₹{v}
            </p>
          )
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold border-b pb-1">
          Comparison
        </h2>

        <p>Total: ₹{data.total}</p>

        <p>
          Last Week: ₹{data.lastWeekTotal}
        </p>

        <p className="font-medium">
          Difference: ₹{data.difference}
        </p>
      </div>

      <button
        onClick={onBack}
        className="text-blue-500"
      >
        ← Back
      </button>

    </div>
  );
}