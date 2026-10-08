const fs = require('fs');
let page = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/new/page.tsx', 'utf8');

page = page.replace(/<Input id="contactName" name="contactName" required \/>\s*<\/div>\s*<\/div>/,
`<Input id="contactName" name="contactName" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor WA / Telepon</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="0812..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="contoh@perusahaan.com" />
                </div>
              </div>`);

fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/new/page.tsx', page);
console.log('Leads new page patched with phone and email');
