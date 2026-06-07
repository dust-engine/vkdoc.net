import { defineNuxtModule, useLogger } from '@nuxt/kit'

const logger = useLogger('highlight')

export default defineNuxtModule({
  async setup(_, nuxt) {
    // Prerender routes are only needed for `nuxt build` / `nuxt generate`.
    // In dev, Nuxt 4.4+ converts every prerender route into a route rule and
    // compiles them all into the virtual route-rules.mjs module — with ~3600
    // routes the generated code overflows Rollup's parser stack.
    if (nuxt.options.dev) {
      return
    }

    nuxt.options.nitro.prerender = nuxt.options.nitro.prerender || {}
    nuxt.options.nitro.prerender.routes = nuxt.options.nitro.prerender.routes || []
    const routes = new Set(nuxt.options.nitro.prerender.routes)

    try {
      {
        // Add refpages
        const results = await fetch('https://data.vkdoc.net/man/index.json')
        const resultJson = await results.json()
        for (const item of resultJson) {
          routes.add(`/man/${item.id}`)
        }
      }
      {
        // Add chapters
        const results = await fetch('https://data.vkdoc.net/chapters/index.json')
        const resultJson = await results.json()
        for (const item of resultJson) {
          routes.add(`/chapters/${item.id}`)
        }
      }
      {
        // Add extensions
        const results = await fetch('https://data.vkdoc.net/extensions/index.json')
        const resultJson = await results.json()
        for (const item of resultJson) {
          routes.add(`/extensions/${item.extension}`)
          if (item.proposal) {
            routes.add(`/extensions/${item.extension}/proposal`)
          }
        }
      }
      nuxt.options.nitro.prerender.routes = Array.from(routes)
    } catch (e) {
      logger.warn('Failed to fetch prerender routes from data.vkdoc.net:', (e as Error).message)
    }
  },
})
