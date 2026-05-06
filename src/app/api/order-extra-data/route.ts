import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { getPurchaseUnitPriceInCents, type PurchaseType } from '@/utilities/purchasePricing'
import { batchResolveOrderLinesForPricing } from '@/utilities/resolveOrderLinePricingDocs'

const normalizePurchaseType = (value: unknown): PurchaseType => {
  if (value === 'weekly' || value === 'monthly') return value
  return 'one_time'
}

const getRefID = (value: unknown) => {
  if (typeof value === 'object' && value && 'id' in value) {
    return String((value as { id: string | number }).id)
  }

  if (value !== null && value !== undefined) return String(value)

  return ''
}

const getRelationshipID = (value: unknown): number | undefined => {
  const ref = getRefID(value)

  if (!ref) return undefined

  const numericID = Number(ref)

  return Number.isFinite(numericID) ? numericID : undefined
}

const normalizePurchaseTypes = (value: unknown) => {
  if (!Array.isArray(value)) return []

  return value
    .map((line) => {
      if (!line || typeof line !== 'object') return null

      const product = 'product' in line ? getRelationshipID(line.product) : undefined

      if (!product) return null

      const variant = 'variant' in line ? getRefID(line.variant) || undefined : undefined

      const purchaseType = normalizePurchaseType(
        'purchaseType' in line ? line.purchaseType : undefined,
      )

      return {
        product,
        ...(variant ? { variant } : {}),
        purchaseType,
      }
    })
    .filter(Boolean) as Array<{
      product: number
      variant?: string
      purchaseType: PurchaseType
    }>
}

const getPurchaseTypeForOrderLine = (
  item: { product?: unknown; variant?: unknown },
  purchaseTypes: Array<{ product: number; variant?: string; purchaseType: PurchaseType }>,
  fallback: PurchaseType,
): PurchaseType => {
  const productID = getRefID(item.product)
  const variantID = getRefID(item.variant)

  const match = purchaseTypes.find((line) => {
    if (String(line.product) !== productID) return false

    return String(line.variant || '') === String(variantID || '')
  })

  return match?.purchaseType || fallback
}

const toCents = (value: unknown) => {
  const amount = Number(value || 0)

  return Number.isFinite(amount) ? Math.round(amount) : 0
}

const normalizeFulfillment = (fulfillment: any) => {
  if (!fulfillment || typeof fulfillment !== 'object') return {}

  return {
    branch: fulfillment.branch || null,
    serviceType: fulfillment.serviceType || null,
    date: fulfillment.date || null,
    timeSlot: fulfillment.timeSlot || null,
    postalCode: fulfillment.postalCode || null,
    shippingCharge: toCents(fulfillment.shippingCharge),

    notes: fulfillment.notes || null,
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { orderID, fulfillment, purchaseType, purchaseTypes } = body

    console.log('ORDER EXTRA DATA API BODY', {
      orderID,
      fulfillment,
      purchaseType,
      purchaseTypes,
    })

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const normalizedPurchaseTypes = normalizePurchaseTypes(purchaseTypes)

    const normalizedPurchaseType =
      normalizedPurchaseTypes[0]?.purchaseType || normalizePurchaseType(purchaseType)

    const normalizedFulfillment = normalizeFulfillment(fulfillment)

    console.log('1 normalized data', {
      normalizedFulfillment,
      normalizedPurchaseType,
      normalizedPurchaseTypes,
    })

    const order = await payload.findByID({
      collection: 'orders',
      id: orderID,
      depth: 0,
      overrideAccess: true,
    })

    console.log('2 order found', {
      id: order.id,
      items: order.items,
    })

    const linePricingDocs = await batchResolveOrderLinesForPricing(payload, order.items)

    console.log('3 pricing docs resolved', linePricingDocs.length)

    const itemsSubtotal = linePricingDocs.reduce((total, row) => {
      if (!row.product) return total

      const purchaseTypeForLine = getPurchaseTypeForOrderLine(
        row.item,
        normalizedPurchaseTypes,
        normalizedPurchaseType,
      )

      const unitPrice = getPurchaseUnitPriceInCents(
        row.product,
        row.variant,
        purchaseTypeForLine,
      )

      return total + unitPrice * (row.item.quantity || 0)
    }, 0)

    const shippingTotal =
      normalizedFulfillment.serviceType === 'delivery'
        ? toCents(normalizedFulfillment.shippingCharge)
        : 0


    const amount = itemsSubtotal + shippingTotal

    console.log('4 before update', {
      amount,
      itemsSubtotal,
      shippingTotal,

      fulfillment: normalizedFulfillment,
      purchaseType: normalizedPurchaseType,
      purchaseTypes: normalizedPurchaseTypes,
    })

    const updatedOrder = await payload.update({
      collection: 'orders',
      id: orderID,
      data: {
        amount,
        fulfillment: normalizedFulfillment,
        purchaseType: normalizedPurchaseType,
        purchaseTypes: normalizedPurchaseTypes,
      },
      overrideAccess: true,
      context: {
        skipReduceBranchInventory: true,
      },
    })

    console.log('5 UPDATED ORDER EXTRA DATA', {
      id: updatedOrder.id,
      amount: updatedOrder.amount,
      fulfillment: updatedOrder.fulfillment,
      purchaseType: updatedOrder.purchaseType,
      purchaseTypes: updatedOrder.purchaseTypes,
    })

    return NextResponse.json({
      success: true,
      orderID: updatedOrder.id,
      amount: updatedOrder.amount,
      fulfillment: updatedOrder.fulfillment,
      purchaseType: updatedOrder.purchaseType,
      purchaseTypes: updatedOrder.purchaseTypes,
    })
  } catch (error) {
    console.error('order-extra-data failed full:', JSON.stringify(error, null, 2))
    console.error('order-extra-data failed raw:', error)

    return NextResponse.json(
      {
        error: 'Failed to save order extra data',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}