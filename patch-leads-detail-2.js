const fs = require('fs');
let page = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', 'utf8');

page = page.replace(/<div className="text-sm text-gray-500">Contact Person<\/div>\s*<div className="font-medium">\{lead\.contactName\}<\/div>\s*<\/div>/,
`<div className="text-sm text-gray-500">Contact Person</div>
                    <div className="font-medium">{lead.contactName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">No. WA / Telepon</div>
                    <div className="font-medium">{lead.phone || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{lead.email || '-'}</div>
                  </div>`);

fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', page);
console.log('Lead detail page patched with phone and email');
