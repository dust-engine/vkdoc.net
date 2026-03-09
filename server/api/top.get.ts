interface Result {
  page: string,
  visitors: number,
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  if (!config.plausibleToken) {
    return [
      { page: '/man/VkResult', visitors: 342 },
      { page: '/man/vkCreateInstance', visitors: 287 },
      { page: '/man/VkStructureType', visitors: 256 },
      { page: '/man/vkCreateDevice', visitors: 231 },
      { page: '/man/VkFormat', visitors: 198 },
      { page: '/man/vkCmdDraw', visitors: 185 },
      { page: '/man/VkImageUsageFlagBits', visitors: 174 },
      { page: '/man/vkCreateGraphicsPipelines', visitors: 163 },
      { page: '/man/VkPipelineStageFlagBits2', visitors: 151 },
      { page: '/man/vkAllocateCommandBuffers', visitors: 142 },
      { page: '/man/VkPhysicalDeviceFeatures', visitors: 138 },
      { page: '/man/vkCreateRenderPass', visitors: 127 },
    ]
  }
  try {
    const { results } = await $fetch<{ results: Result[] }>('https://analytics.vkdoc.net/api/v1/stats/breakdown', {
      headers: {
        Authorization: `Bearer ${config.plausibleToken}`,
      },
      query: {
        site_id: 'vkdoc.net',
        period: '7d',
        property: 'event:page',
        limit: 100,
        filters: 'event:page==/man/*',
      },
    })
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')
    return results
  }
  catch {
    return []
  }
})
