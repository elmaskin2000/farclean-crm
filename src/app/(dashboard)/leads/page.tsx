import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function LeadsPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  // RBAC Filter
  const whereClause = user?.role === 'SALES' || user?.role === 'STAFF' 
    ? { OR: [{ salesOwnerId: user.id }, { picId: user.id }] } 
    : {}

  const leads = await prisma.lead.findMany({
    where: { ...whereClause, status: { not: 'CONVERTED' } },
    orderBy: { createdAt: 'desc' },
    include: { salesOwner: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <div className="flex gap-2">
          {user?.role !== 'STAFF' && (
            <> <a href="/api/export/leads" className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 h-10 px-4 py-2 rounded-md font-medium inline-flex items-center justify-center">Export CSV</a>
          <a href="/api/export/excel" className="bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2 rounded-md font-medium inline-flex items-center justify-center">Export Excel</a> </>
          )}
          <Link href="/leads/new" className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md font-medium inline-flex items-center justify-center">Create Lead</Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source / Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No leads found. Create a new lead to get started.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.companyName}</TableCell>
                    <TableCell>{lead.contactName}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{lead.source || '-'}</div>
                      <div className="text-xs text-gray-500">{lead.channel || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={lead.temperature === 'HOT' ? 'destructive' : lead.temperature === 'WARM' ? 'default' : 'secondary'}>
                        {lead.temperature}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.salesOwner?.name || 'Unassigned'}</TableCell>
                    <TableCell>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline text-sm font-medium">View</Link>
                    </TableCell>
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
