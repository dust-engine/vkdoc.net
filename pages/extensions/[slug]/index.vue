<script setup lang="ts">
definePageMeta({ layout: 'docs' })

const route = useRoute()
const { data: page } = await useFetch<any>(`https://data.vkdoc.net/extensions/${route.params.slug}.json`)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  ogSiteName: 'VulkanHub',
  ogType: 'article',
})

const contacts = computed(() => {
  const contacts = page.value?.contact?.split(',') || []
  return contacts.map((contact: string) => {
    const contactWords = contact.trim().split(' ')
    const name = contactWords.slice(0, -1).join(' ')
    let handle = contactWords[contactWords.length - 1]
    let icon = 'i-lucide-user'
    let link = null
    if (handle.startsWith('gitlab:@')) {
      icon = 'i-simple-icons-gitlab'
      handle = handle.replace('gitlab:', '')
    } else if (handle.startsWith('@')) {
      icon = 'i-simple-icons-github'
      const issuePlaceholderText = `[${page.value?.extension}] ${handle} %0A*Here describe the issue or question you have about the ${page.value?.extension} extension*`
      link = `https://github.com/KhronosGroup/Vulkan-Docs/issues/new?body=${issuePlaceholderText}`
    }
    return {
      icon,
      name,
      link,
      handle,
    }
  })
})

function promotionStatusToURL(promotion: string) {
  if (promotion.startsWith('VK_VERSION')) {
    return '/man/' + promotion
  }
  return '/extensions/' + promotion
}
</script>

<template lang="pug">
.flex.flex-col(class="lg:grid lg:grid-cols-10 lg:gap-8")
  UPageBody.docbody.min-w-0(class="lg:col-span-8")
    ContentRenderer(v-if="page?.body" :value="page")
  .hidden(class="lg:block lg:col-span-2")
    UContentToc(v-if="page" :links="page.body.toc.links")
      template(#bottom)
        .space-y-3.text-sm.mt-4
          div
            .font-medium.text-muted Type
            .text-default {{page.type === 'device' ? 'Device Extension' : 'Instance Extension'}}
          div
            .font-medium.text-muted Registered Extension Number
            .text-default {{ page.number }}
          div(v-if="page.promotedto")
            .font-medium.text-muted Promoted To
            NuxtLink.underline(:to="promotionStatusToURL(page.promotedto)") {{ page.promotedto }}
          div(v-if="page.deprecatedby")
            .font-medium.text-muted Deprecated By
            NuxtLink.underline(:to="promotionStatusToURL(page.deprecatedby)") {{ page.deprecatedby }}
          div(v-if="page.obsoletedby")
            .font-medium.text-muted Obsoleted By
            NuxtLink.underline(:to="promotionStatusToURL(page.obsoletedby)") {{ page.obsoletedby }}
          div
            .font-medium.text-muted.mb-1 Status
            .flex.flex-wrap.gap-1
              NuxtLink(:to="'/chapters/introduction#introduction-ratified'")
                UBadge(:color="page.ratified ? 'success' : 'warning'") {{ page.ratified ? 'Ratified' : 'Not Ratified' }}
              NuxtLink(to="/chapters/boilerplate#boilerplate-provisional-header" v-if="page.provisional")
                UBadge(color="error") Provisional
              NuxtLink(to="/chapters/extendingvulkan#extendingvulkan-compatibility-promotion" v-if="page.promotedto")
                UBadge(color="info") Promoted
              NuxtLink(to="/chapters/extendingvulkan#extendingvulkan-compatibility-deprecation" v-if="page.deprecatedby")
                UBadge(color="secondary") Deprecated
              NuxtLink(to="/chapters/extendingvulkan#extendingvulkan-compatibility-obsoletion" v-if="page.obsoletedby")
                UBadge(color="secondary") Obsoleted
              NuxtLink(:to="`/extensions/${page.extension}/proposal`" v-if="page.proposal")
                UBadge(color="info") Proposal Available
          div
            .font-medium.text-muted Contacts
            ul
              li.flex.items-center(v-for="contact in contacts" :key="contact.handle")
                UIcon.mr-2(:name="contact.icon" v-if="contact.icon")
                a(:href="contact.link" target="_blank" v-if="contact.link") {{ contact.name }}
                template(v-else) {{ contact.name }} ({{ contact.handle }})
</template>
