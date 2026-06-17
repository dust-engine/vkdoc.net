<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

interface ExtensionEntry {
  extension: string
  author: string
  type?: 'device' | 'instance'
  number: number
  date_added: string
  ratified?: boolean
  provisional?: boolean
  promotedto?: string
  deprecatedby?: string
  obsoletedby?: string
  proposal?: boolean
}

useSeoMeta({
  title: 'Extensions',
  description: 'Browse all Vulkan extensions.',
  ogTitle: 'Vulkan Extensions',
  ogSiteName: 'VulkanHub',
  ogDescription: 'Browse all Vulkan extensions.',
})

const { data: extensions } = await useFetch<ExtensionEntry[]>(
  'https://data.vkdoc.net/extensions/index.json',
  { default: () => [] },
)

const globalFilter = ref('')
const sorting = ref([{ id: 'date_added', desc: true }])

const columns: TableColumn<ExtensionEntry>[] = [
  { accessorKey: 'extension', header: 'Extension' },
  { accessorKey: 'author', header: 'Author' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'number', header: 'Number' },
  { id: 'status', header: 'Status', enableSorting: false },
  { accessorKey: 'date_added', header: 'Date Added' },
]

function toggleSort(column: any) {
  column.toggleSorting(column.getIsSorted() === 'asc')
}

function sortIcon(column: any) {
  const dir = column.getIsSorted()
  if (dir === 'asc') {
    return 'i-lucide-arrow-up'
  }
  if (dir === 'desc') {
    return 'i-lucide-arrow-down'
  }
  return 'i-lucide-arrow-up-down'
}

function statusBadges(e: ExtensionEntry) {
  const badges: { label: string, color: string }[] = []
  if (e.provisional) {
    badges.push({ label: 'Provisional', color: 'error' })
  }
  if (e.promotedto) {
    badges.push({ label: 'Promoted', color: 'info' })
  }
  if (e.deprecatedby) {
    badges.push({ label: 'Deprecated', color: 'neutral' })
  }
  if (e.obsoletedby) {
    badges.push({ label: 'Obsoleted', color: 'secondary' })
  }
  return badges
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function onSelect(_e: Event, row: any) {
  return navigateTo(`/extensions/${row.original.extension}`)
}
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-highlighted sm:text-3xl">
        Extensions
      </h1>
      <p class="mt-2 text-muted">
        All {{ extensions.length }} Vulkan extensions
      </p>
    </div>

    <UInput
      v-model="globalFilter"
      icon="i-lucide-search"
      placeholder="Search extensions..."
      class="mb-4 w-full sm:max-w-sm"
    />

    <UTable
      v-model:sorting="sorting"
      v-model:global-filter="globalFilter"
      :data="extensions"
      :columns="columns"
      :meta="{ class: { tr: 'cursor-pointer' } }"
      class="border border-default rounded-lg"
      @select="onSelect"
    >
      <template #extension-header="{ column }">
        <UButton color="neutral" variant="ghost" label="Extension" :trailing-icon="sortIcon(column)" class="-mx-2.5" @click="toggleSort(column)" />
      </template>
      <template #author-header="{ column }">
        <UButton color="neutral" variant="ghost" label="Author" :trailing-icon="sortIcon(column)" class="-mx-2.5" @click="toggleSort(column)" />
      </template>
      <template #number-header="{ column }">
        <UButton color="neutral" variant="ghost" label="Number" :trailing-icon="sortIcon(column)" class="-mx-2.5" @click="toggleSort(column)" />
      </template>
      <template #date_added-header="{ column }">
        <UButton color="neutral" variant="ghost" label="Date Added" :trailing-icon="sortIcon(column)" class="-mx-2.5" @click="toggleSort(column)" />
      </template>

      <template #extension-cell="{ row }">
        <NuxtLink :to="`/extensions/${row.original.extension}`" class="flex items-center gap-2 font-mono text-sm hover:text-primary">
          <UIcon :name="vendorIcon(extensionVendor(row.original.extension))" class="text-primary size-4 shrink-0" />
          {{ row.original.extension }}
        </NuxtLink>
      </template>
      <template #type-cell="{ row }">
        {{ row.original.type === 'instance' ? 'Instance' : 'Device' }}
      </template>
      <template #status-cell="{ row }">
        <div class="flex flex-wrap gap-1">
          <UBadge v-for="badge in statusBadges(row.original)" :key="badge.label" :color="badge.color" variant="subtle" size="sm">
            {{ badge.label }}
          </UBadge>
        </div>
      </template>
      <template #date_added-cell="{ row }">
        <span class="whitespace-nowrap text-muted">{{ formatDate(row.original.date_added) }}</span>
      </template>
    </UTable>
  </UContainer>
</template>
