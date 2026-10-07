import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addQuotationItem } from '@/app/actions/product'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import PrintButton from '@/components/features/PrintButton'

export default async function QuotationPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: {
      company: true,
      contact: true,
      salesperson: true,
      items: { include: { product: true } }
    }
  })

  if (!quotation) notFound()
  
  const products = await prisma.product.findMany({ where: { active: true }, orderBy: { name: 'asc' } })

  return (
    <div className="space-y-6">
      <Card className="print:hidden max-w-4xl mx-auto mb-6">
        <CardHeader>
          <CardTitle>Add Quotation Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addQuotationItem} className="flex gap-4 items-end">
            <input type="hidden" name="quotationId" value={quotation.id} />
            <div className="flex-1 space-y-2">
              <Label htmlFor="productId">Product</Label>
              <select 
                id="productId" 
                name="productId" 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Select Product...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} - Rp{p.basePrice.toLocaleString('id-ID')}</option>)}
              </select>
            </div>
            <div className="w-24 space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue="1" min="1" required />
            </div>
            <div className="w-32 space-y-2">
              <Label htmlFor="discount">Discount (Rp)</Label>
              <Input id="discount" name="discount" type="number" defaultValue="0" min="0" required />
            </div>
            <Button type="submit">Add Item</Button>
          </form>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto bg-white shadow p-10 min-h-[842px] relative text-gray-900 border">
        <div className="print:hidden absolute top-4 right-4 flex gap-2">
          <Link href={`/opportunities/${quotation.opportunityId}`} className="text-sm font-medium text-blue-600 hover:underline px-4 py-2 border rounded-md">Back to Opp</Link>
          <PrintButton />
        </div>

        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <div className="flex gap-4 items-center"><img src="/logo.jpg" alt="Farclean Logo" className="h-12 w-auto object-contain" /><h1 className="text-3xl font-bold tracking-tight text-blue-900">QUOTATION</h1></div>
            <p className="text-sm text-gray-500 mt-1">PT Farclean Indonesia</p>
            <p className="text-xs text-gray-500">Jl. Industri Raya No.1, Jakarta</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">{quotation.quotationNumber}</p>
            <p className="text-sm text-gray-600 mt-1">Date: {format(new Date(quotation.date), 'dd MMM yyyy')}</p>
            <p className="text-sm text-gray-600">Valid Until: {format(new Date(quotation.validUntil), 'dd MMM yyyy')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quotation For</p>
            <p className="font-bold text-gray-900">{quotation.company.name}</p>
            <p className="text-sm text-gray-600">{quotation.contact?.name}</p>
            <p className="text-sm text-gray-600">{quotation.company.city}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sales Rep</p>
            <p className="font-medium text-gray-900">{quotation.salesperson.name}</p>
            <p className="text-sm text-gray-600">{quotation.salesperson.email}</p>
          </div>
        </div>

        <table className="w-full text-left mb-8 border-collapse">
          <thead>
            <tr className="border-y border-gray-300 text-gray-900">
              <th className="py-3 px-2 font-semibold">Item</th>
              <th className="py-3 px-2 font-semibold text-center">Qty</th>
              <th className="py-3 px-2 font-semibold text-center">Unit</th>
              <th className="py-3 px-2 font-semibold text-right">Price (Rp)</th>
              <th className="py-3 px-2 font-semibold text-right">Discount</th>
              <th className="py-3 px-2 font-semibold text-right">Total (Rp)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotation.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-sm text-gray-500">No items added yet.</td>
              </tr>
            ) : (
              quotation.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-2 text-sm">{item.product.name}<br/><span className="text-gray-500 text-xs">{item.description}</span></td>
                  <td className="py-3 px-2 text-sm text-center">{item.quantity}</td>
                  <td className="py-3 px-2 text-sm text-center">{item.unit}</td>
                  <td className="py-3 px-2 text-sm text-right">{item.unitPrice.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-2 text-sm text-right text-red-500">{item.discount > 0 ? `-${item.discount.toLocaleString('id-ID')}` : '-'}</td>
                  <td className="py-3 px-2 text-sm text-right">{item.subtotal.toLocaleString('id-ID')}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="border-t-2 border-gray-900 font-medium">
            <tr>
              <td colSpan={4}></td>
              <td className="py-2 px-2 text-right">Subtotal</td>
              <td className="py-2 px-2 text-right">Rp{quotation.subtotal.toLocaleString('id-ID')}</td>
            </tr>
            <tr>
              <td colSpan={4}></td>
              <td className="py-2 px-2 text-right">Tax (11%)</td>
              <td className="py-2 px-2 text-right">Rp{quotation.tax.toLocaleString('id-ID')}</td>
            </tr>
            <tr>
              <td colSpan={4}></td>
              <td className="py-3 px-2 text-right font-bold text-lg">Grand Total</td>
              <td className="py-3 px-2 text-right font-bold text-lg">Rp{quotation.grandTotal.toLocaleString('id-ID')}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 text-center">
          This quotation is valid until {format(new Date(quotation.validUntil), 'dd MMM yyyy')}. Terms & Conditions apply.
        </div>
      </div>
    </div>
  )
}
