import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'


export default async function OpportunitiesPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  // RBAC Filter
  const whereClause = user?.role === 'SALES' || user?.role === 'STAFF' 
    ? { salesOwnerId: user.id } 
    : {}

  const opportunities = await prisma.opportunity.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: { company: true, stage: true, salesOwner: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Projects / Deals</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar semua project, termasuk yang sudah WON atau LOST.</p>
        </div>
        <Link href="/pipeline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 h-10 px-4 py-2 rounded-md font-medium inline-flex items-center justify-center">
          &larr; Kembali ke Pipeline Kanban
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Stage / Status</TableHead>
                <TableHead>Value (Rp)</TableHead>
                <TableHead>Sales Owner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Belum ada project yang tercatat.
                  </TableCell>
                </TableRow>
              ) : (
                opportunities.map((opp) => (
                  <TableRow key={opp.id}>
                    <TableCell className="font-medium text-blue-600">
                      <Link href={`/opportunities/${opp.id}`}>{opp.name}</Link>
                    </TableCell>
                    <TableCell>{opp.company?.name || '-'}</TableCell>
                    <TableCell>
                      {opp.isWon ? (
                        <Badge className="bg-green-500">WON</Badge>
                      ) : opp.isLost ? (
                        <Badge variant="destructive">LOST</Badge>
                      ) : (
                        <Badge variant="outline">{opp.stage?.name || 'Unstaged'}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID').format(opp.estimatedValue || 0)}
                    </TableCell>
                    <TableCell>{opp.salesOwner?.name || 'Unassigned'}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/opportunities/${opp.id}`} className="text-blue-600 hover:underline text-sm font-medium">View</Link>
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
