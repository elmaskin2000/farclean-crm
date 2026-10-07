import { createUser } from '@/app/actions/user'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewUserPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Tambahkan Karyawan / PIC</h1>
      <Card>
        <CardHeader>
          <CardTitle>Detail Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input id="name" name="name" placeholder="E.g. Budi Santoso" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Login *</Label>
              <Input id="email" type="email" name="email" placeholder="budi@farclean.co.id" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" name="password" placeholder="Minimal 6 karakter" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / Akses *</Label>
              <select 
                id="role" 
                name="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value="STAFF">STAFF (Hanya PIC teknis, tidak punya akses pipeline sales)</option>
                <option value="SALES">SALES (Bisa input Lead, follow-up, & buat Penawaran)</option>
                <option value="MANAGER">MANAGER (Bisa melihat semua progress Sales)</option>
                <option value="ADMIN">ADMIN (Full Access)</option>
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="submit">Daftarkan Akun</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
