const fs = require('fs');
let actions = fs.readFileSync('c:/CRM/src/app/actions.ts', 'utf8');

actions = actions.replace(/const productInterest = formData\.get\('productInterest'\) as string;\n\s*const inquiryDateStr = formData\.get\('inquiryDate'\) as string;/g,
`const productInterest = formData.get('productInterest') as string;
  const notes = formData.get('notes') as string;
  const inquiryDateStr = formData.get('inquiryDate') as string;`);

fs.writeFileSync('c:/CRM/src/app/actions.ts', actions);
console.log('actions.ts patched for updateLead notes');
