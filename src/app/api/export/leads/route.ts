import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const whereClause = user.role === 'SALES' || user.role === 'STAFF'
    ? { OR: [{ salesOwnerId: user.id }, { picId: user.id }] }
    : {}

  const leads = await prisma.lead.findMany({
    where: whereClause,
    include: { salesOwner: true }
  })

  let csvContent = 'ID,Company,Contact,Status,Temperature,Estimated Value,Sales Owner,Created At\n'

  leads.forEach(lead => {
    const row = [
      lead.id,
      `"${lead.companyName}"`,
      `"${lead.contactName}"`,
      lead.status,
      lead.temperature,
      lead.estimatedValue || 0,
      `"${lead.salesOwner?.name || ''}"`,
      lead.createdAt.toISOString()
    ].join(',')
    csvContent += row + '\n'
  })

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="leads_export.csv"',
    },
  })
}
