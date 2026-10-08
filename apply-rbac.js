const fs = require('fs');
const path = require('path');

const pagesToProtect = [
  'companies/page.tsx',
  'companies/new/page.tsx',
  'contacts/page.tsx',
  'contacts/new/page.tsx',
  'products/page.tsx',
  'products/new/page.tsx',
];

pagesToProtect.forEach(pagePath => {
  const fullPath = path.join(__dirname, 'src/app/(dashboard)', pagePath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  if (!content.includes('getServerSession')) {
    content = content.replace(/export default async function \w+\(\) {/, 
`import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

$&
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'MANAGER') {
    redirect('/dashboard')
  }
`);
  } else if (!content.includes("!== 'ADMIN'")) {
    content = content.replace(/const session = await getServerSession\(authOptions\)/, 
`$&
  if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'MANAGER') {
    import('next/navigation').then(m => m.redirect('/dashboard'))
  }
`);
  }

  fs.writeFileSync(fullPath, content);
});

console.log('RBAC applied to server pages');
