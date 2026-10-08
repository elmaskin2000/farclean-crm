const fs = require('fs');

let layout = fs.readFileSync('c:/CRM/src/app/layout.tsx', 'utf8');

layout = layout.replace(/import SessionProvider from '@\/components\/providers\/SessionProvider'/,
`import SessionProvider from '@/components/providers/SessionProvider'
import NextTopLoader from 'nextjs-toploader'`);

layout = layout.replace(/<SessionProvider>\{children\}<\/SessionProvider>/,
`<NextTopLoader color="#2563eb" showSpinner={false} shadow="0 0 10px #2563eb,0 0 5px #2563eb" />
        <SessionProvider>{children}</SessionProvider>`);

fs.writeFileSync('c:/CRM/src/app/layout.tsx', layout);
console.log('layout.tsx patched with NextTopLoader');
