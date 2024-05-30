export default function manifest() {
    return {
      name: 'go.nathanmartins.sh',
      short_name: 'go.nathanmartins.sh',
      description: "nathanmartins's Go Package Index",
      start_url: '/',
      display: 'standalone',
      background_color: '#0c0a09',
      theme_color: '#0c0a09',
      icons: [
        {
          src: '/favicon.ico',
          sizes: 'any',
          type: 'image/x-icon',
        },
      ],
    }
  }