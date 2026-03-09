// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/style.css'],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css',
          integrity: 'sha384-wcIxkf4k558AjM3Yz3BBFQUbk/zgIYC2R0QpeeYb+TwlBVMrlgLqwRjRtGZiK7ww',
          crossorigin: 'anonymous',
        },
      ],
    },
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    'nuxt-meilisearch',
    '@vueuse/nuxt',
    '@nuxtjs/plausible',
    '@nuxtjs/algolia',
  ],

  algolia: {
    apiKey: '8a0e8ff6ce82bb377db643e2203d4cc9',
    applicationId: 'A96G3B0V8P',
    docSearch: {
      indexName: 'vknet',
    },
  },

  components: {
    global: true,
    dirs: ['~/components'],
  },

  meilisearch: {
    hostUrl: 'https://search.vkdoc.net',
    searchApiKey: '3653930cde1ea048501e365b9cd24fc7df4a40248bb2ef185868468c3203ccf8',
  },

  site: {
    url: 'https://vkdoc.net',
  },

  routeRules: {
    '/chapters': { redirect: '/chapters/introduction' },
    '/chapters/**': { isr: true, prerender: true },
    '/man/**': { isr: true, prerender: true },
    '/extensions/**': { isr: true, prerender: true },
  },

  plausible: {
    apiHost: 'https://analytics.vkdoc.net',
  },

  nitro: {
    prerender: {
      routes: [
        '/',
        '/copyright',
      ],
    },
  },

  runtimeConfig: {
    plausibleToken: '',
  },

  compatibilityDate: '2025-03-08',
})
