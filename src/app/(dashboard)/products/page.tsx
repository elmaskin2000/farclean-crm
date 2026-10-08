import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'


export default async function ProductsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'MANAGER') {
    redirect('/dashboard')
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link href="/products/new" className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md font-medium inline-flex items-center justify-center">Add Product</Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No products found. Add a new product to get started.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-gray-600">{product.sku}</TableCell>
                    <TableCell className="font-semibold">{product.name}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>Rp{product.basePrice.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge variant={product.active ? "default" : "secondary"}>{product.active ? 'Active' : 'Inactive'}</Badge>
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
