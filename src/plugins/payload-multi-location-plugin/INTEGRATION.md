# Butcher shop integration

1. Copy this plugin into `src/plugins/multi-location`.
2. Add it to `src/plugins/index.ts` after the ecommerce plugin or before it. If the `orders` collection does not exist before this plugin runs, place this plugin after ecommerce plugin configuration or move the order override into ecommerce `ordersCollectionOverride`.
3. Create branch records in Payload admin.
4. Create branch inventory records for every sellable product and branch.
5. Add the branch selector component to your product page, cart modal, or checkout page.

Example frontend use:

```tsx
import { BranchSelector } from '@/plugins/multi-location/src/components/BranchSelector.client'

export default function CheckoutPage() {
  return <BranchSelector onBranchSelected={(branch) => console.log(branch)} />
}
```

For production, store selected branch in your cart/session and send `fulfillment` when creating the order.
