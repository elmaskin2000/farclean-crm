const fs = require('fs');
let content = fs.readFileSync('c:/CRM/prisma/schema.prisma', 'utf8');

// Update Lead model to add pic
content = content.replace(
  /salesOwnerId         String\?\r?\n\s*salesOwner           User\?\s*@relation\(fields: \[salesOwnerId\], references: \[id\]\)/g,
  'salesOwnerId         String?\n  salesOwner           User?       @relation("SalesOwner", fields: [salesOwnerId], references: [id])\n  picId                String?\n  pic                  User?       @relation("LeadPIC", fields: [picId], references: [id])'
);

// Update User model to name the relation
content = content.replace(
  /leads         Lead\[\]\r?\n/g,
  'leads         Lead[]    @relation("SalesOwner")\n  picLeads      Lead[]    @relation("LeadPIC")\n'
);

fs.writeFileSync('c:/CRM/prisma/schema.prisma', content);
