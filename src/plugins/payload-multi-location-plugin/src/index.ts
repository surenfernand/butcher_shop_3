import type { CollectionConfig, CollectionSlug, Config, Field, Plugin } from 'payload'
import type { MultiLocationPluginOptions } from './types'
import { createBranchesCollection } from './collections/Branches'
import { createBranchInventoryCollection } from './collections/BranchInventory'
import { createFulfillmentSchedulesCollection } from './collections/FulfillmentSchedules'
import { createBranchHolidaysCollection } from './collections/BranchHolidays'
import { findBranchEndpoint } from './endpoints/findBranch'
import { getFulfillmentOptionsEndpoint } from './endpoints/getFulfillmentOptions'
import { getProductBranchPriceEndpoint } from './endpoints/getProductBranchPrice'
import { listBranchesEndpoint } from './endpoints/listBranches'
import { reduceBranchInventory } from './hooks/reduceBranchInventory'
import { validateBranchInventory } from './hooks/validateBranchInventory'
import { validateMaxOrdersPerDay } from './hooks/validateMaxOrdersPerDay'

export const multiLocationPlugin = (options: MultiLocationPluginOptions = {}): Plugin => {
  const {
    enabled = true,
    productSlug = 'products',
    orderSlug = 'orders',
    adminGroup = 'Shop',
  } = options

  const typedProductSlug = productSlug as CollectionSlug
  const typedOrderSlug = orderSlug as CollectionSlug

  return (incomingConfig: Config): Config => {
    if (!enabled) return incomingConfig

    const collections = incomingConfig.collections || []

 
    const fulfillmentField: Field = {
      name: 'fulfillment',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'branch', type: 'relationship', relationTo: 'branches' },
        {
          name: 'serviceType',
          type: 'select',
          options: [
            { label: 'Pickup', value: 'pickup' },
            { label: 'Delivery', value: 'delivery' },
          ],
        },
        { name: 'date', type: 'date' },
        { name: 'timeSlot', type: 'text' },
        { name: 'postalCode', type: 'text' },
        {
          name: 'shippingCharge',
          type: 'number',
          min: 0,
          admin: {
            description: 'Shipping charge stored in cents',
          },
        },
        { name: 'notes', type: 'textarea' },
      ],
    }

    const patchedCollections: CollectionConfig[] = collections.map((collection) => {
      if (collection.slug !== typedOrderSlug) return collection

      return {
        ...collection,
        fields: [...collection.fields, fulfillmentField],
        hooks: {
          ...collection.hooks,
          beforeValidate: [
            ...(collection.hooks?.beforeValidate || []),
            validateBranchInventory({ orderSlug: typedOrderSlug }),
            validateMaxOrdersPerDay(typedOrderSlug),
          ],
          afterChange: [...(collection.hooks?.afterChange || []), reduceBranchInventory()],
        },
      }
    })

    return {
      ...incomingConfig,
      collections: [
        ...patchedCollections,
        createBranchesCollection(adminGroup),
        createBranchInventoryCollection(typedProductSlug, adminGroup),
        createFulfillmentSchedulesCollection(typedProductSlug, adminGroup),
        createBranchHolidaysCollection(adminGroup),
      ],
      endpoints: [
        ...(incomingConfig.endpoints || []),
        listBranchesEndpoint,
        findBranchEndpoint,
        getProductBranchPriceEndpoint,
        getFulfillmentOptionsEndpoint,
      ],
    }
  }
}

export default multiLocationPlugin