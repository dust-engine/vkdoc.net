<script setup lang="ts">
const route = useRoute()
const { data: page } = await useFetch<any>(`https://data.vkdoc.net/chapters/${route.params.id}.json`)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  ogSiteName: 'VulkanHub',
  ogType: 'article',
})
</script>

<template lang="pug">
UContainer
  UPage
    template(#left)
      UPageAside
        DocNav
    UPageBody.docbody
      ContentRenderer(v-if="page.body" :value="page")
    template(v-if="page.body?.toc?.links?.length" #right)
      UContentToc(:links="page.body.toc.links")
</template>
