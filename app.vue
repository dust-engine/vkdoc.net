<script setup lang="ts">
useHead({
  titleTemplate: '%s - VulkanHub',
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <DocSearch />
    </ClientOnly>
  </UApp>
</template>
