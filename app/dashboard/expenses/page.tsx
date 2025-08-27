'use client'

import { useState, useEffect } from 'react'
import { useCurrentTrip } from '@/hooks/useCurrentTrip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Receipt, TrendingUp, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Expense {
  id: string
  label: string
  amount_original: number
  currency_original: string
  fx_rate: number
  amount_jpy: number
  category?: string
  expense_type: string
  date: string
  day_id?: string
  created_by_user: {
    id: string
    name: string
    email: string
  }
}

interface ExpenseSummary {
  totalInHomeCurrency: number
  homeCurrency: string
  byCategory: Record<string, { count: number; total: number }>
  byDay: Record<string, { count: number; total: number }>
  count: number
}

export default function ExpensesPage() {
  const { currentTrip } = useCurrentTrip()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [summary, setSummary] = useState<ExpenseSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    label: '',
    amount: '',
    currency: 'JPY',
    category: 'FOOD',
    expenseType: 'ACTUAL',
    date: format(new Date(), 'yyyy-MM-dd'),
  })

  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [budgetData, setBudgetData] = useState({
    budget_total: '',
    budget_transport: '',
    budget_accommodation: '',
    budget_food: '',
    budget_activities: '',
    budget_shopping: '',
    budget_misc: '',
  })

  const [tripBudget, setTripBudget] = useState<any>(null)

  const [viewMode, setViewMode] = useState<'list' | 'category' | 'daily'>('list')  // ADD THIS

  useEffect(() => {
    if (currentTrip?.id) {
      fetchExpenses()
      fetchSummary()
      fetchTripBudget()
    }
  }, [currentTrip?.id])

  const fetchExpenses = async () => {
    if (!currentTrip?.id) return
    
    try {
      const res = await fetch(`/api/trips/${currentTrip.id}/expenses`)
      const data = await res.json()
      
      if (data.ok) {
        setExpenses(data.data)
      } else {
        toast.error('Failed to load expenses')
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    if (!currentTrip?.id) return
    
    try {
      const res = await fetch(`/api/trips/${currentTrip.id}/expenses/summary`)
      const data = await res.json()
      
      if (data.ok) {
        setSummary(data.data)
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const fetchTripBudget = async () => {
    if (!currentTrip?.id) return
    
    try {
      const res = await fetch(`/api/trips/${currentTrip.id}`)
      const data = await res.json()
      if (data.ok && data.data) {
        setTripBudget(data.data)
        // Pre-fill budget form with existing values
        setBudgetData({
          budget_total: data.data.budget_total?.toString() || '',
          budget_transport: data.data.budget_transport?.toString() || '',
          budget_accommodation: data.data.budget_accommodation?.toString() || '',
          budget_food: data.data.budget_food?.toString() || '',
          budget_activities: data.data.budget_activities?.toString() || '',
          budget_shopping: data.data.budget_shopping?.toString() || '',
          budget_misc: data.data.budget_misc?.toString() || '',
        })
      }
    } catch (error) {
      console.error('Error fetching trip budget:', error)
    }
  }

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentTrip?.id) return
  
    try {
      const budgetPayload = Object.entries(budgetData).reduce((acc, [key, value]) => {
        if (value) acc[key] = parseFloat(value)
        return acc
      }, {} as Record<string, number>)
  
      const res = await fetch(`/api/trips/${currentTrip.id}/budget`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetPayload),
      })
  
      const data = await res.json()
      
      if (data.ok) {
        toast.success('Budget updated')
        setShowBudgetForm(false)
        // Refresh the trip data to get updated budget values
        fetchTripBudget()
        fetchSummary()
      } else {
        toast.error(data.error || 'Failed to update budget')
      }
    } catch (error) {
      console.error('Error setting budget:', error)
      toast.error('Failed to update budget')
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentTrip?.id) return

    try {
      const res = await fetch(`/api/trips/${currentTrip.id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      })

      const data = await res.json()
      
      if (data.ok) {
        toast.success('Expense added')
        setExpenses([data.data, ...expenses])
        setShowAddForm(false)
        setFormData({
          label: '',
          amount: '',
          currency: 'JPY',
          category: 'FOOD',
          expenseType: 'ACTUAL',
          date: format(new Date(), 'yyyy-MM-dd'),
        })
        fetchSummary()
      } else {
        toast.error(data.error || 'Failed to add expense')
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      toast.error('Failed to add expense')
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const CategoryView = () => (
    <div className="space-y-4">
      {Object.entries(summary?.byCategory || {}).map(([category, data]) => (
        <Card key={category}>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-lg">{category}</CardTitle>
              <span className="text-2xl font-bold">
                {formatCurrency(data.total, summary?.homeCurrency || 'USD')}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expenses
                .filter(e => (e.category || 'MISC') === category)
                .map(expense => (
                  <div key={expense.id} className="flex justify-between text-sm">
                    <span>{expense.label}</span>
                    <span>{formatCurrency(expense.amount_original, expense.currency_original)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (!currentTrip) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No trip selected</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading expenses...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track your trip spending</p>
        </div>
        <div className="flex gap-2">  {/* CHANGED: Wrap buttons in a div */}
        <Button variant="outline" onClick={() => setShowBudgetForm(!showBudgetForm)}>
          {tripBudget?.budget_total ? 'Edit Budget' : 'Set Budget'}
        </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.totalInHomeCurrency, summary.homeCurrency)}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.count} expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  summary.totalInHomeCurrency / (Object.keys(summary.byDay).length || 1),
                  summary.homeCurrency
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {Object.keys(summary.byDay).length} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.entries(summary.byCategory)
                  .sort(([, a], [, b]) => b.total - a.total)[0]?.[0] || 'None'}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(
                  Object.entries(summary.byCategory)
                    .sort(([, a], [, b]) => b.total - a.total)[0]?.[1]?.total || 0,
                  summary.homeCurrency
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tripBudget?.budget_total && summary ? 
                  formatCurrency(tripBudget.budget_total - summary.totalInHomeCurrency, summary.homeCurrency) :
                  'No budget'}
              </div>
              {tripBudget?.budget_total && summary && (
                <p className="text-xs text-muted-foreground">
                  {Math.round((summary.totalInHomeCurrency / tripBudget.budget_total) * 100)}% spent
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budget Form */}
      {showBudgetForm && (
        <Card>
          <CardHeader>
            <CardTitle>Set Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetBudget} className="space-y-4">
              <div>
                <Label htmlFor="budget_total">Total Budget ({summary?.homeCurrency || 'USD'})</Label>
                <Input
                  id="budget_total"
                  type="number"
                  step="0.01"
                  placeholder="Enter total budget"
                  value={budgetData.budget_total}
                  onChange={(e) => setBudgetData({ ...budgetData, budget_total: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budget_transport">Transport</Label>
                  <Input
                    id="budget_transport"
                    type="number"
                    step="0.01"
                    value={budgetData.budget_transport}
                    onChange={(e) => setBudgetData({ ...budgetData, budget_transport: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget_accommodation">Accommodation</Label>
                  <Input
                    id="budget_accommodation"
                    type="number"
                    step="0.01"
                    value={budgetData.budget_accommodation}
                    onChange={(e) => setBudgetData({ ...budgetData, budget_accommodation: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget_food">Food</Label>
                  <Input
                    id="budget_food"
                    type="number"
                    step="0.01"
                    value={budgetData.budget_food}
                    onChange={(e) => setBudgetData({ ...budgetData, budget_food: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget_activities">Activities</Label>
                  <Input
                    id="budget_activities"
                    type="number"
                    step="0.01"
                    value={budgetData.budget_activities}
                    onChange={(e) => setBudgetData({ ...budgetData, budget_activities: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget_shopping">Shopping</Label>
                  <Input
                    id="budget_shopping"
                    type="number"
                    step="0.01"
                    value={budgetData.budget_shopping}
                    onChange={(e) => setBudgetData({ ...budgetData, budget_shopping: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget_misc">Misc</Label>
                  <Input
                    id="budget_misc"
                    type="number"
                    step="0.01"
                    value={budgetData.budget_misc}
                    onChange={(e) => setBudgetData({ ...budgetData, budget_misc: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Save Budget</Button>
                <Button type="button" variant="outline" onClick={() => setShowBudgetForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* View Mode Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          List View
        </Button>
        <Button
          variant={viewMode === 'category' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('category')}
        >
          By Category
        </Button>
        <Button
          variant={viewMode === 'daily' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('daily')}
        >
          By Day
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="label">Description</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JPY">JPY</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRANSPORT">Transport</SelectItem>
                      <SelectItem value="ACCOMMODATION">Accommodation</SelectItem>
                      <SelectItem value="FOOD">Food</SelectItem>
                      <SelectItem value="ACTIVITIES">Activities</SelectItem>
                      <SelectItem value="SHOPPING">Shopping</SelectItem>
                      <SelectItem value="MISC">Misc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Expense</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Conditional View Rendering */}
      {viewMode === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No expenses yet</p>
            ) : (
              <div className="space-y-2">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{expense.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category || 'Uncategorized'} • {format(new Date(expense.date), 'MMM d')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(expense.amount_original, expense.currency_original)}
                      </p>
                      {expense.currency_original !== summary?.homeCurrency && (
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(expense.amount_jpy, summary?.homeCurrency || 'USD')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === 'category' && <CategoryView />}

      {viewMode === 'daily' && (
        <div className="space-y-4">
          {Object.entries(summary?.byDay || {})
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, data]) => (
              <Card key={date}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{format(new Date(date), 'EEEE, MMM d')}</CardTitle>
                    <span className="text-2xl font-bold">
                      {formatCurrency(data.total, summary?.homeCurrency || 'USD')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {expenses
                      .filter(e => e.date.split('T')[0] === date)
                      .map(expense => (
                        <div key={expense.id} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium">{expense.label}</span>
                            <span className="text-muted-foreground ml-2">
                              {expense.category || 'Misc'}
                            </span>
                          </div>
                          <span>{formatCurrency(expense.amount_original, expense.currency_original)}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div> 
  ) 
} 