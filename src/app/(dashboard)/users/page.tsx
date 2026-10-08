import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { deleteUser } from '@/app/actions/user'

export const dynamic = 'force-dynamic'


export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data karyawan, PIC, dan hak akses.</p>
        </div>
        <Link href="/users/new" className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md font-medium inline-flex items-center justify-center">
          Tambahkan User
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Email (Login)</TableHead>
                <TableHead>Role / Jabatan</TableHead>
                <TableHead>Didaftarkan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'MANAGER' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(user.createdAt), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={user.id} />
                      <Button type="submit" variant="destructive" size="sm">Hapus</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
