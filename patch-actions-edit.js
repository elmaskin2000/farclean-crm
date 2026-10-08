const fs = require('fs');

let actions = fs.readFileSync('c:/CRM/src/app/actions.ts', 'utf8');

if (!actions.includes('export async function updateLead(')) {
  actions += `
export async function updateLead(formData: FormData) {
  const session = await getServerSession(authOptions);
  const actor = session?.user?.name || 'System';

  const id = formData.get('id') as string;
  const companyName = formData.get('companyName') as string;
  const contactName = formData.get('contactName') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const productInterest = formData.get('productInterest') as string;
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
      ...(inquiryDate && { inquiryDate })
    }
  });

  await logAudit(actor, 'UPDATE_LEAD', 'Lead', lead.id, 'Lead details updated');
  revalidatePath(\`/leads/\${id}\`);
  revalidatePath('/leads');
  redirect(\`/leads/\${id}\`);
}
`;
  fs.writeFileSync('c:/CRM/src/app/actions.ts', actions);
  console.log('actions.ts patched with updateLead');
} else {
  console.log('updateLead already exists');
}
