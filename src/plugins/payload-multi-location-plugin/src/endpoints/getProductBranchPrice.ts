import type { Endpoint } from 'payload'

export const getProductBranchPriceEndpoint: Endpoint = {
  path: '/multi-location/product-price',
  method: 'get',
  handler: async (req) => {
    const url = new URL(req.url || '', 'http://payload.local')
    const product = url.searchParams.get('product')
    const branch = url.searchParams.get('branch')

    if (!product || !branch) {
      return Response.json({ error: 'product and branch are required' }, { status: 400 })
    }

    const inventory = await req.payload.find({
      collection: 'branch-inventory',
      depth: 1,
      limit: 1,
      where: {
        and: [{ product: { equals: product } }, { branch: { equals: branch } }],
      },
    })

    const item = inventory.docs[0]
    const legacyBranchPrice = item
      ? ((item as unknown as { salePrice?: number | null }).salePrice ??
        (item as unknown as { price?: number | string | null }).price ??
        null)
      : null
    const productPrice =
      item && typeof item.product === 'object'
        ? item.product.purchaseFrequencies?.oneTime?.priceOverride ?? item.product.priceInUSD ?? null
        : null

    return Response.json({
      inventory: item || null,
      price: legacyBranchPrice ?? productPrice,
      stockStatus: item?.stockStatus ?? null,
      stockQuantity: item?.stockQuantity ?? null,
    })
  },
}
