import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PipelineChart } from '@/components/charts/PipelineChart'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { format } from 'date-fns'
import Link from 'next/link'
import { AlertCircle, CalendarClock } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const oppWhere = user?.role === 'SALES' || user?.role === 'STAFF' 
    ? { salesOwnerId: user.id } // Note: picId is on Lead, so we filter by salesOwnerId
    : {}

  const leadWhere = user?.role === 'SALES' || user?.role === 'STAFF' 
    ? { OR: [{ salesOwnerId: user.id }, { picId: user.id }] } 
    : {}

  const [totalLeads, activeOpps, wonOpps, overdueTasks] = await Promise.all([
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
    })
  ])

  const wonDealsCount = wonOpps.length
  const totalRevenue = wonOpps.reduce((sum, o) => sum + o.estimatedValue, 0)
  
  // Aggregate pipeline data
  const pipelineMap: Record<string, number> = {}
  activeOpps.forEach(opp => {
    const stageName = opp.stage?.name || 'Unstaged'
    pipelineMap[stageName] = (pipelineMap[stageName] || 0) + opp.estimatedValue
  })

  const chartData = Object.entries(pipelineMap).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* OVERDUE REMINDER ALERT */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-red-800">Peringatan: {overdueTasks.length} Follow-up / Tugas Lewat Jatuh Tempo!</h3>
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
              <div className="mt-4">
                <Link href="/tasks" className="text-sm font-medium text-red-800 hover:text-red-700 underline">Lihat semua tugas &rarr;</Link>
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
            <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonDealsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (Won)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Value by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineChart data={chartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
