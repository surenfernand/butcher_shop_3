# Payload Multi Location Plugin

A clean Payload CMS conversion of the WordPress/WooCommerce **Multiple Location Selector** plugin.

This is not a one-to-one PHP port. It converts the plugin concepts into Payload-native pieces:

- `branches` collection
- `branch-inventory` collection
- `fulfillment-schedules` collection
- `branch-holidays` collection
- postal-code branch lookup endpoint
- branch product price/stock endpoint
- delivery/pickup fulfillment options endpoint
- order hooks for stock validation, max orders per day, and stock reduction
- a starter React branch selector component

## Install inside your Payload project

Copy this folder to:

```txt
src/plugins/multi-location
```

Then edit `src/plugins/index.ts`:

```ts
import { multiLocationPlugin } from './multi-location'

export const plugins: Plugin[] = [
  // existing plugins...
  multiLocationPlugin({
    productSlug: 'products',
    orderSlug: 'orders',
    adminGroup: 'Shop',
  }),
]
```

Run:

```bash
npm run generate:types
npm run dev
```

## Endpoints

Payload mounts these under `/api` by default:

```txt
POST /api/multi-location/find-branch
GET  /api/multi-location/product-price?product=PRODUCT_ID&branch=BRANCH_ID
GET  /api/multi-location/fulfillment-options?branch=BRANCH_ID&serviceType=delivery
```

## Checkout data shape

When creating an order, include:

```json
{
  "fulfillment": {
    "branch": "BRANCH_ID",
    "serviceType": "delivery",
    "date": "2026-04-25T00:00:00.000Z",
    "timeSlot": "10:00 AM - 12:00 PM",
    "postalCode": "M5V 2T6"
  }
}
```

## Mapping from WordPress plugin files

| WordPress file | Payload replacement |
|---|---|
| `woocommerce-branch-override.php` | `branch-inventory` + order validation/reduction hooks |
| `custom_price_manager.php` | `/product-price` endpoint + frontend price refresh |
| `checkout_date_time_type_selection.php` | `fulfillment-schedules` + order `fulfillment` group |
| `max-orders-per-day-manager.php` | `validateMaxOrdersPerDay` hook |
| `woocommerce-holiday-manager.php` | `branch-holidays` collection |
| `add_to_cart_popup_manager.php` | `BranchSelector.client.tsx` |
| `checkout-quantity-manager.php` | ecommerce cart UI quantity controls in Next.js |
| `email-manager.php` | order email templates / transactional provider logic |
| subscription files | should be rebuilt separately if subscriptions are still needed |

## Notes

The plugin assumes your Payload ecommerce plugin creates an `orders` collection. If your order fields are named differently than `items` or `lineItems`, adjust the hooks in `src/hooks`.
