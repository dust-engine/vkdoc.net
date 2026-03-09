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
  const groups: { [key: string]: any[] } = {}
  for (const item of result.value.hits) {
    groups[item.hierarchy.lvl0 || ''] = groups[item.hierarchy.lvl0 || ''] || []
    groups[item.hierarchy.lvl0 || ''].push(item)
  }
  return groups
})

watch(query, debouncedSearch)

function entryTypeToIcon(entryType: EntryType): string {
  if (entryType === 'content') {
    return '@dust:fa6-pro-solid:text-size'
  }
  if (entryType === 'lvl1') {
    return '@dust:fa6-pro-solid:book'
  }
  return '@dust:fa6-pro-solid:hashtag'
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

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, flatHits.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
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
</script>

<template>
  <UModal
    v-model:open="searchOpen"
    :overlay="!smallerThanSm"
    :transition="!smallerThanSm"
    :ui="{
      content: 'sm:max-w-3xl ' + (smallerThanSm ? 'h-dvh rounded-none' : 'h-[28rem] sm:rounded-lg'),
    }"
    :close="false"
  >
    <template #content>
      <div
        class="flex flex-col flex-1 min-h-0 divide-y divide-default"
        @keydown="onKeydown"
      >
        <div class="relative flex items-center">
          <UIcon
            :name="loading ? 'i-lucide-loader-circle' : 'i-lucide-search'"
            aria-hidden="true"
            :class="loading && 'animate-spin'"
            class="pointer-events-none absolute start-4 text-muted size-5"
          />
          <input
            class="flex-1 placeholder-muted bg-transparent border-0 text-default focus:ring-0 focus:outline-none sm:text-sm h-[--ui-header-height] sm:h-12 px-4 ps-11"
            placeholder="Search..."
            autocomplete="off"
            :value="query"
            @input="query = ($event.target as HTMLInputElement).value"
          >
          <UButton
            aria-label="Close"
            class="absolute end-4"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="onClose"
          />
        </div>
        <div class="flex flex-col min-h-[20rem] grow overflow-hidden">
          <div
            v-if="query === '' || !searchActive"
            class="flex-1 flex flex-col items-start justify-center pointer-events-none gap-4 px-10"
          >
            <span class="text-muted font-bold">
              Things you can search for:
            </span>
            <ul class="text-muted text-sm">
              <li>Validation codes</li>
            </ul>
          </div>
          <div
            v-else-if="!loading && !result.hits.length"
            class="flex-1 flex flex-col items-center justify-center pointer-events-none gap-4"
          >
            <UIcon
              name="i-lucide-search"
              aria-hidden="true"
              class="text-muted size-6"
            />
            <span class="text-muted">
              Not Found
            </span>
          </div>
          <div
            v-else
            class="flex-1 flex flex-col gap-2 overflow-y-auto max-h-full scroll-py-10 divide-default divide-y"
          >
            <div v-for="[key, group] in Object.entries(groupedSearchResult)" :key="key" class="p-2">
              <div class="text-xs font-semibold text-default uppercase my-2 px-2">{{ key }}</div>
              <div
                v-for="(hit, hitIndex) in group"
                :key="hit.objectID"
                class="cursor-pointer flex items-center gap-2 px-2 py-1.5 rounded-md text-sm"
                :class="flatHits.indexOf(hit) === activeIndex ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-muted/50'"
                @click="onSelect(hit)"
                @mouseenter="activeIndex = flatHits.indexOf(hit)"
              >
                <UIcon :name="entryTypeToIcon(hit.type)" class="size-4 shrink-0" aria-hidden="true" />
                <div class="flex items-center gap-1 min-w-0">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="truncate flex-none shrink" v-html="header(hit)" />
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div v-if="content(hit)" class="truncate shrink text-xs text-muted" v-html="content(hit)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pb-2 pt-1 px-8 text-right">
          <UIcon class="w-16 ml-2" name="logos:algolia" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<style>
@reference "~/assets/style.css";

mark {
  @apply bg-primary/40;
}
</style>
