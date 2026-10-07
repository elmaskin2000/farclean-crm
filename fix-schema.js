const fs = require('fs');
let content = fs.readFileSync('c:/CRM/prisma/schema.prisma', 'utf8');

// Replace leadSource with source
content = content.replace(/leadSource\s+String\?\r?\n/g, 'source               String?\n  channel              String?\n');

// Make sure LeadActivity has direction
content = content.replace(/model LeadActivity \{[\s\S]*?\}\r?\n/g, (match) => {
    if (!match.includes('direction')) {
        return match.replace(/description String\?\r?\n/g, 'description String?\n  direction   String      @default("OUTBOUND")\n');
    }
    return match;
});

fs.writeFileSync('c:/CRM/prisma/schema.prisma', content);
