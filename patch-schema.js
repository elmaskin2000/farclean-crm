const fs = require('fs');
let content = fs.readFileSync('c:/CRM/prisma/schema.prisma', 'utf8');

if (!content.includes('channel              String?')) {
  content = content.replace(/leadSource           String\?\n/g, 'leadSource           String?\n  channel              String?\n');
}

content = content.replace(/model LeadActivity \{[\s\S]*?\}\n/g, (match) => {
    if (!match.includes('direction')) {
        return match.replace(/description String\?\n/g, 'description String?\n  direction   String      @default("OUTBOUND")\n');
    }
    return match;
});

fs.writeFileSync('c:/CRM/prisma/schema.prisma', content);
