const fs = require('fs');
let page = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', 'utf8');

page = page.replace(/<CardHeader>\s*<CardTitle>Lead Details<\/CardTitle>\s*<\/CardHeader>/,
`<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Lead Details</CardTitle>
              <Link href={\`/leads/\${id}/edit\`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
            </CardHeader>`);

fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', page);
console.log('Lead detail page patched with Edit button');
