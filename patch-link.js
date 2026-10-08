const fs = require('fs');
let page = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', 'utf8');

if (!page.includes("import Link from 'next/link'")) {
  page = page.replace(/import \{ notFound \} from 'next\/navigation'/, 
  `import { notFound } from 'next/navigation'\nimport Link from 'next/link'`);
  fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', page);
  console.log('Fixed missing Link import');
}
