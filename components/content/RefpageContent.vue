<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
const emit = defineEmits(['pending'])

const { data: page, pending } = await useFetch<any>(`https://data.vkdoc.net/man/${props.name}.json`, {
  lazy: true,
})
watch([
  page,
  pending,
], ([currentPage, isPending]) => {
  if (!currentPage || !currentPage.body) {
    emit('pending', true)
  }
  emit('pending', isPending)
})

interface Attribute {
  id: string
  title: string
  values: string
}

const attributes: Attribute[] = computed(() => {
  const v: Attribute[] = []
  if (!page.value) {
    return v
  }
  for (const [key, val] of [
    ['cmd_buf_level', 'Command Buffer Level'],
    ['render_pass_scope', 'Render Pass Scope'],
    ['video_coding_scope', 'Video Coding Scope'],
    ['supported_queue_types', 'Queue Types'],
    ['tasks', 'Tasks'],
  ]) {
    if (page.value[key]) {
      let values = page.value[key]
      if (Array.isArray(values)) {
        values = values.join(' / ')
      }
      v.push({
        id: key,
        title: val,
        values,
      })
    }
  }
  return v
})
</script>

<template lang="pug">
.relative.flex.overflow-hidden(class="md:flex-row flex-col not-prose border-y border-default bg-muted/50 divide-y md:divide-x md:divide-y-0 divide-default" v-if="attributes.length > 0")
  .flex.flex-col.justify-between(v-for="attrib in attributes" :key="attrib.id" class="gap-0.5 py-1.5")
    label(class="block text-xs px-2.5 font-medium text-muted -my-px") {{ attrib.title }}
    span(class="mx-2.5") {{ attrib.values }}
.px-4
  ContentRenderer(v-if="page && page.body" :value="page")
</template>
