const fs = require('fs');
let content = fs.readFileSync('c:/CRM/prisma/schema.prisma', 'utf8');

content = content.replace(
  /model Company \{[\s\S]*?\}\r?\n/g,
  (match) => {
    return match.replace(/leads         Lead\[\]    @relation\("SalesOwner"\)\r?\n\s*picLeads      Lead\[\]    @relation\("LeadPIC"\)/g, 'leads         Lead[]');
  }
);

fs.writeFileSync('c:/CRM/prisma/schema.prisma', content);
