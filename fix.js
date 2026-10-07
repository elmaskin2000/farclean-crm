const fs = require('fs');
let content = fs.readFileSync('c:/CRM/prisma/schema.prisma', 'utf8');

// Completely remove any stray direction lines
content = content.replace(/  direction   String      @default\("OUTBOUND"\)\?\n/g, '');
content = content.replace(/  direction   String      @default\("OUTBOUND"\)\n/g, '');
content = content.replace(/  direction   String      @default\("OUTBOUND"\)/g, '');

// Ensure description String? for ProductCategory and QuotationItem
content = content.replace(/  description String\n/g, '  description String?\n');

// specifically fix LeadActivity
content = content.replace(/model LeadActivity \{[\s\S]*?\}\n/g, (match) => {
    let m = match.replace(/description String\?/, 'description String');
    return m.replace(/createdAt   DateTime/, 'direction   String      @default("OUTBOUND")\n  createdAt   DateTime');
});

fs.writeFileSync('c:/CRM/prisma/schema.prisma', content);
