import type { Endpoint } from 'payload'
import { getPostalPrefix, normalizePostalCode } from '../utilities/normalizePostalCode'

export const findBranchEndpoint: Endpoint = {
  path: '/multi-location/find-branch',
  method: 'post',
  handler: async (req) => {
    const body = await req.json?.().catch(() => ({}))

    const branch = body?.branch
    const serviceType = body?.serviceType || 'delivery'
    const postalCode = normalizePostalCode(body?.postalCode)
    const prefix = getPostalPrefix(postalCode)

    if (!branch) {
      return Response.json({ error: 'branch is required' }, { status: 400 })
    }

    if (serviceType === 'delivery' && !postalCode) {
      return Response.json({ error: 'postalCode is required for delivery' }, { status: 400 })
    }

    const schedules = await req.payload.find({
      collection: 'fulfillment-schedules',
      depth: 1,
      limit: 100,
      where: {
        and: [
          { branch: { equals: branch } },
          { isActive: { equals: true } },
          { serviceType: { equals: serviceType } },
        ],
      },
    })

    const matchingSchedules = schedules.docs.filter((schedule: any) => {
      if (serviceType === 'pickup') return true

      const codes = schedule.postalCodes || []
      return codes.some((entry: any) => {
        const code = normalizePostalCode(entry?.code || entry)
        return code === postalCode || code === prefix || postalCode.startsWith(code)
      })
    })

    const selectedBranch = matchingSchedules[0]?.branch || null

    return Response.json({
      branch: selectedBranch,
      schedules: matchingSchedules,
    })
  },
}
