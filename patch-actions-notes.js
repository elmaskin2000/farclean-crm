const fs = require('fs');
let actions = fs.readFileSync('c:/CRM/src/app/actions.ts', 'utf8');

actions = actions.replace(/const email = formData\.get\('email'\) as string\n\s*const productInterest = formData\.get\('productInterest'\) as string/g,
`const email = formData.get('email') as string
  const productInterest = formData.get('productInterest') as string
  const notes = formData.get('notes') as string`);

actions = actions.replace(/channel,\n\s*inquiryDate\s*\}/,
`channel,
      notes,
      inquiryDate 
    }`);

actions = actions.replace(/channel,\n\s*\.\.\.\(inquiryDate && \{ inquiryDate \}\)\n\s*\}/,
`channel,
      notes,
      ...(inquiryDate && { inquiryDate })
    }`);

fs.writeFileSync('c:/CRM/src/app/actions.ts', actions);
console.log('actions.ts patched for notes');
