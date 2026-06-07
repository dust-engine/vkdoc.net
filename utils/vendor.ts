export const vendorIcons: Record<string, string> = {
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
  KHR: 'i-lucide-star',
  EXT: 'i-lucide-sparkles',
}

export function extensionVendor(extension: string): string {
  return extension.match(/^VK_([A-Z]+)_/)?.[1] ?? ''
}

export function vendorIcon(vendor: string): string {
  return vendorIcons[vendor] || 'i-lucide-box'
}
