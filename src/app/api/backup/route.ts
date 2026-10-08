import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Farclean CRM System'
    workbook.created = new Date()

    // 1. Users
    const users = await prisma.user.findMany()
    const sheetUsers = workbook.addWorksheet('Users')
    sheetUsers.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ]
    users.forEach(u => sheetUsers.addRow(u))

    // 2. Companies
    const companies = await prisma.company.findMany()
    const sheetCompanies = workbook.addWorksheet('Companies')
    sheetCompanies.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Industry', key: 'industry', width: 20 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ]
    companies.forEach(c => sheetCompanies.addRow(c))

    // 3. Contacts
    const contacts = await prisma.contact.findMany()
    const sheetContacts = workbook.addWorksheet('Contacts')
    sheetContacts.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Company ID', key: 'companyId', width: 36 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
    ]
    contacts.forEach(c => sheetContacts.addRow(c))

    // 4. Leads
    const leads = await prisma.lead.findMany()
    const sheetLeads = workbook.addWorksheet('Leads')
    sheetLeads.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Company Name', key: 'companyName', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Temperature', key: 'temperature', width: 15 },
      { header: 'Sales Owner ID', key: 'salesOwnerId', width: 36 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ]
    leads.forEach(l => sheetLeads.addRow(l))

    // 5. Opportunities
    const opps = await prisma.opportunity.findMany()
    const sheetOpps = workbook.addWorksheet('Opportunities')
    sheetOpps.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Company ID', key: 'companyId', width: 36 },
      { header: 'Value', key: 'estimatedValue', width: 15 },
      { header: 'Is Won', key: 'isWon', width: 10 },
      { header: 'Is Lost', key: 'isLost', width: 10 },
      { header: 'Sales Owner ID', key: 'salesOwnerId', width: 36 },
    ]
    opps.forEach(o => sheetOpps.addRow(o))

    // 6. Activities
    const activities = await prisma.activity.findMany()
    const sheetActivities = workbook.addWorksheet('Activities')
    sheetActivities.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Assigned User ID', key: 'assignedUserId', width: 36 },
    ]
    activities.forEach(a => sheetActivities.addRow(a))

    // Formatting headers
    workbook.worksheets.forEach(sheet => {
      sheet.getRow(1).font = { bold: true }
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } }
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Farclean_CRM_FullBackup_${timestamp}.xlsx"`,
      },
    })
  } catch (error: any) {
    console.error('Backup error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
