<template lang="pug">
AppLayout
  UContainer
    .flex.flex-col(class="lg:grid lg:grid-cols-12 lg:gap-10")
      aside(class="hidden lg:block lg:col-span-3")
        UPageAside
          DocNav
      .min-w-0(class="lg:col-span-9")
        slot
</template>
