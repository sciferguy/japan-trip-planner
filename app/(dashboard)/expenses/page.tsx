import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"

export default async function ExpensesPage() {
  const session = await auth()

  // Mock data for demonstration
  const expenses = [
    { id: 1, category: "FOOD", description: "Sushi dinner in Ginza", amount: 8500, date: "2024-03-15", usdAmount: 57 },
    { id: 2, category: "TRANSPORT", description: "JR Rail Pass", amount: 37000, date: "2024-03-10", usdAmount: 247 },
    { id: 3, category: "ACCOMMODATION", description: "Tokyo hotel (3 nights)", amount: 45000, date: "2024-03-12", usdAmount: 300 },
    { id: 4, category: "ACTIVITIES", description: "Tokyo Skytree tickets", amount: 3100, date: "2024-03-16", usdAmount: 21 },
    { id: 5, category: "SHOPPING", description: "Souvenirs in Harajuku", amount: 12000, date: "2024-03-17", usdAmount: 80 },
  ]

  const totalJPY = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalUSD = expenses.reduce((sum, expense) => sum + expense.usdAmount, 0)
  const budget = 200000 // JPY
  const budgetUsedPercent = Math.round((totalJPY / budget) * 100)

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FOOD': return '🍽️'
      case 'TRANSPORT': return '🚅'
      case 'ACCOMMODATION': return '🏨'
      case 'ACTIVITIES': return '🎎'
      case 'SHOPPING': return '🛍️'
      default: return '💰'
    }
  }

  const formatCurrency = (amount: number, currency: 'JPY' | 'USD' = 'JPY') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Expense Tracking
          </h1>
          <p className="text-stone-600 text-zen">
            Monitor your trip spending with real-time currency conversion
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Add Expense
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="text-tea-700">Total Spent</CardTitle>
            <CardDescription>Current trip expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-stone-800">
                {formatCurrency(totalJPY, 'JPY')}
              </div>
              <div className="text-lg text-stone-600">
                {formatCurrency(totalUSD, 'USD')}
              </div>
              <div className="text-sm text-stone-500">
                Rate: 1 USD = 149.6 JPY
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="text-bamboo-700">Budget Status</CardTitle>
            <CardDescription>Remaining budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-stone-800">
                {formatCurrency(budget - totalJPY, 'JPY')}
              </div>
              <div className="w-full bg-stone-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    budgetUsedPercent > 80 ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                    budgetUsedPercent > 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    'bg-gradient-to-r from-tea-500 to-sakura-500'
                  }`}
                  style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-stone-600">
                {budgetUsedPercent}% of budget used
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="text-sakura-700">Daily Average</CardTitle>
            <CardDescription>Average spending per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-stone-800">
                {formatCurrency(Math.round(totalJPY / 7), 'JPY')}
              </div>
              <div className="text-lg text-stone-600">
                {formatCurrency(Math.round(totalUSD / 7), 'USD')}
              </div>
              <div className="text-sm text-stone-500">
                Based on 7-day trip
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Breakdown of your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  <div>
                    <div className="font-medium text-stone-800">{category}</div>
                    <div className="text-sm text-stone-600">
                      {formatCurrency(amount, 'JPY')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-stone-600">
                    {formatCurrency(Math.round(amount / 149.6), 'USD')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest spending activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 border border-stone-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
                  <div>
                    <div className="font-medium text-stone-800">{expense.description}</div>
                    <div className="text-sm text-stone-500">{expense.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-stone-800">
                    {formatCurrency(expense.amount, 'JPY')}
                  </div>
                  <div className="text-sm text-stone-600">
                    {formatCurrency(expense.usdAmount, 'USD')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}