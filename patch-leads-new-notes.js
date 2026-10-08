const fs = require('fs');
let page = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/new/page.tsx', 'utf8');

page = page.replace(/<div className="space-y-2">\s*<Label htmlFor="productInterest">Product Interest<\/Label>\s*<Input id="productInterest" name="productInterest" placeholder="e\.g\. Cleanroom Door" \/>\s*<\/div>/,
`<div className="space-y-2">
                <Label htmlFor="productInterest">Product Interest</Label>
                <Input id="productInterest" name="productInterest" placeholder="e.g. Cleanroom Door" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (Notes)</Label>
                <textarea id="notes" name="notes" rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Informasi tambahan tentang prospek ini..."></textarea>
              </div>`);

fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/new/page.tsx', page);
console.log('leads/new patched');
