const fs = require('fs');
let actions = fs.readFileSync('c:/CRM/src/app/actions.ts', 'utf8');

if (!actions.includes('export async function deleteLeadActivity(')) {
  actions += `
export async function deleteLeadActivity(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  const actor = session.user.name || 'System';

  const id = formData.get('id') as string;
  const leadId = formData.get('leadId') as string;

  if (!id) throw new Error('ID is required');

  await prisma.leadActivity.delete({ where: { id } });

  await logAudit(actor, 'DELETE_ACTIVITY', 'LeadActivity', id, 'Deleted activity message');
  
  if (leadId) revalidatePath(\`/leads/\${leadId}\`);
  revalidatePath('/activities');
}
`;
  fs.writeFileSync('c:/CRM/src/app/actions.ts', actions);
  console.log('actions.ts patched with deleteLeadActivity');
}
