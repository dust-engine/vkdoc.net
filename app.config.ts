export default defineAppConfig({
  ui: {
    icons: {
      dark: 'i-lucide-moon',
      light: 'i-lucide-sun',
    },
    page: {
      slots: {
        root: 'flex flex-col lg:grid lg:grid-cols-12 lg:gap-10',
        left: 'lg:col-span-3',
        center: 'lg:col-span-9',
        right: 'lg:col-span-2 order-first lg:order-last',
      },
      compoundVariants: [
        {
          left: true,
          right: true,
          class: {
            center: 'lg:col-span-7',
          },
        },
        {
          left: false,
          right: false,
          class: {
            center: 'lg:col-span-12',
          },
        },
      ],
    },
  },
})
