const fs = require('fs');

let actions = fs.readFileSync('c:/CRM/src/app/actions.ts', 'utf8');

actions = actions.replace(/export async function createLead\(formData: FormData\) {[\s\S]*?redirect\(\`\/leads\/\$\{lead\.id\}\`\)\s*\}/, 
`export async function createLead(formData: FormData) {
  const companyName = formData.get('companyName') as string
  const contactName = formData.get('contactName') as string
  const productInterest = formData.get('productInterest') as string
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
      productInterest, 
      temperature, 
      salesOwnerId: salesOwnerId || null, 
      picId: picId || null, 
      source, 
      channel,
      inquiryDate 
    },
  })

  await logAudit(actor, 'CREATE_LEAD', 'Lead', lead.id, 'New lead created');
  revalidatePath('/leads')
  redirect(\`/leads/\${lead.id}\`)
}`);

fs.writeFileSync('c:/CRM/src/app/actions.ts', actions);
console.log('actions.ts patched successfully');
