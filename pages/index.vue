<script setup>
useSeoMeta({
  title: 'HomePage',
  description: 'Better Vulkan Documentation starts here',
  ogTitle: 'VulkanHub',
  ogSiteName: 'VulkanHub',
  ogDescription: 'Better Vulkan Documentation starts here',
})

const { data: version } = useFetch('https://data.vkdoc.net/index.json')
</script>

<template>
  <UPageHero
    title="VulkanHub"
    description="Better Vulkan Documentation Starts Here"
    :links="[{ label: 'Start Reading', icon: '@dust:fa6-pro-regular:book', size: 'lg', to: '/chapters/introduction' }]"
  >
    <template #headline>
      <UBadge color="neutral" class="mx-2">Version {{ version?.version }}</UBadge>
      <UBadge color="neutral" class="mx-2">Updated on {{ version ? (new Date(version.last_changed * 1000)).toLocaleDateString() : '' }}</UBadge>
    </template>
  </UPageHero>
  <UPageSection title="Our Features">
    <UPageGrid>
      <UPageCard class="col-span-6 row-span-2" icon="@dust:fa6-pro-regular:magnifying-glass" title="Efficient Search" description="Efficiently search the Vulkan Specification with function names, extensions, validation codes, and more" />
      <UPageCard class="col-span-6 row-span-4" icon="@dust:fa6-pro-regular:circle-up" title="Latest Updates" description="Stay up to date with the latest Vulkan Extensions" />
      <UPageCard class="col-span-6 row-span-4" icon="i-lucide-sun-moon" title="Light/Dark Mode" description="Toggle between light and dark mode for the best reading experience" />
      <UPageCard class="col-span-6 row-span-2" icon="@dust:fa6-pro-regular:globe" title="Web-first Documentation" description="Customized conversion from AsciiDoc ensures the best reading experience on the web" />
    </UPageGrid>
  </UPageSection>
</template>

<style>
.docbody {
  overflow-x: hidden;
  overflow-wrap: anywhere;
}
.docbody .refpage-header-container {
  margin-left: 1px;
  margin-right: 1px;
}
</style>
