import type { CollectionBeforeValidateHook } from 'payload'

type Options = { orderSlug: string }

export const validateBranchInventory = (_options: Options): CollectionBeforeValidateHook => {
  return async ({ data, req, operation }) => {
    if (!data) return data

    // Inventory vs branch stock was already enforced when the order was created.
    // Re-running on update breaks admin edits (e.g. changing order status) when
    // branch inventory changed later or data is partially populated.
    if (operation !== 'create') return data

    const branch = data.fulfillment?.branch || data.branch
    const items = data.items || data.lineItems || []

    if (!branch || !Array.isArray(items) || items.length === 0) return data

    for (const item of items) {
      const productID = item.product?.id || item.product || item.productID
      const quantity = Number(item.quantity || 1)
      if (!productID) continue

      const inventory = await req.payload.find({
        collection: 'branch-inventory',
        depth: 0,
        limit: 1,
        where: { and: [{ branch: { equals: branch } }, { product: { equals: productID } }] },
      })

      const stock = inventory.docs[0] as any
      if (!stock) throw new Error(`This product is not available at the selected branch.`)
      if (stock.stockStatus === 'outofstock') throw new Error(`A product in your cart is out of stock at this branch.`)
      if (stock.manageStock && !stock.allowBackorders && Number(stock.stockQuantity || 0) < quantity) {
        throw new Error(`Only ${stock.stockQuantity || 0} items are available at the selected branch.`)
      }
    }

    return data
  }
}
