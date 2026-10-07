'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function uploadDocument(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const file = formData.get('file') as File
  const type = formData.get('type') as string
  const leadId = formData.get('leadId') as string || null

  if (!file || file.size === 0) {
    throw new Error('No file uploaded')
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Generate unique filename to avoid overwriting
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
  const path = join(process.cwd(), 'public', 'uploads', filename)
  
  await writeFile(path, buffer)

  await prisma.document.create({
    data: {
      filename: file.name,
      type: type || file.type || 'application/octet-stream',
      size: file.size,
      url: `/uploads/${filename}`,
      uploadedBy: session.user.name || 'Unknown User',
      leadId: leadId
    }
  })

  revalidatePath('/documents')
  if (leadId) {
    revalidatePath(`/leads/${leadId}`)
  }
}

export async function deleteDocument(formData: FormData) {
  const session = await getServerSession(authOptions)
  // Only Admin or Manager can delete globally, but for now we just require a session
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id') as string
  if (id) {
    await prisma.document.delete({ where: { id } })
    revalidatePath('/documents')
  }
}
