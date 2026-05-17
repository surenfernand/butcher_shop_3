import './ensurePayloadGlobalCache'
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
    BoldFeature,
    EXPERIMENTAL_TableFeature,
    IndentFeature,
    ItalicFeature,
    LinkFeature,
    OrderedListFeature,
    UnderlineFeature,
    UnorderedListFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'
import 'dotenv/config'
import path from 'path'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages/index'
import { Users } from '@/collections/Users'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { ShopPage } from '@/globals/ShopPage'
import { CutTypes } from './collections/ProductCategories/CutTypes'
import { Flavors } from './collections/ProductCategories/Flavors'
import { MeatTypes } from './collections/ProductCategories/MeatTypes'
import { Qualities } from './collections/ProductCategories/Qualities'
import { CartSettings } from './globals/CartSettings'
import { ShopLuxuryPage } from './globals/ShopLuxuryPage'
import { plugins } from './plugins'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const s3Bucket = process.env.S3_BUCKET?.trim()
const s3Region = process.env.S3_REGION?.trim()
const s3Key = process.env.S3_ACCESS_KEY_ID?.trim()
const s3Secret = process.env.S3_SECRET_ACCESS_KEY?.trim()
const s3Endpoint = process.env.S3_ENDPOINT?.trim()
const s3ForcePathStyle =
  process.env.S3_FORCE_PATH_STYLE === 'false'
    ? false
    : process.env.S3_FORCE_PATH_STYLE === 'true' || Boolean(s3Endpoint)
const useS3Storage = Boolean(s3Bucket && s3Region && s3Key && s3Secret)

export default buildConfig({
  admin: {
    components: {
      graphics: {
        Logo: '@/components/AdminAuthLogo#AdminAuthLogo',
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
    },
    user: Users.slug,
  },
  collections: [
    Users,
    Pages,
    Categories,
    Media,

    MeatTypes,
    CutTypes,
    Qualities,
    Flavors,
  ],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Sync Drizzle schema → Postgres in dev. For production, run migrations instead of relying on push.
    // For production, run migrations or a managed deploy step instead of relying on push.
    push: process.env.NODE_ENV !== 'production',
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  //email: nodemailerAdapter(),
  endpoints: [],
  globals: [Header, Footer, ShopPage, ShopLuxuryPage, CartSettings],
  plugins: [
    ...(useS3Storage
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: s3Bucket!,
            config: {
              region: s3Region!,
              credentials: {
                accessKeyId: s3Key!,
                secretAccessKey: s3Secret!,
              },
              ...(s3Endpoint
                ? {
                    endpoint: s3Endpoint,
                    forcePathStyle: s3ForcePathStyle,
                  }
                : {}),
            },
          }),
        ]
      : []),
    ...plugins,
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // sharp,
})
