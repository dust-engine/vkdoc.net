<script setup lang="ts">
const props = defineProps<{
  name: string
  type: string
}>()

const normalizedName = computed(() => {
  return props.name.replaceAll('\\_', '_')
})

const state: Ref<'close' | 'ready' | 'pending' | 'initial'> = ref('close')

function onPendingStateChange(isPending: boolean) {
  state.value = isPending ? 'pending' : 'ready'
}

function onClick() {
  if (state.value === 'close') {
    state.value = 'initial'
    setTimeout(() => {
      if (state.value === 'initial') {
        state.value = 'pending'
      }
    }, 400)
  }
  else {
    state.value = 'close'
  }
}

const iconName = computed(() => {
  return {
    ready: 'i-lucide-chevron-down',
    initial: 'i-lucide-chevron-up',
    close: 'i-lucide-chevron-up',
    pending: 'i-lucide-loader-circle',
  }[state.value]
})
</script>

<template>
  <div class="ring-1 shadow overflow-hidden ring-default rounded-lg my-4 refpage-header-container">
    <div class="bg-muted/50 p-4 refpage-header not-prose" @click="onClick">
      <div class="text-sm refpage-header-title flex-col sm:flex-row">
        <b class="mr-4 text-base refpage-main-header">{{ normalizedName }}</b>
        <MDCSlot :use="$slots.default" unwrap="p" />
      </div>
      <UButton class="sm:hidden" target="_blank" color="neutral" variant="solid" :to="`/man/${normalizedName}`" icon="i-lucide-external-link" />
      <UButton class="hidden sm:inline-flex" target="_blank" color="neutral" variant="link" :to="`/man/${normalizedName}`" label="Open" icon="i-lucide-external-link" />
      <UIcon class="text-2xl shrink-0 !hidden sm:!block" :class="state === 'pending' && 'animate-spin'" :name="iconName" />
    </div>
    <RefpageContent v-if="state !== 'close'" :name="normalizedName" @pending="onPendingStateChange" />
    <USeparator v-if="state === 'ready'" />
    <div v-if="state === 'ready'" class="p-4 flex justify-end not-prose">
      <UButton target="_blank" :to="`/man/${normalizedName}`" label="Open in New Page" icon="i-lucide-external-link" color="primary" variant="link" />
      <UButton class="ml-2" label="Close" icon="i-lucide-chevron-up" color="neutral" @click="state = 'close'" />
    </div>
  </div>
</template>

<style>
.refpage-header {
  display: flex;
  flex-wrap: nowrap;
  cursor: pointer;
  align-items: center;
  user-select: none;
}
.refpage-header-title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  flex-grow: 1;
  overflow: hidden;
}
b.refpage-main-header {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
