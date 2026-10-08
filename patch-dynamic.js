const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('page.tsx')) results.push(file);
    }
  });
  return results;
}

const pages = walk('c:/CRM/src/app/(dashboard)');

pages.forEach(page => {
  let content = fs.readFileSync(page, 'utf8');
  if (!content.includes("export const dynamic = 'force-dynamic'")) {
    const lines = content.split('\n');
    let importEnd = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        importEnd = i;
      }
    }
    lines.splice(importEnd + 1, 0, "\nexport const dynamic = 'force-dynamic'\n");
    fs.writeFileSync(page, lines.join('\n'));
    console.log('Patched', page);
  }
});
