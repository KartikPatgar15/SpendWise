export default function DashboardView({ data, onBack }) {
  if (!Array.isArray(data)) {
    return <div>Loading...</div>;
  }

  const totalExpenses = data.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const transactionCount = data.length;

  return (
    <div className="space-y-4">

      <h2 className="text-2xl font-bold">
        Dashboard
      </h2>

      <div className="grid gap-3">

        <div className="border p-4 rounded-lg">
          <h3>Total Expenses</h3>
          <p>₹{totalExpenses}</p>
        </div>

        <div className="border p-4 rounded-lg">
          <h3>Total Transactions</h3>
          <p>{transactionCount}</p>
        </div>

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