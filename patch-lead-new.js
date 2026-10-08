const fs = require('fs');

let page = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/new/page.tsx', 'utf8');

page = page.replace(/<div className="space-y-2">\s*<Label htmlFor="source">Source \(Dapat dari mana\)<\/Label>/, 
`<div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="inquiryDate">Tanggal Lead Masuk (Inquiry Date)</Label>
                <Input type="date" id="inquiryDate" name="inquiryDate" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="source">Source (Dapat dari mana)</Label>`);

fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/new/page.tsx', page);
console.log('Lead new page patched successfully');
