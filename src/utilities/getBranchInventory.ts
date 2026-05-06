export async function getBranchInventory({
  productId,
  branchId,
}: {
  productId: string | number
  branchId: string | number
}) {
  if (!productId || !branchId) {
    return {
      stockQuantity: 0,
      stockStatus: 'outofstock',
      price: null,
      inventory: null,
    }
  }

  const res = await fetch(
    `/api/multi-location/product-price?product=${productId}&branch=${branchId}`,
  )

  if (!res.ok) {
    return {
      stockQuantity: 0,
      stockStatus: 'outofstock',
      price: null,
      inventory: null,
    }
  }

  return res.json()
}