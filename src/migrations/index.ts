export const migrations: {
  down: (args: import('@payloadcms/db-postgres').MigrateDownArgs) => Promise<void>
  name: string
  up: (args: import('@payloadcms/db-postgres').MigrateUpArgs) => Promise<void>
}[] = []
