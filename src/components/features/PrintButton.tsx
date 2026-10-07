'use client'

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium">
      Print PDF
    </button>
  )
}
