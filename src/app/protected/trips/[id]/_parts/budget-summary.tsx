export default function BudgetSummary(
  {
    trip,
    totalActualCost,
  }: {
    trip: {
      budget_total: number | null;
    };
    totalActualCost?: number ;
  }
) {
  const remainingBudget = (trip.budget_total || 0) - (totalActualCost || 0);
  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
    <h2 className="text-xl font-bold mb-4">予算サマリー</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-gray-500">旅行予算</p>
        <p className="text-xl font-medium">¥{trip.budget_total?.toLocaleString() || 0}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">実際の支出</p>
        <p className="text-xl font-medium">¥{totalActualCost?.toLocaleString() || 0}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">残り予算</p>
        <p className={`text-xl font-medium ${remainingBudget < 0 ? 'text-red-500' : ''}`}>
          ¥{remainingBudget.toLocaleString()}
        </p>
      </div>
    </div>
    </div>
    
);
}
