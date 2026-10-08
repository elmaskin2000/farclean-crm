const fs = require('fs');
fetch('https://farclean-crm.vercel.app/users', { headers: { 'Cookie': '...' } }).then(async r => {
  console.log(r.status);
  console.log(await r.text());
});
