<template>
  <UApp>
    <NuxtLayout>
      <UError :error="error" />
    </NuxtLayout>
    <ClientOnly>
      <LazyDocSearch />
    </ClientOnly>
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()
</script>
