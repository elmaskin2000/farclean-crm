import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default async function ActivitiesPage() {
  const activities = await prisma.leadActivity.findMany({
    orderBy: { createdAt: 'desc' },
    include: { lead: true }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Activities & Follow-ups</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Lead / Company</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">No activities found.</TableCell>
                </TableRow>
              ) : (
                activities.map(act => (
                  <TableRow key={act.id}>
                    <TableCell className="whitespace-nowrap">{format(new Date(act.createdAt), 'dd MMM yyyy, HH:mm')}</TableCell>
                    <TableCell><Badge variant="outline">{act.type}</Badge></TableCell>
                    <TableCell className="font-medium">{act.lead.companyName}</TableCell>
                    <TableCell className="text-gray-600">{act.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
