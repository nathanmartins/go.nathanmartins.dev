const repos = require('@/repos.json')

export default async function sitemap() {
  const repoPages = repos.map((repo) => {
    return {
      url: `https://go.nathanmartins.sh/${repo.go_package}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    }
  })

  return [
    {
      url: 'https://go.nathanmartins.sh',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    ...repoPages
  ]
}
