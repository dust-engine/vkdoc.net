<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>

<template>
  <div :id="id" class="scroll-mt-[calc(48px+48px+var(--ui-header-height))] lg:scroll-mt-[calc(48px+var(--ui-header-height))]">
    <USeparator v-show="$route.hash.slice(1) === id" color="primary" :label="id.replaceAll('-', ' ').toUpperCase()" />
  </div>
</template>
