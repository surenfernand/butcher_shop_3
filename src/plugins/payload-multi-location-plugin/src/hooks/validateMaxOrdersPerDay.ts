import type { CollectionBeforeValidateHook, CollectionSlug } from 'payload'

type RelationshipValue = number | string | { id?: number | string } | null | undefined

const getProductId = (value: RelationshipValue) => {
  if (!value) return null
  if (typeof value === 'object') return value.id ?? null
  return value
}

export const validateMaxOrdersPerDay = (
  orderSlug: CollectionSlug = 'orders',
): CollectionBeforeValidateHook => {
  return async ({ data, req, operation }) => {
    if (!data || operation !== 'create') return data

    const branch = data.fulfillment?.branch || data.branch
    const serviceType = data.fulfillment?.serviceType || data.serviceType
    const requestedDate = data.fulfillment?.date || data.fulfillmentDate
    const items = data.items || []

    if (!branch || !serviceType || !requestedDate) return data

    const start = new Date(requestedDate)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(end.getDate() + 1)

    const schedules = await req.payload.find({
      collection: 'fulfillment-schedules',
      depth: 0,
      limit: 1,
      where: {
        and: [
          { branch: { equals: branch } },
          { serviceType: { equals: serviceType } },
          { isActive: { equals: true } },
        ],
      },
    })

    const scheduleMax = Number((schedules.docs[0] as any)?.maxOrdersPerDay || 0)

    const existing = await req.payload.find({
      collection: orderSlug,
      depth: 0,
      limit: 1000,
      where: {
        and: [
          { 'fulfillment.branch': { equals: branch } },
          { 'fulfillment.serviceType': { equals: serviceType } },
          { 'fulfillment.date': { greater_than_equal: start.toISOString() } },
          { 'fulfillment.date': { less_than: end.toISOString() } },
        ],
      },
    })

    if (scheduleMax && existing.totalDocs >= scheduleMax) {
      throw new Error('This delivery/pickup date is fully booked. Please select another date.')
    }

    for (const item of items as any[]) {
      const productId = getProductId(item.product)
      if (!productId) continue

      const inventory = await req.payload.find({
        collection: 'branch-inventory',
        depth: 0,
        limit: 1,
        where: {
          and: [{ branch: { equals: branch } }, { product: { equals: productId } }],
        },
      })

      const inventoryDoc = inventory.docs[0] as any
      if (!inventoryDoc) continue

      const max = Number(
        serviceType === 'pickup'
          ? inventoryDoc.maxPickupOrdersPerDay || 0
          : inventoryDoc.maxDeliveryOrdersPerDay || 0,
      )

      if (!max) continue

      const existingQty = existing.docs.reduce((sum: number, order: any) => {
        const orderItems = order.items || []

        return (
          sum +
          orderItems.reduce((itemSum: number, existingItem: any) => {
            return getProductId(existingItem.product) === productId
              ? itemSum + Number(existingItem.quantity || 1)
              : itemSum
          }, 0)
        )
      }, 0)

      const requestedQty = Number(item.quantity || 1)

      if (existingQty + requestedQty > max) {
        throw new Error(
          'The selected date is fully booked for this product. Please select another date or lower the quantity.',
        )
      }
    }

    return data
  }
}