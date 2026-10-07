const fs = require('fs');
let lines = fs.readFileSync('c:/CRM/src/app/actions.ts', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("revalidatePath('/leads')") && lines[i-1].trim() === '' && lines[i-2].includes('})')) {
    lines.splice(i, 0, "  await logAudit(actor, 'CREATE_LEAD', 'Lead', lead.id, 'New lead created');");
    break;
  }
}

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('data: { status, temperature }') && lines[i+1].includes('})')) {
    lines.splice(i+2, 0, "    await logAudit(actor, 'UPDATE_STATUS', 'Lead', leadId, 'Status changed to ' + status + ', Temp: ' + temperature);");
    break;
  }
}

fs.writeFileSync('c:/CRM/src/app/actions.ts', lines.join('\n'));
