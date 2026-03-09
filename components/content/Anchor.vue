<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>

<template>
  <div :id="id" class="scroll-mt-[calc(48px+48px+var(--ui-header-height))] lg:scroll-mt-[calc(48px+var(--ui-header-height))]">
    <USeparator v-if="$route.hash.slice(1) === id" type="dashed" color="primary">
      <span class="anchor-line border-primary border-b border-dashed" />
      <span class="anchor-hint">
        <UIcon name="i-lucide-arrow-down" />
        {{ id.replaceAll('-', ' ').toUpperCase() }}
        <UIcon name="i-lucide-arrow-down" />
      </span>
      <span class="anchor-line border-primary border-b border-dashed" />
    </USeparator>
  </div>
</template>
