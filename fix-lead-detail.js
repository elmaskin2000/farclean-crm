const fs = require('fs');
let content = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', 'utf8');

content = content.replace('salesOwner: true,', 'salesOwner: true, pic: true,');

content = content.replace(
  '<div>\n                  <div className="text-sm text-gray-500">Created At</div>',
  '<div>\n                  <div className="text-sm text-gray-500">PIC (Internal)</div>\n                  <div className="font-medium">{lead.pic?.name || \'Unassigned\'}</div>\n                </div>\n                <div>\n                  <div className="text-sm text-gray-500">Created At</div>'
);

fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', content);
