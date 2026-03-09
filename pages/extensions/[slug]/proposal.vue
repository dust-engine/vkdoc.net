<script setup lang="ts">
definePageMeta({ layout: 'docs' })

const route = useRoute()
const { data: page } = await useFetch<any>(`https://data.vkdoc.net/extensions/${route.params.slug}.proposal.json`)
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
.flex.flex-col(class="lg:grid lg:grid-cols-10 lg:gap-8")
  UPageBody.docbody.min-w-0(class="lg:col-span-8")
    ProseH1 {{ page.title }}
    ContentRenderer(v-if="page?.body" :value="page")
  .hidden(v-if="page?.body?.toc?.links?.length" class="lg:block lg:col-span-2")
    UContentToc(:links="page.body.toc.links")
</template>
