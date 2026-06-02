import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BRAIN — Aniekan Israel',
    short_name: 'BRAIN',
    description: 'Personal AI Operating System',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#C9A84C',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
