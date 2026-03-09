<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}
</script>

<template>
  <UContainer>
    <UPage>
      <UPageBody class="docbody">
        <ContentRenderer v-if="page?.body" :value="page" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
