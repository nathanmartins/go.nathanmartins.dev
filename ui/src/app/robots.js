export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: 'https://go.nathanmartins.sh/sitemap.xml',
    }
}