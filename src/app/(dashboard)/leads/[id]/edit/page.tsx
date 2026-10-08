import { updateLead } from '@/app/actions'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function EditLeadPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  
  const lead = await prisma.lead.findUnique({
    where: { id }
  })

  if (!lead) notFound()

  // Prevent Sales from editing leads they don't own (Optional security layer)
  if (session?.user?.role === 'SALES' && lead.salesOwnerId !== session.user.id && lead.picId !== session.user.id) {
    redirect('/leads')
  }

  const inquiryDateStr = lead.inquiryDate ? new Date(lead.inquiryDate).toISOString().split('T')[0] : ''

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Edit Lead</h1>
        <Link href={`/leads/${id}`} className="text-sm text-gray-500 hover:underline">
          Batal
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ubah Informasi Prospek</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateLead} className="space-y-4">
            <input type="hidden" name="id" value={id} />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="inquiryDate">Tanggal Lead Masuk</Label>
                <Input type="date" id="inquiryDate" name="inquiryDate" defaultValue={inquiryDateStr} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" name="companyName" defaultValue={lead.companyName} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input id="contactName" name="contactName" defaultValue={lead.contactName} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor WA / Telepon</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={lead.phone || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={lead.email || ''} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productInterest">Product Interest</Label>
              <Input id="productInterest" name="productInterest" defaultValue={lead.productInterest || ''} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input id="source" name="source" defaultValue={lead.source || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel">Channel</Label>
                <select id="channel" name="channel" defaultValue={lead.channel || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="">-- Pilih Channel --</option>
                  <option value="Website">Website</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Email">Email</option>
                  <option value="Direct Call">Direct Call</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Link href={`/leads/${id}`}>
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
