<script setup lang="ts">
defineProps<{
  name?: string
}>()
</script>

<template>
  <div class="border border-default rounded-md p-4 my-4">
    <h3 v-if="name" class="mt-0">
      {{ name }}
    </h3>
    <MDCSlot :use="$slots.default" />
  </div>
</template>
