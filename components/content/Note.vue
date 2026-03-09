<script setup lang="ts">
</script>

<template>
  <div class="note pl-4 pr-6 py-4 rounded-md border border-default bg-muted/50 text-muted text-sm/6 my-5 font-normal">
    <UIcon class="note-icon w-4 h-4 mr-2 mt-1 text-primary" name="@dust:fa6-pro-solid:info" />
    <div class="note-content">
      <MDCSlot :use="$slots.default" />
    </div>
  </div>
</template>

<style>
.note {
  display: flex;
}
.note-icon {
  flex-shrink: 0;
}
.note-content {
  :first-child {
    margin-top: 0;
  }
  :last-child {
    margin-bottom: 0;
  }
}
</style>
