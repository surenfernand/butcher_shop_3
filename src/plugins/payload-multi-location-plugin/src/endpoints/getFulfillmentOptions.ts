// src/plugins/payload-multi-location-plugin/src/endpoints/getFulfillmentOptions.ts

import type { Endpoint } from 'payload'
import { getPostalPrefix, normalizePostalCode } from '../utilities/normalizePostalCode'

const getRelationshipID = (value: any) => {
  if (!value) return undefined
  if (typeof value === 'object') return String(value.id)
  return String(value)
}

const getRelationshipIDs = (value: any): string[] => {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.map(getRelationshipID).filter(Boolean) as string[]
  }

  const id = getRelationshipID(value)
  return id ? [id] : []
}

const normalizeDays = (days: any[] = []) => days.map((day) => String(day).toLowerCase())

const intersectDays = (dayGroups: string[][]) => {
  if (!dayGroups.length) return []

  return dayGroups.reduce((commonDays, days) =>
    commonDays.filter((day) => days.includes(day)),
  )
}

export const getFulfillmentOptionsEndpoint: Endpoint = {
  path: '/multi-location/fulfillment-options',
  method: 'get',
  handler: async (req) => {
    const url = new URL(req.url || '')
    const branch = url.searchParams.get('branch')
    const serviceType = url.searchParams.get('serviceType') || 'pickup'
    const postalCode = normalizePostalCode(url.searchParams.get('postalCode'))
    const prefix = getPostalPrefix(postalCode)
    const productIds = (url.searchParams.get('products') || '')
      .split(',')
      .map((product) => product.trim())
      .filter(Boolean)

    if (!branch) {
      return Response.json({ error: 'branch is required' }, { status: 400 })
    }

    const schedules = await req.payload.find({
      collection: 'fulfillment-schedules',
      depth: 1,
      limit: 100,
      where: {
        branch: {
          equals: branch,
        },
        serviceType: {
          equals: serviceType,
        },
      },
    })

    const filteredSchedules = schedules.docs.filter((schedule: any) => {
      if (serviceType !== 'delivery') return true

      if (!schedule.postalCodes?.length) return true

      return schedule.postalCodes.some((postal: any) => {
        const normalized = normalizePostalCode(postal.code)
        const schedulePrefix = getPostalPrefix(normalized)

        return normalized === postalCode || schedulePrefix === prefix
      })
    })

    if (!productIds.length) {
      return Response.json({ schedules: filteredSchedules })
    }

    const branchWideSchedules = filteredSchedules.filter(
      (schedule: any) => getRelationshipIDs(schedule.product).length === 0,
    )

    const schedulesByProduct = productIds.map((productId) => {
      const productSchedules = filteredSchedules.filter((schedule: any) =>
        getRelationshipIDs(schedule.product).includes(String(productId)),
      )

      return productSchedules.length ? productSchedules : branchWideSchedules
    })

    const hasSchedulesForEveryProduct = schedulesByProduct.every((group) => group.length > 0)

    if (!hasSchedulesForEveryProduct) {
      return Response.json({ schedules: [], allowedWeeklyDays: [] })
    }

    const allowedWeeklyDays = intersectDays(
      schedulesByProduct.map((group) =>
        Array.from(new Set(group.flatMap((schedule: any) => normalizeDays(schedule.weeklyDays)))),
      ),
    )

    const uniqueSchedules = Array.from(
      new Map(schedulesByProduct.flat().map((schedule: any) => [schedule.id, schedule])).values(),
    )

    return Response.json({
      schedules: uniqueSchedules,
      allowedWeeklyDays,
    })
  },
}