import { createLead } from '@/app/actions'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const dynamic = 'force-dynamic'


export default async function NewLeadPage() {
  const users = await prisma.user.findMany({ where: { role: 'SALES' }, orderBy: { name: 'asc' } })
  const allUsers = await prisma.user.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Create Lead</h1>
      <Card>
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createLead} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" name="companyName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input id="contactName" name="contactName" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor WA / Telepon</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="0812..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="contoh@perusahaan.com" />
                </div>
              </div>
            
            <div className="space-y-2">
                <Label htmlFor="productInterest">Product Interest</Label>
                <Input id="productInterest" name="productInterest" placeholder="e.g. Cleanroom Door" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (Notes)</Label>
                <textarea id="notes" name="notes" rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Informasi tambahan tentang prospek ini..."></textarea>
              </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="inquiryDate">Tanggal Lead Masuk (Inquiry Date)</Label>
                <Input type="date" id="inquiryDate" name="inquiryDate" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="source">Source (Dapat dari mana)</Label>
                <Input id="source" name="source" placeholder="e.g. Google Search, Referensi Teman" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel">Channel (Masuk lewat mana)</Label>
                <select id="channel" name="channel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <select 
                  id="temperature" 
                  name="temperature"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="COLD">COLD</option>
                  <option value="WARM">WARM</option>
                  <option value="HOT">HOT</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesOwnerId">Assign To (Sales)</Label>
                <select 
                  id="salesOwnerId" 
                  name="salesOwnerId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="picId">PIC (Internal Team)</Label>
              <select 
                id="picId" 
                name="picId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Unassigned</option>
                {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="submit">Save Lead</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
