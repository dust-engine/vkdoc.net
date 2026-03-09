<template lang="pug">
UHeader
  template(#title)
    | VulkanHub
  template(#right)
    UButton(label="Search" icon="i-lucide-search" color="neutral" variant="ghost" @click="searchOpen = true")
    UColorModeButton
    UButton(to="https://github.com/Neo-Zhixing/vkdoc.net" target="_blank" icon="i-simple-icons-github" color="neutral" variant="ghost")
  template(#body)
    LazyDocNav
UMain
  slot
UFooter
  template(#left)
    .text-xs.text-muted
      | A redistribution of #[a(href="") Vulkan Specification] under #[a(href="https://creativecommons.org/licenses/by/4.0/") CC-BY-4.0] by #[a(href="https://github.com/Neo-Zhixing/") Neo].
      br
      | &copy; The Khronos&reg; Group Inc. {{ new Date().getFullYear() }}. All rights reserved.
      br
      NuxtLink(to="/copyright") Copyright Notice
</template>

<script setup lang="ts">
const searchOpen = useState('searchOpen', () => false)
</script>
