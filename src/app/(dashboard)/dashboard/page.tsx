import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PipelineChart } from '@/components/charts/PipelineChart'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { format } from 'date-fns'
import Link from 'next/link'
import { AlertCircle, CalendarClock, PhoneOutgoing, User } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const isRestricted = user?.role === 'SALES' || user?.role === 'STAFF'

  const oppWhere = isRestricted ? { salesOwnerId: user?.id } : {}
  const leadWhere = isRestricted ? { OR: [{ salesOwnerId: user?.id }, { picId: user?.id }] } : {}

  const startOfTomorrow = new Date()
  startOfTomorrow.setHours(24, 0, 0, 0)

  const overdueLeadsWhere = isRestricted
    ? { salesOwnerId: user?.id, status: { not: 'CONVERTED' }, nextFollowUp: { lt: startOfTomorrow, not: null } }
    : { status: { not: 'CONVERTED' }, nextFollowUp: { lt: startOfTomorrow, not: null } }

  const [totalLeads, activeOpps, wonOpps, overdueTasks, overdueLeads] = await Promise.all([
    prisma.lead.count({ where: leadWhere }),
    prisma.opportunity.findMany({ where: { ...oppWhere, isWon: false, isLost: false }, include: { stage: true } }),
    prisma.opportunity.findMany({ where: { ...oppWhere, isWon: true } }),
    prisma.task.findMany({ 
      where: { 
        assignedUserId: user?.id,
        status: { not: 'DONE' },
        dueDate: { lt: new Date() }
      },
      include: { company: true }
    }),
    prisma.lead.findMany({
      where: overdueLeadsWhere,
      include: { salesOwner: true },
      orderBy: { nextFollowUp: 'asc' }
    })
  ])

  const wonDealsCount = wonOpps.length
  const totalRevenue = wonOpps.reduce((sum, o) => sum + o.estimatedValue, 0)
  
  const pipelineMap: Record<string, number> = {}
  activeOpps.forEach(opp => {
    const stageName = opp.stage?.name || 'Unstaged'
    pipelineMap[stageName] = (pipelineMap[stageName] || 0) + opp.estimatedValue
  })

  const chartData = Object.entries(pipelineMap).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* OVERDUE TASKS REMINDER */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-red-800">Peringatan: {overdueTasks.length} Tugas Lewat Jatuh Tempo!</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {overdueTasks.map(task => (
                    <li key={task.id}>
                      <strong>{task.title}</strong> - {task.company?.name || 'General'} 
                      <span className="text-red-500 ml-2">({format(new Date(task.dueDate!), 'dd MMM yyyy')})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION REQUIRED: LEADS FOLLOW UP */}
      {overdueLeads.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <PhoneOutgoing className="h-6 w-6 text-orange-500" />
            </div>
            <div className="ml-3 w-full">
              <h3 className="text-base font-bold text-orange-800">
                Wajib Follow Up: Ada {overdueLeads.length} Prospek (Leads) yang Harus Dihubungi!
              </h3>
              <p className="text-sm text-orange-700 mb-3">
                {isRestricted ? "Berikut adalah daftar prospek Anda yang sudah masuk jadwal follow-up hari ini atau telah terlewat:" : "Berikut adalah daftar prospek dari seluruh tim Sales yang harus segera di-follow up hari ini:"}
              </p>
              
              <div className="bg-white rounded border border-orange-200 overflow-hidden">
                <table className="min-w-full divide-y divide-orange-200 text-sm text-left">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="px-4 py-2 font-medium text-orange-800">Company Name</th>
                      <th className="px-4 py-2 font-medium text-orange-800">Status / Temp</th>
                      <th className="px-4 py-2 font-medium text-orange-800">Jadwal Follow Up</th>
                      {!isRestricted && <th className="px-4 py-2 font-medium text-orange-800">Sales In-Charge</th>}
                      <th className="px-4 py-2 font-medium text-orange-800 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {overdueLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-orange-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{lead.companyName}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${lead.temperature === 'HOT' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                            {lead.status} • {lead.temperature}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-bold text-orange-600">
                          {format(new Date(lead.nextFollowUp!), 'dd MMM yyyy')}
                        </td>
                        {!isRestricted && (
                          <td className="px-4 py-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            {lead.salesOwner?.name || 'Unassigned'}
                          </td>
                        )}
                        <td className="px-4 py-2 text-right">
                          <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline font-medium">Buka Lead</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOpps.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Won</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonDealsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOpps.slice(0, 5).map(opp => (
                <div key={opp.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{opp.name}</p>
                    <p className="text-sm text-gray-500">{opp.stage?.name || 'New'}</p>
                  </div>
                  <div className="font-bold">
                    Rp {opp.estimatedValue.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
              {activeOpps.length === 0 && (
                <p className="text-sm text-gray-500">No active opportunities.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
