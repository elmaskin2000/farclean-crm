'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logAudit } from '@/app/actions'

export async function createQuotation(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')
  const actor = session.user.name || 'System'
  
  const opportunityId = formData.get('opportunityId') as string
  
  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } })
  if (!opp) throw new Error('Validation failed')

  // Generate a quotation number
  const count = await prisma.quotation.count()
  const year = new Date().getFullYear()
  const qtnNumber = `QTN-${year}-${(count + 1).toString().padStart(4, '0')}`

  const quotation = await prisma.quotation.create({
    data: {
      quotationNumber: qtnNumber,
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      companyId: opp.companyId,
      contactId: opp.contactId,
      opportunityId: opp.id,
      salespersonId: opp.salesOwnerId,
    }
  })

  await logAudit(actor, 'CREATE_QUOTATION', 'Quotation', quotation.id, `Created quotation ${qtnNumber}`);

  revalidatePath(`/opportunities/${opportunityId}`)
  redirect(`/quotations/${quotation.id}`)
}

export async function updateOpportunityStage(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')
  const actor = session.user.name || 'System'
  
  const opportunityId = formData.get('opportunityId') as string
  const stageId = formData.get('stageId') as string
  const isWon = formData.get('isWon') === 'true'
  const isLost = formData.get('isLost') === 'true'
  
  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: { stageId: stageId || null, isWon, isLost }
  })
  
  await logAudit(actor, 'UPDATE_OPPORTUNITY', 'Opportunity', opportunityId, `Stage updated. Won: ${isWon}, Lost: ${isLost}`);
  
  revalidatePath(`/opportunities/${opportunityId}`)
  revalidatePath(`/pipeline`)
}
