const fs = require('fs');

let page = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', 'utf8');

if (!page.includes('AiInsightWidget')) {
  page = page.replace(/import Link from 'next\/link'/,
  `import Link from 'next/link'\nimport AiInsightWidget from '@/components/leads/AiInsightWidget'`);

  page = page.replace(/<div className="font-medium">\{format\(new Date\(lead\.createdAt\), 'PPP'\)\}<\/div>\s*<\/div>\s*<\/div>/,
  `<div className="font-medium">{format(new Date(lead.createdAt), 'PPP')}</div>
                  </div>
                </div>
                {lead.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-500 mb-1">Catatan (Notes)</div>
                    <div className="text-sm whitespace-pre-wrap">{lead.notes}</div>
                  </div>
                )}
                
                <AiInsightWidget lead={lead} />`);

  fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', page);
  console.log('Lead detail patched with AiInsightWidget and notes');
} else {
  console.log('Already patched');
}
