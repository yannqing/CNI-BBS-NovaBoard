const withMDX = require('@next/mdx')({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // 如果需要使用 MDX 中的 frontmatter，设置为 true
    providerImportSource: "@mdx-js/react"
  }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // MDX 配置应该在这里
  experimental: {
    mdxRs: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        }
      }
    }
  },

  webpack(config) {
    // SVG 处理规则
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      }
    )
    fileLoaderRule.exclude = /\.svg$/i

    return config
  }
}

module.exports = withMDX(nextConfig)