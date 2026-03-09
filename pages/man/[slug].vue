<script setup lang="ts">
const route = useRoute()
const { data: page } = await useFetch<any>(`https://data.vkdoc.net/man/${route.params.slug}.json`)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}
if (page.value.redirect) {
  await navigateTo('/man/' + page.value.redirect)
}

const headline = computed(() => {
  const ty: string = page.value?.type
  if (ty) {
    const name = {
      handles: 'Handle',
      protos: 'Function Prototype',
      structs: 'Structures',
      enums: 'Enum',
      flags: 'Flags',
      defines: 'Macro',
      feature: 'Feature',
      funcpointers: 'Function Pointer',
      builtins: 'SPIR-V Built-In',
      basetypes: 'Basetype',
      freeform: 'Manual',
      spirv: 'SPIR-V',
    }[ty]
    if (name) {
      return name
    }
  }
  return ty || 'Manual'
})

interface Attribute {
  id: string
  title: string
  link: string
  values: string
}

const attributes = computed<Attribute[]>(() => {
  const v: Attribute[] = []
  if (!page.value) {
    return v
  }
  for (const [key, val, link] of [
    ['cmd_buf_level', 'Command Buffer Level', '/man/VkCommandBufferLevel'],
    ['render_pass_scope', 'Render Pass Scope', '/man/vkCmdBeginRenderPass'],
    ['video_coding_scope', 'Video Coding Scope', '/man/vkCmdBeginVideoCodingKHR'],
    ['supported_queue_types', 'Queue Types', '/man/VkQueueFlagBits'],
  ]) {
    if (page.value[key]) {
      let values = page.value[key]
      if (Array.isArray(values)) {
        values = values.join(' / ')
      }
      v.push({
        id: key,
        title: val,
        link,
        values,
      })
    }
  }
  return v
})

const parentLink = computed(() => {
  const p = page.value?.parent
  if (!p) return null
  if (p.includes('VERSION')) return `/man/${p}`
  return `/extensions/${p}`
})

const tasks = computed<string[]>(() => {
  if (!page.value?.tasks) return []
  return Array.isArray(page.value.tasks) ? page.value.tasks : [page.value.tasks]
})

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogSiteName: 'VulkanHub',
  ogDescription: page.value.description,
  ogType: 'article',
})

const result = page && {
  '@context': 'http://schema.org/',
  '@type': 'SoftwareSourceCode',
  'name': page.value.title,
  'codeSampleType': 'definition',
  'programmingLanguage': 'C',
  'abstract': page.value.description,
  'copyrightHolder': {
    '@type': 'Organization',
    'name': 'Khronos Group',
    'url': 'https://www.khronos.org/',
  },
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: result ? JSON.stringify(result) : '',
    },
  ],
})
</script>

<template lang="pug">
UContainer
  UPageHeader(id="man-header" :headline="headline" :title="page.title" :description="page.description")
  .flex.flex-col(class="lg:grid lg:grid-cols-10 lg:gap-8")
    UPageBody.docbody.min-w-0(class="lg:col-span-8")
      ContentRenderer(v-if="page.body" :value="page")
    .hidden(class="lg:block lg:col-span-2")
      .sticky.top-20.space-y-4.text-sm.mt-8.min-w-0
        div(v-if="page.parent")
          .font-medium.text-muted.mb-1 Parent
          NuxtLink.text-primary(:to="parentLink" class="hover:underline") {{ page.parent }}
        div
          .font-medium.text-muted Type
          .text-default {{ headline }}
        div(v-for="attrib in attributes" :key="attrib.id")
          NuxtLink.font-medium.text-muted(:to="attrib.link" class="hover:underline") {{ attrib.title }}
          .flex.flex-wrap.gap-1.mt-1
            UBadge(color="neutral" variant="subtle") {{ attrib.values }}
        div(v-if="tasks.length")
          NuxtLink.font-medium.text-muted.mb-1(to="/chapters/fundamentals#fundamentals-queueoperation-command-types" class="hover:underline") Command Type
          .flex.flex-wrap.gap-1.mt-1
            UBadge(v-for="t in tasks" :key="t" color="neutral" variant="subtle") {{ t }}
        div(v-if="page.structextends?.length")
          .font-medium.text-muted.mb-1 Extends
          NuxtLink.font-mono.block.truncate(v-for="s in page.structextends" :key="s" :to="`/man/${s}`" class="hover:underline" :title="s") {{ s }}
        div(v-if="page.extendedby?.length")
          .font-medium.text-muted.mb-1 Extended By
          NuxtLink.font-mono.block.truncate(v-for="s in page.extendedby" :key="s" :to="`/man/${s}`" class="hover:underline" :title="s") {{ s }}
</template>
