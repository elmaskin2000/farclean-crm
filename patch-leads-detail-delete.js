const fs = require('fs');

let page = fs.readFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', 'utf8');

if (!page.includes('deleteLeadActivity')) {
  page = page.replace(/import \{ updateLeadStatus, addLeadActivity, convertAction \} from '@\/app\/actions'/, 
  `import { updateLeadStatus, addLeadActivity, convertAction, deleteLeadActivity } from '@/app/actions'`);
  
  page = page.replace(/import \{ MessageSquare, Phone, Mail, Calendar, ArrowRight \} from 'lucide-react'/, 
  `import { MessageSquare, Phone, Mail, Calendar, ArrowRight, Trash2 } from 'lucide-react'`);

  page = page.replace(/<div className="text-sm whitespace-pre-wrap">\{act\.description\}<\/div>/, 
  `<div className="text-sm whitespace-pre-wrap relative group">
                            {act.description}
                            
                            <form action={deleteLeadActivity} className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <input type="hidden" name="id" value={act.id} />
                              <input type="hidden" name="leadId" value={lead.id} />
                              <button type="submit" className="text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow" title="Hapus Pesan">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </form>
                          </div>`);

  fs.writeFileSync('c:/CRM/src/app/(dashboard)/leads/[id]/page.tsx', page);
  console.log('Lead detail patched with delete activity button');
} else {
  console.log('Already patched');
}
