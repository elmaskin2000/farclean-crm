import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AuditLogPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard') // Protect page
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100, // Show last 100 logs
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Audit Trail</h1>
        <p className="text-gray-500 text-sm mt-1">Rekam jejak seluruh aktivitas krusial di dalam sistem.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>User / Aktor</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Entitas Terkait</TableHead>
                <TableHead>Detail Perubahan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Belum ada log aktivitas.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">{format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm:ss')}</TableCell>
                    <TableCell className="font-medium text-sm">{log.userId}</TableCell>
                    <TableCell className="text-sm">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">{log.action}</span>
                    </TableCell>
                    <TableCell className="text-sm">{log.entity} <span className="text-xs text-gray-400">({log.entityId})</span></TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-md truncate">{log.newValue}</TableCell>
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
