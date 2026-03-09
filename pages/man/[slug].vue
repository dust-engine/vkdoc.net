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

const breadcrumbItems = computed(() => {
  if (!page.value) {
    return []
  }
  return [{
    label: 'Refpages',
  }, {
    label: page.value.parent,
  }, {
    label: page.value.title,
  }]
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
  UBreadcrumb(:items="breadcrumbItems" v-if="page.parent" separator-icon="i-lucide-chevron-right").py-4.border-b.border-default
  UPage
    UPageHeader(id="man-header" :headline="headline" :title="page.title" :description="page.description" :class="{ 'border-b-0': attributes.length > 0 }")
    div(class="relative flex border border-default rounded-md overflow-hidden not-prose" v-if="attributes.length > 0")
        div(v-for="attrib in attributes" :key="attrib.id" class="flex flex-col gap-0.5 justify-between py-1.5 font-medium bg-muted/50 border-r border-default")
          label(class="block text-xs px-2.5 font-medium text-muted -my-px") {{ attrib.title }}
          span(class="mx-2.5") {{ attrib.values }}
    UPageBody.docbody
      ContentRenderer(v-if="page.body" :value="page")
</template>
