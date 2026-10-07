import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ExcelJS from 'exceljs'
import { format } from 'date-fns'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Generate a workbook
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Farclean CRM'
  workbook.created = new Date()

  // --- SHEET 1: LEADS ---
  const leadWhereClause = user.role === 'SALES' || user.role === 'STAFF'
    ? { OR: [{ salesOwnerId: user.id }, { picId: user.id }] }
    : {}

  const leads = await prisma.lead.findMany({
    where: leadWhereClause,
    include: { salesOwner: true, pic: true },
    orderBy: { createdAt: 'desc' }
  })

  const sheetLeads = workbook.addWorksheet('Leads')
  sheetLeads.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Company Name', key: 'companyName', width: 25 },
    { header: 'Contact Name', key: 'contactName', width: 25 },
    { header: 'Product Interest', key: 'productInterest', width: 20 },
    { header: 'Source', key: 'source', width: 15 },
    { header: 'Channel', key: 'channel', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Temperature', key: 'temperature', width: 15 },
    { header: 'Sales Owner', key: 'salesOwner', width: 20 },
    { header: 'Internal PIC', key: 'pic', width: 20 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ]
  sheetLeads.getRow(1).font = { bold: true }

  leads.forEach(lead => {
    sheetLeads.addRow({
      id: lead.id.split('-')[0],
      companyName: lead.companyName,
      contactName: lead.contactName,
      productInterest: lead.productInterest,
      source: lead.source,
      channel: lead.channel,
      status: lead.status,
      temperature: lead.temperature,
      salesOwner: lead.salesOwner?.name || '-',
      pic: lead.pic?.name || '-',
      createdAt: format(new Date(lead.createdAt), 'dd MMM yyyy')
    })
  })

  // --- SHEET 2: OPPORTUNITIES ---
  const oppWhereClause = user.role === 'SALES' || user.role === 'STAFF'
    ? { salesOwnerId: user.id }
    : {}

  const opps = await prisma.opportunity.findMany({
    where: oppWhereClause,
    include: { company: true, contact: true, stage: true, salesOwner: true },
    orderBy: { createdAt: 'desc' }
  })

  const sheetOpps = workbook.addWorksheet('Opportunities')
  sheetOpps.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Project Name', key: 'name', width: 30 },
    { header: 'Company', key: 'company', width: 25 },
    { header: 'Contact', key: 'contact', width: 25 },
    { header: 'Stage', key: 'stage', width: 20 },
    { header: 'Value (Rp)', key: 'estimatedValue', width: 20 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Sales Owner', key: 'salesOwner', width: 20 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ]
  sheetOpps.getRow(1).font = { bold: true }

  opps.forEach(opp => {
    sheetOpps.addRow({
      id: opp.id.split('-')[0],
      name: opp.name,
      company: opp.company.name,
      contact: opp.contact?.name || '-',
      stage: opp.stage?.name || '-',
      estimatedValue: opp.estimatedValue,
      status: opp.isWon ? 'WON' : opp.isLost ? 'LOST' : 'OPEN',
      salesOwner: opp.salesOwner?.name || '-',
      createdAt: format(new Date(opp.createdAt), 'dd MMM yyyy')
    })
  })

  // Set response headers and return the buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Farclean_CRM_Database.xlsx"',
    },
  })
}
