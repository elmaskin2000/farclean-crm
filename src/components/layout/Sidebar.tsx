'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Building2,
  Phone,
  BarChart3,
  FileText,
  Package,
  Activity,
  CheckSquare,
  Megaphone,
  PieChart,
  Files,
  Bell,
  Settings,
} from 'lucide-react'

const allRoutes = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['ADMIN', 'MANAGER', 'SALES', 'STAFF'] },
  { label: 'Leads', icon: Users, href: '/leads', roles: ['ADMIN', 'MANAGER', 'SALES'] },
  { label: 'Companies', icon: Building2, href: '/companies', roles: ['ADMIN', 'MANAGER', 'SALES', 'STAFF'] },
  { label: 'Contacts', icon: Phone, href: '/contacts', roles: ['ADMIN', 'MANAGER', 'SALES', 'STAFF'] },
  { label: 'Pipeline', icon: BarChart3, href: '/pipeline', roles: ['ADMIN', 'MANAGER', 'SALES'] },
  { label: 'Quotations', icon: FileText, href: '/quotations', roles: ['ADMIN', 'MANAGER', 'SALES'] },
  { label: 'Products', icon: Package, href: '/products', roles: ['ADMIN', 'MANAGER', 'SALES'] },
  { label: 'Activities', icon: Activity, href: '/activities', roles: ['ADMIN', 'MANAGER', 'SALES', 'STAFF'] },
  { label: 'Tasks', icon: CheckSquare, href: '/tasks', roles: ['ADMIN', 'MANAGER', 'SALES', 'STAFF'] },
  { label: 'Campaigns', icon: Megaphone, href: '/campaigns', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Reports', icon: PieChart, href: '/reports', roles: ['ADMIN', 'MANAGER'] },
  { label: 'Documents', icon: Files, href: '/documents', roles: ['ADMIN', 'MANAGER', 'SALES', 'STAFF'] },
  { label: 'Notifications', icon: Bell, href: '/notifications', roles: ['ADMIN', 'MANAGER', 'SALES', 'STAFF'] },
  { label: 'Users & Team', icon: Users, href: '/users', roles: ['ADMIN'] },
  { label: 'Audit Trail', icon: Files, href: '/audit', roles: ['ADMIN'] },
  { label: 'Settings', icon: Settings, href: '/settings', roles: ['ADMIN'] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'STAFF'

  const routes = allRoutes.filter(route => route.roles.includes(userRole))

  return (
    <div className="h-full border-r bg-gray-50 flex flex-col overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Farclean Logo" width={40} height={40} className="object-contain" />
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Farclean CRM</h1>
        </div>
      </div>
      <div className="flex flex-col w-full flex-1 px-3 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center text-sm font-medium p-3 rounded-lg transition-colors',
              pathname === route.href || pathname.startsWith(route.href + '/')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <route.icon className={cn('h-5 w-5 mr-3')} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
