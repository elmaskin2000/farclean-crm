import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'


export default async function CompaniesPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'MANAGER') {
    redirect('/dashboard')
  }

  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
        <Link href="/companies/new" className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md font-medium inline-flex items-center justify-center">Create Company</Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No companies found. Create a new company to get started.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.industry || '-'}</TableCell>
                    <TableCell>{company.city || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{company.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/companies/${company.id}`} className="text-blue-600 hover:underline text-sm font-medium">View</Link>
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
