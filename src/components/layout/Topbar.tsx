'use client'

import { Bell, Search, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

export default function Topbar() {
  const { data: session } = useSession()

  return (
    <div className="h-16 border-b bg-white flex items-center px-6 justify-between shrink-0">
      <div className="flex items-center flex-1">
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full bg-gray-50 border border-gray-200 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
        <div className="flex items-center space-x-3 border-l pl-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">{session?.user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{session?.user?.role || 'Role'}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
