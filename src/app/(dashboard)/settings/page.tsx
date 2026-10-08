import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, ShieldCheck, Database } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
      
      <Card className="border-l-4 border-l-blue-600 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Database Backup & Export
          </CardTitle>
          <CardDescription>
            Download a full backup of all CRM data (Users, Companies, Contacts, Leads, Deals, Activities).
            The data will be exported as a multi-sheet Microsoft Excel (.xlsx) file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/api/backup" download>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Full Database Backup
            </Button>
          </a>
          <p className="text-xs text-gray-500 mt-3">
            <strong>Note:</strong> This feature is exclusively available to Administrators. Keep this file safe.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gray-600" />
            Security & Access Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ <strong>Database Protection:</strong> Cascading deletes are enabled to prevent orphaned records.</li>
            <li>✅ <strong>RBAC Enforcement:</strong> Sales and Staff users are locked out of global configurations.</li>
            <li>✅ <strong>Session Security:</strong> Server actions verify authentication status before mutating data.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
