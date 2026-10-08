const fs = require('fs');

let actions = fs.readFileSync('c:/CRM/src/app/actions.ts', 'utf8');

actions = actions.replace(/const contactName = formData.get\('contactName'\) as string/,
`const contactName = formData.get('contactName') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string`);

actions = actions.replace(/contactName, \n\s*productInterest,/,
`contactName, 
      phone,
      email,
      productInterest,`);

fs.writeFileSync('c:/CRM/src/app/actions.ts', actions);
console.log('actions.ts patched with phone and email');
