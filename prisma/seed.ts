import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  // Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crm.local' },
    update: {},
    create: {
      email: 'admin@crm.local',
      name: 'Admin User',
      passwordHash,
      role: 'ADMIN',
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@crm.local' },
    update: {},
    create: {
      email: 'manager@crm.local',
      name: 'Manager User',
      passwordHash,
      role: 'MANAGER',
    },
  })

  const sales = await prisma.user.upsert({
    where: { email: 'sales@crm.local' },
    update: {},
    create: {
      email: 'sales@crm.local',
      name: 'Sales User',
      passwordHash,
      role: 'SALES',
    },
  })

  // Seed Product Category
  const category = await prisma.productCategory.create({
    data: {
      name: 'Cleanroom Doors',
      description: 'Doors for cleanroom environments',
    }
  })

  // Seed Product
  await prisma.product.create({
    data: {
      sku: 'CRD-001',
      name: 'Standard Cleanroom Door',
      categoryId: category.id,
      unit: 'pcs',
      basePrice: 5000000,
      minimumPrice: 4500000,
    }
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
