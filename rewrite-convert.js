const fs = require('fs');
let lines = fs.readFileSync('c:/CRM/src/app/actions.ts', 'utf8').split('\n');

const newFunc = `export async function convertLeadToOpportunity(leadId: string, stageId: string, estimatedValue: number, name: string) {
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
  redirect(\`/opportunities/\${opp.id}\`)
}`;

// find the indices
let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export async function convertLeadToOpportunity(')) {
    startIndex = i;
  }
  if (startIndex !== -1 && lines[i].startsWith('}')) {
    endIndex = i;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex + 1, newFunc);
  fs.writeFileSync('c:/CRM/src/app/actions.ts', lines.join('\n'));
} else {
  console.log('Could not find function bounds');
}
