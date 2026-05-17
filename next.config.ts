import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const s3Bucket = process.env.S3_BUCKET
const s3Region = process.env.S3_REGION
const s3Endpoint = process.env.S3_ENDPOINT

let s3EndpointHostname: string | undefined
if (s3Endpoint) {
  try {
    s3EndpointHostname = new URL(s3Endpoint).hostname
  } catch {
    /* ignore invalid S3_ENDPOINT */
  }
}

const nextConfig: NextConfig = {
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/images/**',
      },
    ],
    qualities: [90, 100],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      ...(s3EndpointHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: s3EndpointHostname,
            },
          ]
        : s3Bucket && s3Region
          ? [
              {
                protocol: 'https' as const,
                hostname: `${s3Bucket}.s3.${s3Region}.amazonaws.com`,
              },
              {
                protocol: 'https' as const,
                hostname: `s3.${s3Region}.amazonaws.com`,
              },
            ]
          : []),
    ],
  },
  reactStrictMode: true,
  redirects,
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  // output: 'standalone',
}

export default withPayload(nextConfig)
