const fs = require('fs');
let content = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', 'utf8');

// Include pic in the query
if (!content.includes('pic: true')) {
  content = content.replace('salesOwner: true,', 'salesOwner: true,\n      pic: true,');
}

// Display PIC in the UI
if (!content.includes('PIC (Internal)')) {
  const insertIndex = content.indexOf('<div className="text-sm text-gray-500">Sales Owner</div>');
  const targetText = '</div>\n                <div>\n                  <div className="text-sm text-gray-500">Created At</div>';
  
  content = content.replace(targetText, '</div>\n                <div>\n                  <div className="text-sm text-gray-500">PIC (Internal Team)</div>\n                  <div className="font-medium">{lead.pic?.name || \'Unassigned\'}</div>\n                </div>\n                <div>\n                  <div className="text-sm text-gray-500">Created At</div>');
}

fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', content);
