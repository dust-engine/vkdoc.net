<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { Hit } from '@nuxtjs/algolia'

type EntryType = 'content' | 'lvl1' | 'lvl2' | 'lvl3' | 'lvl4' | 'lvl5' | 'lvl6'

interface SearchItem {
  type: EntryType
  content: string | null
  hierarchy: {
    lvl0?: string
    lvl1?: string
    lvl2?: string
    lvl3?: string
    lvl4?: string
    lvl5?: string
    lvl6?: string
  }
  url: string
}

const { result, search } = useAlgoliaSearch<SearchItem>('vknet')
const breakpoints = useBreakpoints(breakpointsTailwind)

const searchOpen = useState('searchOpen', () => false)

const smallerThanSm = breakpoints.smaller('sm')
const loading = ref(false)

const query = ref('')
const searchActive = ref(false)
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement>()
const resultsRef = ref<HTMLElement>()

const debouncedSearch = useDebounceFn(async () => {
  loading.value = true

  const snippetLength = 10
  await search({
    query: query.value,
    requestOptions: {
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      snippetEllipsisText: '...',
      clickAnalytics: true,
      attributesToRetrieve: [
        'hierarchy.lvl0',
        'hierarchy.lvl1',
        'hierarchy.lvl2',
        'hierarchy.lvl3',
        'hierarchy.lvl4',
        'hierarchy.lvl5',
        'hierarchy.lvl6',
        'content',
        'type',
        'url',
      ],
      attributesToSnippet: [
        `hierarchy.lvl1:${snippetLength}`,
        `hierarchy.lvl2:${snippetLength}`,
        `hierarchy.lvl3:${snippetLength}`,
        `hierarchy.lvl4:${snippetLength}`,
        `hierarchy.lvl5:${snippetLength}`,
        `hierarchy.lvl6:${snippetLength}`,
        `content:${snippetLength}`,
      ],
    },
  })
  searchActive.value = true
  activeIndex.value = 0
  loading.value = false
}, 200, { maxWait: 500 })

const flatHits = computed(() => result.value.hits)

const groupedSearchResult = computed(() => {
  const groups: { label: string, hits: Hit<SearchItem>[] }[] = []
  const seen = new Map<string, number>()
  for (const item of result.value.hits) {
    const key = item.hierarchy.lvl0 || ''
    const idx = seen.get(key)
    if (idx !== undefined) {
      groups[idx].hits.push(item)
    }
    else {
      seen.set(key, groups.length)
      groups.push({ label: key, hits: [item] })
    }
  }
  return groups
})

// Precompute flat index for each hit to avoid O(n) indexOf in the template
const hitFlatIndex = computed(() => {
  const map = new WeakMap<Hit<SearchItem>, number>()
  flatHits.value.forEach((hit, i) => map.set(hit, i))
  return map
})

watch(query, debouncedSearch)

watch(searchOpen, (open) => {
  if (open) {
    nextTick(() => inputRef.value?.focus())
  }
})

function entryTypeToIcon(entryType: EntryType): string {
  if (entryType === 'content') return 'i-lucide-text'
  if (entryType === 'lvl1') return 'i-lucide-book-open'
  return 'i-lucide-hash'
}

function content(hit: Hit<SearchItem>) {
  if (hit.type === 'content') {
    return hit._snippetResult?.content?.value
  }
  return null
}

function header(hit: Hit<SearchItem>) {
  if (hit.type === 'content') {
    return hit._snippetResult?.hierarchy?.lvl1?.value
  }
  return hit._snippetResult?.hierarchy[hit.type]?.value
}

const router = useRouter()

function onSelect(hit: Hit<SearchItem>) {
  let url = hit.url
  const hostname = 'https://vkdoc.net'
  if (url.startsWith(hostname)) {
    url = url.substring(hostname.length)
  }
  onClose()
  router.push(url)
}

function onClose() {
  searchOpen.value = false
  query.value = ''
  searchActive.value = false
  loading.value = false
  activeIndex.value = 0
}

function scrollActiveIntoView() {
  nextTick(() => {
    resultsRef.value?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, flatHits.value.length - 1)
    scrollActiveIntoView()
  }
  else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
    scrollActiveIntoView()
  }
  else if (e.key === 'Enter') {
    e.preventDefault()
    if (flatHits.value[activeIndex.value]) {
      onSelect(flatHits.value[activeIndex.value])
    }
  }
}

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      searchOpen.value = true
    },
  },
})

const { data: topPages } = useFetch<{ page: string, visitors: number }[]>('/api/top')

const suggestions = computed(() => {
  if (topPages.value?.length) {
    return topPages.value.slice(0, 8).map(p => ({
      label: p.page.replace('/man/', ''),
      to: p.page,
    }))
  }
  return [
    { label: 'vkCmdDraw', to: '/man/vkCmdDraw' },
    { label: 'VkResult', to: '/man/VkResult' },
    { label: 'VkPhysicalDeviceFeatures', to: '/man/VkPhysicalDeviceFeatures' },
    { label: 'VK_KHR_ray_tracing_pipeline', to: '/extensions/VK_KHR_ray_tracing_pipeline' },
  ]
})
</script>

<template>
  <UModal
    v-model:open="searchOpen"
    :overlay="!smallerThanSm"
    :transition="!smallerThanSm"
    :ui="{
      content: 'sm:max-w-2xl flex flex-col ' + (smallerThanSm ? 'h-dvh rounded-none' : 'max-h-[min(32rem,80vh)] sm:rounded-lg'),
    }"
    :close="false"
  >
    <template #content>
      <div
        class="flex flex-col min-h-0 flex-1"
        @keydown="onKeydown"
      >
        <!-- Search input -->
        <div class="flex items-center gap-2 px-4 border-b border-default">
          <UIcon
            :name="loading ? 'i-lucide-loader-circle' : 'i-lucide-search'"
            aria-hidden="true"
            :class="loading && 'animate-spin'"
            class="text-muted size-5 shrink-0"
          />
          <input
            ref="inputRef"
            class="flex-1 bg-transparent border-0 text-default placeholder:text-muted focus:ring-0 focus:outline-none text-sm h-12 min-w-0"
            placeholder="Search documentation..."
            autocomplete="off"
            :value="query"
            @input="query = ($event.target as HTMLInputElement).value"
          >
          <UKbd v-if="!smallerThanSm" value="escape" size="sm" />
        </div>

        <!-- Results area -->
        <div ref="resultsRef" class="flex-1 overflow-y-auto overscroll-contain min-h-0">
          <!-- Empty state -->
          <div v-if="!query || !searchActive" class="p-6 space-y-5">
            <p class="text-xs font-medium text-muted uppercase tracking-wide">
              {{ topPages?.length ? 'Trending this week' : 'Quick links' }}
            </p>
            <div class="space-y-1">
              <NuxtLink
                v-for="s in suggestions"
                :key="s.to"
                :to="s.to"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted hover:text-default hover:bg-elevated transition-colors"
                @click="onClose"
              >
                <UIcon name="i-lucide-arrow-right" class="size-4 shrink-0" />
                <span class="font-mono">{{ s.label }}</span>
              </NuxtLink>
            </div>
            <p class="text-xs text-dimmed">
              Try searching for function names, structs, enums, extensions, or validation codes.
            </p>
          </div>

          <!-- No results -->
          <div v-else-if="!loading && !result.hits.length" class="flex flex-col items-center justify-center gap-3 py-16 px-6">
            <UIcon name="i-lucide-search-x" class="text-muted size-10" aria-hidden="true" />
            <p class="text-muted font-medium">
              No results for "{{ query }}"
            </p>
            <p class="text-dimmed text-sm text-center max-w-xs">
              Try a different search term or check the spelling.
            </p>
          </div>

          <!-- Results list -->
          <div v-else class="p-2">
            <div v-for="group in groupedSearchResult" :key="group.label" class="mb-2 last:mb-0">
              <p class="text-[11px] font-semibold text-muted uppercase tracking-wider px-2 py-1.5">
                {{ group.label }}
              </p>
              <div
                v-for="hit in group.hits"
                :key="hit.objectID"
                :data-active="hitFlatIndex.get(hit) === activeIndex"
                class="group flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors"
                :class="hitFlatIndex.get(hit) === activeIndex ? 'bg-primary text-inverted' : 'text-default hover:bg-elevated'"
                @click="onSelect(hit)"
                @mouseenter="activeIndex = hitFlatIndex.get(hit)!"
              >
                <UIcon
                  :name="entryTypeToIcon(hit.type)"
                  class="size-4 shrink-0 transition-colors"
                  :class="hitFlatIndex.get(hit) === activeIndex ? 'text-inverted' : 'text-muted'"
                  aria-hidden="true"
                />
                <div class="flex flex-col gap-0.5 min-w-0 flex-1">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span class="text-sm font-medium truncate" v-html="header(hit)" />
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span
                    v-if="content(hit)"
                    class="text-xs truncate transition-colors"
                    :class="hitFlatIndex.get(hit) === activeIndex ? 'text-inverted/70' : 'text-muted'"
                    v-html="content(hit)"
                  />
                </div>
                <UIcon
                  name="i-lucide-corner-down-left"
                  class="size-4 shrink-0 opacity-0 transition-opacity"
                  :class="hitFlatIndex.get(hit) === activeIndex && 'opacity-100'"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between border-t border-default px-4 py-2">
          <div v-if="!smallerThanSm" class="flex items-center gap-3 text-xs text-muted">
            <span class="inline-flex items-center gap-1">
              <UKbd value="enter" size="sm" />
              select
            </span>
            <span class="inline-flex items-center gap-1">
              <UKbd size="sm">&uarr;</UKbd>
              <UKbd size="sm">&darr;</UKbd>
              navigate
            </span>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-muted ml-auto">
            Search by
            <UIcon class="h-4" name="logos:algolia" />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style>
@reference "~/assets/style.css";

mark {
  @apply bg-primary/40 text-inherit;
}
</style>
