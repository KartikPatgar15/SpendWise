export default function MonthlyView({ data, onBack }) {
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
      "monthly-expenses.csv"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };
  return (
    <div className="space-y-4">

      {/* Expense List */}
      <div>
        <h2 className="text-lg font-semibold border-b pb-1">
          Monthly Expenses
        </h2>
<div className="overflow-x-auto mt-4">
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
        <p>Last Month: ₹{data.lastMonthTotal}</p>

        <p className="font-medium">
          Difference: ₹{data.difference}
        </p>
      </div>
<button
  onClick={downloadCSV}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
>
  Download Monthly Report
</button>
      <button
        onClick={onBack}
        className="text-blue-500 text-sm"
      >
        ← Back
      </button>
    </div>
  );
}