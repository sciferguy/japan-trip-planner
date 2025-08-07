import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ExpensesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            💰 Expense Tracking
          </h1>
          <p className="text-stone-600 text-zen">
            Monitor your spending and stay within budget
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="text-lg">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stone-800">¥0</div>
            <p className="text-sm text-stone-500">Set your budget</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="text-lg">Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stone-800">¥0</div>
            <p className="text-sm text-stone-500">No expenses yet</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="text-lg">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-tea-600">¥0</div>
            <p className="text-sm text-stone-500">Budget remaining</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest spending activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-stone-500">
              <div className="text-4xl mb-4">💸</div>
              <p>No expenses recorded yet</p>
              <p className="text-sm">Start tracking your Japan trip expenses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-tea-500 rounded-full"></span>
                  <span>Food & Dining</span>
                </div>
                <span className="font-medium">¥0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-bamboo-500 rounded-full"></span>
                  <span>Transportation</span>
                </div>
                <span className="font-medium">¥0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-sakura-500 rounded-full"></span>
                  <span>Accommodation</span>
                </div>
                <span className="font-medium">¥0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-stone-500 rounded-full"></span>
                  <span>Activities</span>
                </div>
                <span className="font-medium">¥0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}