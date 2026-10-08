'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function createCompany(formData: FormData) {
  const name = formData.get('name') as string
  const industry = formData.get('industry') as string
  const city = formData.get('city') as string

  if (!name) throw new Error('Validation failed')

  const company = await prisma.company.create({
    data: { name, industry, city },
  })

  revalidatePath('/companies')
  redirect(`/companies/${company.id}`)
}

export async function createContact(formData: FormData) {
  const name = formData.get('name') as string
  const companyId = formData.get('companyId') as string
  const position = formData.get('position') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  if (!name || !companyId) throw new Error('Validation failed')

  const contact = await prisma.contact.create({
    data: { name, companyId, position, email, phone },
  })

  revalidatePath('/contacts')
  redirect(`/contacts/${contact.id}`)
}

export async function logAudit(userId: string, action: string, entity: string, entityId: string, details: string) {
  try {
    await prisma.auditLog.create({ data: { userId, action, entity, entityId, newValue: details } })
  } catch (e) { console.error('Audit Log Error', e) }
}

export async function createLead(formData: FormData) {
  const companyName = formData.get('companyName') as string
  const contactName = formData.get('contactName') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const productInterest = formData.get('productInterest') as string
  const notes = formData.get('notes') as string
  const source = formData.get('source') as string
  const channel = formData.get('channel') as string
  const temperature = formData.get('temperature') as string
  const salesOwnerId = formData.get('salesOwnerId') as string
  const picId = formData.get('picId') as string
  const inquiryDateStr = formData.get('inquiryDate') as string

  if (!companyName || !contactName) throw new Error('Validation failed')

  const actor = (await getServerSession(authOptions))?.user?.name || 'System';
  
  const inquiryDate = inquiryDateStr ? new Date(inquiryDateStr) : new Date();

  const lead = await prisma.lead.create({
    data: { 
      companyName, 
      contactName, 
      phone,
      email,
      productInterest, 
      temperature, 
      salesOwnerId: salesOwnerId || null, 
      picId: picId || null, 
      source, 
      channel,
      notes,
      inquiryDate 
    },
  })

  await logAudit(actor, 'CREATE_LEAD', 'Lead', lead.id, 'New lead created');
  revalidatePath('/leads')
  redirect(`/leads/${lead.id}`)
}

export async function convertLeadToOpportunity(leadId: string, stageId: string, estimatedValue: number, name: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } })
  if (!lead) throw new Error('Validation failed')

  let companyId = lead.companyId
  if (!companyId) {
    const newCompany = await prisma.company.create({ data: { name: lead.companyName } })
    companyId = newCompany.id
  }

  let contactId = lead.contactId
  if (!contactId) {
    const newContact = await prisma.contact.create({ data: { name: lead.contactName, companyId } })
    contactId = newContact.id
  }

  const session = await getServerSession(authOptions);
  const sessionUserId = session?.user?.id;
  const actorName = session?.user?.name || 'System';

  const finalSalesOwnerId = lead.salesOwnerId || sessionUserId;
  if (!finalSalesOwnerId) {
    throw new Error('Sales Owner must be assigned before converting, or you must be logged in as a valid user.')
  }

  const opp = await prisma.opportunity.create({
    data: {
      name,
      companyId,
      contactId,
      stageId,
      estimatedValue,
      salesOwnerId: finalSalesOwnerId,
    }
  })

  await prisma.lead.update({
    where: { id: leadId },
    data: { status: 'CONVERTED', companyId, contactId }
  })

  await logAudit(actorName, 'CONVERT_LEAD', 'Opportunity', opp.id, 'Converted from lead');

  revalidatePath('/pipeline')
  redirect(`/opportunities/${opp.id}`)
}

export async function updateLeadStatus(formData: FormData) {
  const session = await getServerSession(authOptions);
  const actor = session?.user?.name || 'Unknown';
  const leadId = formData.get('leadId') as string
  const status = formData.get('status') as string
  const temperature = formData.get('temperature') as string
  
  if (leadId) {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status, temperature }
    })
    await logAudit(actor, 'UPDATE_STATUS', 'Lead', leadId, 'Status changed to ' + status + ', Temp: ' + temperature);
    revalidatePath(`/leads/${leadId}`)
  }
}

export async function addLeadActivity(formData: FormData) {
  const leadId = formData.get('leadId') as string
  const type = formData.get('type') as string
  const description = formData.get('description') as string
  const direction = formData.get('direction') as string || 'OUTBOUND'
  
  if (leadId && description) {
    await prisma.leadActivity.create({
      data: { leadId, type, description, direction }
    })
    revalidatePath(`/leads/${leadId}`)
  }
}

export async function convertAction(formData: FormData) {
  const leadId = formData.get('leadId') as string
  const stageId = formData.get('stageId') as string
  const estimatedValue = parseFloat(formData.get('estimatedValue') as string || '0')
  const name = formData.get('name') as string
  
  await convertLeadToOpportunity(leadId, stageId, estimatedValue, name)
}

export async function updateLead(formData: FormData) {
  const session = await getServerSession(authOptions);
  const actor = session?.user?.name || 'System';

  const id = formData.get('id') as string;
  const companyName = formData.get('companyName') as string;
  const contactName = formData.get('contactName') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const productInterest = formData.get('productInterest') as string;
  const notes = formData.get('notes') as string;
  const inquiryDateStr = formData.get('inquiryDate') as string;
  const source = formData.get('source') as string;
  const channel = formData.get('channel') as string;

  if (!id || !companyName || !contactName) throw new Error('Validation failed');

  const inquiryDate = inquiryDateStr ? new Date(inquiryDateStr) : undefined;

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      companyName,
      contactName,
      phone,
      email,
      productInterest,
      source,
      channel,
      notes,
      ...(inquiryDate && { inquiryDate })
    }
  });

  await logAudit(actor, 'UPDATE_LEAD', 'Lead', lead.id, 'Lead details updated');
  revalidatePath(`/leads/${id}`);
  revalidatePath('/leads');
  redirect(`/leads/${id}`);
}

export async function deleteLeadActivity(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  const actor = session.user.name || 'System';

  const id = formData.get('id') as string;
  const leadId = formData.get('leadId') as string;

  if (!id) throw new Error('ID is required');

  await prisma.leadActivity.delete({ where: { id } });

  await logAudit(actor, 'DELETE_ACTIVITY', 'LeadActivity', id, 'Deleted activity message');
  
  if (leadId) revalidatePath(`/leads/${leadId}`);
  revalidatePath('/activities');
}
