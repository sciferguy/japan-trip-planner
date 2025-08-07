import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { auth } from "@/auth"

export default async function ChecklistsPage() {
  const session = await auth()

  // Mock data for demonstration
  const checklists = {
    packing: [
      { id: 1, item: "Passport", completed: true },
      { id: 2, item: "JR Rail Pass", completed: true },
      { id: 3, item: "Travel insurance", completed: false },
      { id: 4, item: "Portable WiFi device", completed: false },
      { id: 5, item: "Universal power adapter", completed: false },
      { id: 6, item: "Comfortable walking shoes", completed: true },
    ],
    documents: [
      { id: 7, item: "Flight confirmations", completed: true },
      { id: 8, item: "Hotel reservations", completed: false },
      { id: 9, item: "Travel insurance documents", completed: false },
      { id: 10, item: "Emergency contact information", completed: true },
    ],
    preparation: [
      { id: 11, item: "Download translation app", completed: false },
      { id: 12, item: "Research local customs", completed: true },
      { id: 13, item: "Currency exchange", completed: false },
      { id: 14, item: "Download offline maps", completed: false },
    ]
  }

  const getCompletionRate = (items: typeof checklists.packing) => {
    const completed = items.filter(item => item.completed).length
    return Math.round((completed / items.length) * 100)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Travel Checklists
          </h1>
          <p className="text-stone-600 text-zen">
            Stay organized with personalized checklists for your Japan trip
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Add New Item
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="text-tea-700 flex items-center gap-2">
              🎒 Packing List
            </CardTitle>
            <CardDescription>
              {getCompletionRate(checklists.packing)}% complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklists.packing.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`packing-${item.id}`} 
                    checked={item.completed}
                  />
                  <label 
                    htmlFor={`packing-${item.id}`} 
                    className={`text-sm ${item.completed ? 'line-through text-stone-400' : ''}`}
                  >
                    {item.item}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="text-bamboo-700 flex items-center gap-2">
              📄 Documents
            </CardTitle>
            <CardDescription>
              {getCompletionRate(checklists.documents)}% complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklists.documents.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`docs-${item.id}`} 
                    checked={item.completed}
                  />
                  <label 
                    htmlFor={`docs-${item.id}`} 
                    className={`text-sm ${item.completed ? 'line-through text-stone-400' : ''}`}
                  >
                    {item.item}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="text-sakura-700 flex items-center gap-2">
              🗾 Pre-Trip Preparation
            </CardTitle>
            <CardDescription>
              {getCompletionRate(checklists.preparation)}% complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklists.preparation.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`prep-${item.id}`} 
                    checked={item.completed}
                  />
                  <label 
                    htmlFor={`prep-${item.id}`} 
                    className={`text-sm ${item.completed ? 'line-through text-stone-400' : ''}`}
                  >
                    {item.item}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Your trip preparation status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Total Items</span>
              <span>
                {checklists.packing.filter(i => i.completed).length + 
                 checklists.documents.filter(i => i.completed).length + 
                 checklists.preparation.filter(i => i.completed).length} / {' '}
                {checklists.packing.length + checklists.documents.length + checklists.preparation.length}
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-tea-500 to-sakura-500 h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.round(
                    ((checklists.packing.filter(i => i.completed).length + 
                      checklists.documents.filter(i => i.completed).length + 
                      checklists.preparation.filter(i => i.completed).length) / 
                     (checklists.packing.length + checklists.documents.length + checklists.preparation.length)) * 100
                  )}%` 
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}