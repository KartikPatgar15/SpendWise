export default function WeeklyView({ data, onBack }) {
  return (
    <div className="space-y-4">

      {/* Expense List */}
      <div>
        <h2 className="text-lg font-semibold border-b pb-1">
          Weekly Expenses
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
        <p>Last Week: ₹{data.lastWeekTotal}</p>

        <p className="font-medium">
          Difference: ₹{data.difference}
        </p>
      </div>

      <button
        onClick={onBack}
        className="text-blue-500 text-sm"
      >
        ← Back
      </button>
    </div>
  );
}