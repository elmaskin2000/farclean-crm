import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const stages = [
    { name: 'NEW', order: 1, probability: 10 },
    { name: 'CONTACTED', order: 2, probability: 20 },
    { name: 'QUALIFIED', order: 3, probability: 40 },
    { name: 'NEED_ANALYSIS', order: 4, probability: 50 },
    { name: 'QUOTATION', order: 5, probability: 70 },
    { name: 'NEGOTIATION', order: 6, probability: 85 },
    { name: 'WON', order: 7, probability: 100 },
    { name: 'LOST', order: 8, probability: 0 },
  ]

  for (const stage of stages) {
    const existing = await prisma.pipelineStage.findFirst({ where: { name: stage.name } })
    if (!existing) {
      await prisma.pipelineStage.create({ data: stage })
    }
  }

  console.log('Stages seeded.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
