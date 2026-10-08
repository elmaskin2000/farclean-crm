const fs = require('fs');

let page = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', 'utf8');

page = page.replace(/<div className="text-sm text-gray-500">Source \(Dapat dr mn\)<\/div>/, 
`<div>
                  <div className="text-sm text-gray-500">Tanggal Lead Masuk</div>
                  <div className="font-medium text-purple-700">{lead.inquiryDate ? format(new Date(lead.inquiryDate), 'dd MMM yyyy') : format(new Date(lead.createdAt), 'dd MMM yyyy')}</div>
                </div>
                <div className="text-sm text-gray-500">Source (Dapat dr mn)</div>`);

fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', page);
console.log('Lead detail page patched successfully');
