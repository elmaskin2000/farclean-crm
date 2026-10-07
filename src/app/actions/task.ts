'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  const assignedUserId = formData.get('assignedUserId') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string

  if (!title || !assignedUserId) throw new Error('Title and Assignee required')

  await prisma.task.create({
    data: { title, assignedUserId, description, priority, status: 'TODO' }
  })

  revalidatePath('/tasks')
}

export async function updateTaskStatus(taskId: string, status: string) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status }
  })
  revalidatePath('/tasks')
}
