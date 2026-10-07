import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

const STAGES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'NEED_ANALYSIS',
  'QUOTATION',
  'NEGOTIATION',
]

export default async function PipelinePage() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const whereClause = user?.role === 'SALES' || user?.role === 'STAFF' ? { OR: [{ salesOwnerId: user.id }, { picId: user.id }] } : {}
  const opportunities = await prisma.opportunity.findMany({
    
    where: { ...whereClause, isWon: false, isLost: false },
    include: { company: true, salesOwner: true },
    orderBy: { createdAt: 'desc' },
  })

  // We are using a pseudo-stage since we removed PipelineStage relation to simplify SQLite version
  // Actually, wait, PipelineStage is in schema, but we don't have default seeds for it.
  // I will just use string comparison for stages if we didn't use relations, but let's check schema.
  // Opportunity has `stageId` which links to PipelineStage.
  
  const pipelineStages = await prisma.pipelineStage.findMany({
    orderBy: { order: 'asc' },
  })
  
  // If no stages, create them on the fly or just show empty
  const hasStages = pipelineStages.length > 0;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
      </div>

      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {hasStages ? pipelineStages.map((stage) => {
          const stageOpps = opportunities.filter((o) => o.stageId === stage.id)
          const totalValue = stageOpps.reduce((sum, o) => sum + o.estimatedValue, 0)
          
          return (
            <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col bg-gray-100 rounded-lg p-3">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-semibold text-gray-700">{stage.name}</h3>
                <span className="bg-gray-200 text-gray-600 text-xs py-1 px-2 rounded-full">
                  {stageOpps.length}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-3 px-1">
                Value: Rp{totalValue.toLocaleString('id-ID')}
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {stageOpps.map((opp) => (
                  <Card key={opp.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-sm">{opp.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-2">
                      <p className="text-xs font-medium text-gray-900">{opp.company.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Rp{opp.estimatedValue.toLocaleString('id-ID')}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {opp.salesOwner.name}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        }) : (
          <div className="text-gray-500">
            Pipeline stages not configured. Please run seed or add stages in settings.
          </div>
        )}
      </div>
    </div>
  )
}
