import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createQuotation, updateOpportunityStage } from '@/app/actions/quote'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const opp = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      company: true,
      stage: true,
      salesOwner: true,
      quotations: true,
    }
  })

  if (!opp) notFound()

  const stages = await prisma.pipelineStage.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{opp.name}</h1>
        <div className="flex gap-2">
          {opp.isWon && <Badge className="bg-green-500">WON</Badge>}
          {opp.isLost && <Badge variant="destructive">LOST</Badge>}
          {!opp.isWon && !opp.isLost && <Badge variant="outline">{opp.stage?.name}</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Company</div>
                  <div className="font-medium">{opp.company.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Estimated Value</div>
                  <div className="font-medium text-green-600">Rp{opp.estimatedValue.toLocaleString('id-ID')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Sales Owner</div>
                  <div className="font-medium">{opp.salesOwner?.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Quotations</CardTitle>
              <form action={createQuotation}>
                <input type="hidden" name="opportunityId" value={opp.id} />
                <Button type="submit" size="sm">Create Quotation</Button>
              </form>
            </CardHeader>
            <CardContent>
              {opp.quotations.length === 0 ? (
                <div className="text-sm text-gray-500">No quotations yet.</div>
              ) : (
                <div className="space-y-3">
                  {opp.quotations.map(q => (
                    <div key={q.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <div className="font-medium">{q.quotationNumber}</div>
                        <div className="text-xs text-gray-500">{q.status}</div>
                      </div>
                      <Link href={`/quotations/${q.id}`} className="text-blue-600 hover:underline text-sm font-medium">View</Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateOpportunityStage} className="space-y-4">
                <input type="hidden" name="opportunityId" value={opp.id} />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Pipeline Stage</div>
                  <select name="stageId" defaultValue={opp.stageId || ''} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="isWon" value="true" defaultChecked={opp.isWon} />
                    Mark as WON
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="isLost" value="true" defaultChecked={opp.isLost} />
                    Mark as LOST
                  </label>
                </div>
                <Button type="submit" className="w-full">Update</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
