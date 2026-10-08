'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="p-8 border border-red-200 bg-red-50 rounded-lg space-y-4 max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold text-red-700">Oops! Gagal Menghapus</h2>
      <p className="text-red-600">{error.message}</p>
      <p className="text-sm text-gray-600">
        Sebagai informasi, Anda tidak bisa menghapus akun Anda sendiri, dan Anda juga tidak bisa menghapus akun yang sudah pernah dikaitkan dengan Prospek (Leads) atau Aktivitas, demi menjaga keutuhan riwayat data perusahaan.
      </p>
      <Button
        onClick={() => reset()}
        variant="destructive"
      >
        Kembali
      </Button>
    </div>
  )
}
