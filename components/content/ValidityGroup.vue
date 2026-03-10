<script setup lang="ts">
defineProps<{
  name?: string
}>()
</script>

<template>
  <div class="border border-default rounded-md my-4">
    <div v-if="name" class="p-4 border-b border-default">
      <h2 class="font-bold">{{ name }}</h2>
    </div>
    <div class="divide-y divide-default px-4">
      <MDCSlot :use="$slots.default" />
    </div>
  </div>
</template>
