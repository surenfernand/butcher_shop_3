import type { CollectionAfterChangeHook } from 'payload'

type RelationshipValue = number | string | { id?: number | string } | null | undefined

const getRelationshipId = (value: RelationshipValue) => {
  if (!value) return null
  if (typeof value === 'object') return value.id ?? null
  return value
}

export const reduceBranchInventory = (): CollectionAfterChangeHook => {
  return async ({ doc, operation, req, context }) => {
    if (context?.skipReduceBranchInventory) return doc
    if (req.context?.skipReduceBranchInventory) return doc

    // Stock must be deducted once when the order is placed — not on every admin edit.
    // Running on `update` triggers a nested `payload.update` on this same order from inside
    // `afterChange`, which can deadlock or leave the admin UI stuck on "Submitting...".
    if (operation !== 'create') return doc
    if ((doc as any).inventoryReduced) return doc

    const branchID = getRelationshipId((doc as any).fulfillment?.branch || (doc as any).branch)
    const items = (doc as any).items || (doc as any).lineItems || []

    if (!branchID || !Array.isArray(items) || items.length === 0) return doc

    const itemMap = new Map<string, number>()

    for (const item of items) {
      const productID = getRelationshipId(item.product || item.productID)
      const quantity = Number(item.quantity || 1)

      if (!productID || !Number.isFinite(quantity) || quantity <= 0) continue

      const key = String(productID)
      itemMap.set(key, (itemMap.get(key) || 0) + quantity)
    }

    const productIDs = Array.from(itemMap.keys())

    if (productIDs.length === 0) return doc

    const inventory = await req.payload.find({
      collection: 'branch-inventory',
      depth: 0,
      limit: productIDs.length,
      where: {
        and: [
          { branch: { equals: branchID } },
          { product: { in: productIDs } },
        ],
      },
    })

    await Promise.all(
      inventory.docs.map((stock: any) => {
        if (!stock.manageStock) return null

        const productID = String(getRelationshipId(stock.product))
        const quantity = itemMap.get(productID) || 0
        const nextQuantity = Math.max(0, Number(stock.stockQuantity || 0) - quantity)

        return req.payload.update({
          collection: 'branch-inventory',
          id: stock.id,
          data: {
            stockQuantity: nextQuantity,
            stockStatus: nextQuantity > 0 ? stock.stockStatus : 'outofstock',
          },
          overrideAccess: true,
        })
      }),
    )

    await req.payload.update({
      collection: 'orders',
      id: doc.id,
      data: {
        inventoryReduced: true,
      } as any,
      overrideAccess: true,
      context: {
        skipReduceBranchInventory: true,
      },
    })

    return doc
  }
}