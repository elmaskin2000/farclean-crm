import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <p className="text-gray-500">You have no new notifications.</p>
        </CardContent>
      </Card>
    </div>
  )
}
