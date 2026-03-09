<template lang="pug">
UHeader
  template(#title)
    | VulkanHub
  template(#right)
    UButton(icon="i-lucide-search" color="neutral" variant="ghost" @click="searchOpen = true")
      template(#trailing)
        .hidden(class="sm:inline-flex items-center gap-0.5")
          span Search
          UKbd(value="meta" size="sm")
          UKbd(value="K" size="sm")
    UColorModeButton
    UButton(to="https://github.com/dust-engine/vkdoc.net" target="_blank" icon="i-simple-icons-github" color="neutral" variant="ghost")
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
