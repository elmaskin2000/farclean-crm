'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const sku = formData.get('sku') as string
  const name = formData.get('name') as string
  const categoryId = formData.get('categoryId') as string
  const unit = formData.get('unit') as string
  const basePrice = parseFloat(formData.get('basePrice') as string || '0')
  const minimumPrice = parseFloat(formData.get('minimumPrice') as string || '0')
  const description = formData.get('description') as string

  if (!sku || !name || !categoryId) throw new Error('SKU, Name, and Category are required')

  await prisma.product.create({
    data: { sku, name, categoryId, unit, basePrice, minimumPrice, description }
  })

  revalidatePath('/products')
  redirect('/products')
}

export async function addQuotationItem(formData: FormData) {
  const quotationId = formData.get('quotationId') as string
  const productId = formData.get('productId') as string
  const quantity = parseInt(formData.get('quantity') as string || '1')
  const discount = parseFloat(formData.get('discount') as string || '0')
  
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) throw new Error('Product not found')
  
  const unitPrice = product.basePrice
  const subtotal = (unitPrice * quantity) - discount
  
  await prisma.quotationItem.create({
    data: {
      quotationId,
      productId,
      quantity,
      unit: product.unit,
      unitPrice,
      discount,
      subtotal
    }
  })

  // Recalculate quotation totals
  const qItems = await prisma.quotationItem.findMany({ where: { quotationId } })
  const totalSubtotal = qItems.reduce((acc, item) => acc + item.subtotal, 0)
  const tax = totalSubtotal * 0.11 // 11% tax assumption
  const grandTotal = totalSubtotal + tax

  await prisma.quotation.update({
    where: { id: quotationId },
    data: { subtotal: totalSubtotal, tax, grandTotal }
  })
  
  revalidatePath(`/quotations/${quotationId}`)
}
