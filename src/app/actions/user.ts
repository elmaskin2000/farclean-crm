'use server'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  if (!name || !email || !password || !role) {
    throw new Error('All fields are required')
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('Email already registered')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role
    }
  })

  revalidatePath('/users')
  redirect('/users')
}

export async function deleteUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');
  const actor = session?.user?.name || 'Unknown';

  const id = formData.get('id') as string
  if (id === session.user.id) {
    throw new Error('You cannot delete your own account.')
  }

  if (id) {
    try {
      const deleted = await prisma.user.delete({ where: { id } });
      await prisma.auditLog.create({ data: { userId: actor, action: 'DELETE_USER', entity: 'User', entityId: id, newValue: 'Deleted user ' + deleted.email } });
    } catch (e) {
      throw new Error('Cannot delete user. They are associated with existing leads or activities.')
    }
    revalidatePath('/users')
  }
}
