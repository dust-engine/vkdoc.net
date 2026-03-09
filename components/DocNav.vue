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
    to: `/chapters/${i.id}`,
  }))
  return [{
    title: 'Vulkan Specification',
    icon: '@dust:fa6-pro-light:books',
    children: items,
  }]
})
const appendix = computed(() => {
  if (!index.value) {
    return []
  }

  const items = index.value.filter((i: any) => i.appendix).map((i: any) => ({
    title: `${String.fromCharCode(65 + i.index)}. ${i.title}`,
    to: `/chapters/${i.id}`,
  }))
  return [{
    title: 'Appendix',
    icon: '@dust:fa6-pro-light:paperclip',
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
    const vendor = extension.extension.match(/^VK_([A-Z]+)_/)![1]
    const item = {
      title: extension.extension,
      to: `/extensions/${extension.extension}`,
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
    icon: '@dust:fa6-pro-light:puzzle-piece',
    children: [{
      title: 'Khronos (KHR)',
      children: khr,
    }, {
      title: 'Cross-Vendor (EXT)',
      children: ext,
    }, {
      title: 'Vendor Specific',
      children: Object.entries(vendors).map((a) => {
        const icon = {
          AMDX: 'bi:amd',
          AMD: 'bi:amd',
          MSFT: 'simple-icons:microsoft',
          GOOGLE: 'mdi:google',
          GGP: 'mdi:google',
          ARM: 'simple-icons:arm',
          INTEL: 'simple-icons:intel',
          HUAWEI: 'simple-icons:huawei',
          VALVE: 'simple-icons:valve',
          SEC: 'simple-icons:samsung',
          MVK: 'simple-icons:apple',
          NN: 'simple-icons:nintendo',
          QCOM: 'simple-icons:qualcomm',
          QNX: 'simple-icons:blackberry',
          NV: 'simple-icons:nvidia',
          NVX: 'simple-icons:nvidia',
          ANDROID: 'simple-icons:android',
          KHR: '@dust:fa6-pro-solid:star',
          EXT: '@dust:fa6-pro-solid:sparkles',
        }[a[0] as string] || '@dust:fa6-pro-solid:cube'
        return {
          title: a[0],
          icon,
          children: a[1],
        }
      }),
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
      :default-open="!($route.path.startsWith('/extensions') || $route.path === '/chapters/extensions')"
    />
    <UContentNavigation
      :navigation="appendix"
      type="single"
      :default-open="false"
    />
    <UContentNavigation
      :navigation="extensions"
      type="single"
      :default-open="$route.path.startsWith('/extensions') || $route.path === '/chapters/extensions'"
    />
  </nav>
</template>
