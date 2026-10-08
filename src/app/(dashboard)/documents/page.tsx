import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { uploadDocument, deleteDocument } from '@/app/actions/document'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'


export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
    include: { lead: true }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Document Repository</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-6 text-gray-500">Belum ada dokumen yang diunggah.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama File</TableHead>
                      <TableHead>Ukuran</TableHead>
                      <TableHead>Terkait Dengan</TableHead>
                      <TableHead>Diunggah</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map(doc => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline">
                            {doc.filename}
                          </a>
                        </TableCell>
                        <TableCell>{(doc.size / 1024).toFixed(1)} KB</TableCell>
                        <TableCell>{doc.lead ? `Lead: ${doc.lead.companyName}` : '-'}</TableCell>
                        <TableCell>{format(new Date(doc.uploadDate), 'dd MMM yyyy')}</TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <form action={deleteDocument}>
                            <input type="hidden" name="id" value={doc.id} />
                            <Button type="submit" variant="destructive" size="sm">Hapus</Button>
                          </form>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload File Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={uploadDocument} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Pilih File</Label>
                  <Input id="file" name="file" type="file" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Kategori Dokumen</Label>
                  <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="Quotation / Penawaran">Quotation / Penawaran</option>
                    <option value="Purchase Order (PO)">Purchase Order (PO)</option>
                    <option value="Gambar Teknik / Layout">Gambar Teknik / Layout</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">Upload Dokumen</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
