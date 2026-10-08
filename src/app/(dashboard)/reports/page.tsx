import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'


export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
      <Card>
        <CardHeader><CardTitle>Coming Soon</CardTitle></CardHeader>
        <CardContent>
          <p className="text-gray-500">The reporting module is currently under development. It will include Lead Reports, Sales Pipeline Analytics, and Conversion Rates.</p>
        </CardContent>
      </Card>
    </div>
  )
}
