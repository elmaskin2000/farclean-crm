import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateLeadStatus, addLeadActivity, convertAction } from '@/app/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { MessageSquare, Phone, Mail, Calendar, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'


export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      salesOwner: true, pic: true,
      leadActivities: { orderBy: { createdAt: 'asc' } } // Ascending so it reads top to bottom like a chat
    }
  })

  if (!lead) notFound()

  const stages = await prisma.pipelineStage.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{lead.companyName}</h1>
        <div className="flex gap-2">
          <Badge variant={lead.temperature === 'HOT' ? 'destructive' : lead.temperature === 'WARM' ? 'default' : 'secondary'}>
            {lead.temperature}
          </Badge>
          <Badge variant="outline">{lead.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Lead Details</CardTitle>
              <Link href={`/leads/${id}/edit`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Contact Person</div>
                    <div className="font-medium">{lead.contactName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">No. WA / Telepon</div>
                    <div className="font-medium">{lead.phone || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{lead.email || '-'}</div>
                  </div>
                <div>
                  <div className="text-sm text-gray-500">Product Interest</div>
                  <div className="font-medium">{lead.productInterest || '-'}</div>
                </div>
                <div>
                  <div>
                  <div className="text-sm text-gray-500">Tanggal Lead Masuk</div>
                  <div className="font-medium text-purple-700">{lead.inquiryDate ? format(new Date(lead.inquiryDate), 'dd MMM yyyy') : format(new Date(lead.createdAt), 'dd MMM yyyy')}</div>
                </div>
                <div className="text-sm text-gray-500">Source (Dapat dr mn)</div>
                  <div className="font-medium text-blue-700">{lead.source || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Channel (Lewat mn)</div>
                  <div className="font-medium text-blue-700">{lead.channel || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Sales Owner</div>
                  <div className="font-medium">{lead.salesOwner?.name || 'Unassigned'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Created At</div>
                  <div className="font-medium">{format(new Date(lead.createdAt), 'PPP')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow-up Progress & Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg mb-6 max-h-[400px] overflow-y-auto">
                {lead.leadActivities.length === 0 ? (
                  <div className="text-center text-sm text-gray-500 py-8">Belum ada riwayat follow-up.</div>
                ) : (
                  lead.leadActivities.map(act => (
                    <div key={act.id} className={`flex flex-col ${act.direction === 'INBOUND' ? 'items-start' : 'items-end'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${act.direction === 'INBOUND' ? 'bg-white border text-gray-800 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold ${act.direction === 'INBOUND' ? 'text-gray-500' : 'text-blue-200'}`}>
                            {act.type} {act.direction === 'INBOUND' ? '(Pesan dari Lead)' : '(Balasan Kita)'}
                          </span>
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{act.description}</div>
                        <div className={`text-[10px] mt-1 text-right ${act.direction === 'INBOUND' ? 'text-gray-400' : 'text-blue-200'}`}>
                          {format(new Date(act.createdAt), 'dd MMM yyyy, HH:mm')}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form action={addLeadActivity} className="space-y-3 border-t pt-4">
                <input type="hidden" name="leadId" value={lead.id} />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <select name="direction" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-2" required>
                      <option value="OUTBOUND">Balasan Kita (Outbound)</option>
                      <option value="INBOUND">Pesan dari Lead (Inbound)</option>
                    </select>
                    <select name="type" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="CALL">Call</option>
                      <option value="EMAIL">Email</option>
                      <option value="MEETING">Meeting</option>
                      <option value="NOTE">Internal Note</option>
                    </select>
                  </div>
                  <div className="flex-[2]">
                    <textarea 
                      name="description" 
                      placeholder="Tulis pesan follow-up atau balasan dari klien..." 
                      className="w-full h-full min-h-[80px] rounded-md border border-gray-300 p-3 text-sm resize-none" 
                      required 
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Catat Pesan / Progress</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateLeadStatus} className="space-y-4">
                <input type="hidden" name="leadId" value={lead.id} />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Temperature</div>
                  <select name="temperature" defaultValue={lead.temperature} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option value="COLD">COLD</option>
                    <option value="WARM">WARM</option>
                    <option value="HOT">HOT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Status</div>
                  <select name="status" defaultValue={lead.status} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="UNQUALIFIED">UNQUALIFIED</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">Update</Button>
              </form>
            </CardContent>
          </Card>

          {lead.status === 'QUALIFIED' && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Convert to Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={convertAction} className="space-y-4">
                  <input type="hidden" name="leadId" value={lead.id} />
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Project Name</div>
                    <input name="name" placeholder="E.g. Cleanroom Expansion" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Estimated Value (Rp)</div>
                    <input name="estimatedValue" type="number" min="0" placeholder="10000000" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Pipeline Stage</div>
                    <select name="stageId" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required>
                      {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Convert to Project</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
