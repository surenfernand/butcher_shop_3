import type { Endpoint } from 'payload'

export const listBranchesEndpoint: Endpoint = {
  path: '/multi-location/branches',
  method: 'get',
  handler: async (req) => {
    const branches = await req.payload.find({
      collection: 'branches',
      depth: 0,
      limit: 100,
      where: { isActive: { equals: true } },
      sort: 'name',
    })

    return Response.json({ branches: branches.docs })
  },
}
