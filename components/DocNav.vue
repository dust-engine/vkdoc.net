<script setup lang="ts">
const { data: index } = await useFetch<{ title: string, index: string, id: string, appendix?: boolean }[]>(`https://data.vkdoc.net/chapters/index.json`)
const { data: extensionIndex } = await useFetch<{ extension: string, author: string, specialuse?: string }[]>(`https://data.vkdoc.net/extensions/index.json`)
if (!index.value || !extensionIndex.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const chapters = computed(() => {
  if (!index.value) {
    return []
  }
  const items = index.value.filter((i: any) => !i.appendix).map((i: any) => ({
    title: `${i.index}. ${i.title}`,
    path: `/chapters/${i.id}`,
  }))
  return [{
    title: 'Vulkan Specification',
    icon: 'i-lucide-book-open',
    children: items,
  }]
})
const appendix = computed(() => {
  if (!index.value) {
    return []
  }

  const items = index.value.filter((i: any) => i.appendix).map((i: any) => ({
    title: `${String.fromCharCode(65 + i.index)}. ${i.title}`,
    path: `/chapters/${i.id}`,
  }))
  return [{
    title: 'Appendix',
    icon: 'i-lucide-paperclip',
    children: items,
  }]
})
const extensions = computed(() => {
  if (!extensionIndex.value) {
    return []
  }
  const vendors: { [key: string]: any[] } = {}
  const specialuse: { [key: string]: any[] } = {}
  for (const extension of extensionIndex.value) {
    const vendor = extensionVendor(extension.extension)
    const item = {
      title: extension.extension,
      path: `/extensions/${extension.extension}`,
    }
    vendors[vendor] = vendors[vendor] || []
    vendors[vendor].push(item)

    if (extension.specialuse) {
      for (const useCase of extension.specialuse.split(',')) {
        specialuse[useCase] = specialuse[useCase] || []
        specialuse[useCase].push(item)
      }
    }
  }
  const khr = vendors.KHR
  const ext = vendors.EXT
  delete vendors.KHR
  delete vendors.EXT
  return [{
    title: 'Extensions',
    icon: 'i-lucide-puzzle',
    children: [{
      title: 'Khronos (KHR)',
      children: khr,
    }, {
      title: 'Cross-Vendor (EXT)',
      children: ext,
    }, {
      title: 'Vendor Specific',
      children: Object.entries(vendors).map(a => ({
        title: a[0],
        icon: vendorIcon(a[0]),
        children: a[1],
      })),
    }, {
      title: 'Special Use',
      children: Object.entries(specialuse).map((a) => {
        const label = {
          devtools: 'Dev Tools',
          glemulation: 'OpenGL Emulation',
          d3demulation: 'Direct3D Emulation',
          debugging: 'Debugging',
          cadsupport: 'CAD Support',
        }[a[0] as string] || a[0] as string
        return {
          title: label,
          children: a[1],
        }
      }),
    }],
  }]
})
</script>

<template>
  <nav class="space-y-3">
    <UContentNavigation
      :navigation="chapters"
      type="single"
      default-open
    />
    <UContentNavigation
      :navigation="appendix"
      type="single"
      default-open
    />
    <UContentNavigation
      :navigation="extensions"
      type="single"
      default-open
    />
  </nav>
</template>
