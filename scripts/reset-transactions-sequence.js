import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  const result = await client.query(
    "SELECT setval(pg_get_serial_sequence('transactions','id'), COALESCE((SELECT MAX(id) FROM transactions), 1), true) AS seq",
  )

  console.log('transactions sequence reset to', result.rows[0].seq)
  await client.end()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
