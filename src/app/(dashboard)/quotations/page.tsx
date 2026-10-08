import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'


export default async function QuotationsIndexPage() {
  const quotations = await prisma.quotation.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      company: true,
      salesperson: true,
      opportunity: true,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
        {/* We don't have a direct "Create Quotation" here because a quotation requires an Opportunity. 
            Sales should go to an Opportunity and click "Create Quotation" there. */}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Opportunity</TableHead>
                <TableHead>Grand Total (Rp)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No quotations found. Go to an Opportunity to create a quotation.
                  </TableCell>
                </TableRow>
              ) : (
                quotations.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.quotationNumber}</TableCell>
                    <TableCell>{format(new Date(q.date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{q.company.name}</TableCell>
                    <TableCell>{q.opportunity?.name || '-'}</TableCell>
                    <TableCell>{q.grandTotal.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{q.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/quotations/${q.id}`} className="text-blue-600 hover:underline text-sm font-medium">View / Print</Link>
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
