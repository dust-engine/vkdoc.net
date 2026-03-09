<script setup lang="ts">
useSeoMeta({
  title: 'VulkanHub',
  description: 'Better Vulkan Documentation starts here',
  ogTitle: 'VulkanHub',
  ogSiteName: 'VulkanHub',
  ogDescription: 'Better Vulkan Documentation starts here',
})

const { data: version } = useFetch('https://data.vkdoc.net/index.json')
const { data: topPages } = useFetch<{ page: string, visitors: number }[]>('/api/top')

const versionLabel = computed(() =>
  version.value ? `Vulkan ${version.value.version}` : '',
)
const updatedLabel = computed(() => {
  if (!version.value) return ''
  return `Updated ${new Date(version.value.last_changed * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
})

const topPagesList = computed(() => {
  if (!topPages.value) return []
  return topPages.value.slice(0, 12).map(p => ({
    name: p.page.replace('/man/', ''),
    to: p.page,
    visitors: p.visitors,
  }))
})
</script>

<template>
  <UPageHero
    title="VulkanHub"
    description="The Vulkan GPU API specification, restructured for the web. Searchable, fast, and always up to date."
    :links="[
      { label: 'Start Reading', icon: 'i-lucide-book-open', size: 'xl', to: '/chapters/introduction' },
    ]"
  >
    <template #headline>
      <UBadge v-if="versionLabel" color="primary" variant="subtle">
        {{ versionLabel }}
      </UBadge>
      <USeparator orientation="vertical" v-if="updatedLabel" class="h-4" />
      <span v-if="updatedLabel" class="text-sm text-muted">{{ updatedLabel }}</span>
    </template>
  </UPageHero>

  <UPageSection
    headline="Browse"
    title="Jump In"
    description="Three ways to explore the Vulkan specification."
  >
    <UPageGrid>
      <UPageCard
        title="Specification"
        description="Read the full Vulkan specification organized by chapter, from introduction to advanced topics."
        icon="i-lucide-book-open"
        to="/chapters/introduction"
        variant="outline"
        spotlight
        spotlight-color="primary"
      />
      <UPageCard
        title="Reference Pages"
        description="Look up any function, structure, enum, or handle by name with detailed API documentation."
        icon="i-lucide-file-code"
        to="/man/VkResult"
        variant="outline"
        spotlight
        spotlight-color="primary"
      />
      <UPageCard
        title="Extensions"
        description="Browse Vulkan extensions by vendor, category, or special use with status and contact info."
        icon="i-lucide-puzzle"
        to="/extensions/VK_KHR_ray_tracing_pipeline"
        variant="outline"
        spotlight
        spotlight-color="primary"
      />
    </UPageGrid>
  </UPageSection>

  <UPageSection
    headline="Features"
    title="Built for Developers"
    :features="[
      { title: 'Full-Text Search', description: 'Instantly find functions, structs, enums, validation codes, and more with Algolia-powered search.', icon: 'i-lucide-search' },
      { title: 'Always Current', description: 'Automatically rebuilt from the latest Vulkan specification source to keep you up to date.', icon: 'i-lucide-refresh-cw' },
      { title: 'Web-First', description: 'Custom AsciiDoc-to-HTML conversion produces clean, readable pages optimized for the browser.', icon: 'i-lucide-globe' },
      { title: 'Light & Dark Mode', description: 'Switch between light and dark themes for comfortable reading in any environment.', icon: 'i-lucide-sun-moon' },
      { title: 'Deep Linking', description: 'Every section, anchor, and refpage has a stable URL you can bookmark and share.', icon: 'i-lucide-link' },
      { title: 'Open Source', description: 'The entire site is open source. Contributions and feedback are welcome on GitHub.', icon: 'i-lucide-github' },
    ]"
  />

  <UPageSection
    v-if="topPagesList.length"
    headline="Trending"
    title="Popular Reference Pages"
    description="Most visited pages in the last 7 days."
  >
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <NuxtLink
        v-for="item in topPagesList"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg border border-default px-4 py-3 text-sm hover:bg-elevated transition-colors"
      >
        <UIcon name="i-lucide-file-code" class="text-primary size-4 shrink-0" />
        <span class="truncate font-mono text-xs">{{ item.name }}</span>
      </NuxtLink>
    </div>
  </UPageSection>
</template>
