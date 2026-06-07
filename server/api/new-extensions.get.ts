interface IndexEntry {
  extension: string,
  author: string,
  date_added?: string,
}

interface ContentNode {
  type: string,
  tag?: string,
  value?: string,
  children?: ContentNode[],
}

function nodeText(node: ContentNode): string {
  if (node.type === 'text') return node.value ?? ''
  return (node.children ?? []).map(nodeText).join('')
}

function firstSentences(text: string, count = 2): string {
  const sentences = text.match(/[^.!?]*[.!?]+(?=\s|$)/g)
  if (!sentences) return text
  return sentences.slice(0, count).join('').trim()
}

// Pull the first paragraph of the extension's "Description" section.
function extractDescription(body: ContentNode): string {
  let inDescription = false
  for (const node of body.children ?? []) {
    if (node.tag === 'h1' || node.tag === 'h2') {
      inDescription = nodeText(node).trim().toLowerCase() === 'description'
      continue
    }
    if (inDescription && node.tag === 'p') {
      const text = nodeText(node).replace(/\s+/g, ' ').trim()
      if (text) return firstSentences(text)
    }
  }
  return ''
}

export default defineEventHandler(async (event) => {
  try {
    const index = await $fetch<IndexEntry[]>('https://data.vkdoc.net/extensions/index.json')
    const newest = index
      .filter(e => e.date_added)
      .sort((a, b) => b.date_added!.localeCompare(a.date_added!))
      .slice(0, 12)
    const results = await Promise.all(newest.map(async (e) => {
      let description = ''
      try {
        const detail = await $fetch<{ body: ContentNode }>(`https://data.vkdoc.net/extensions/${e.extension}.json`)
        description = extractDescription(detail.body)
      }
      catch {
        // Leave the description empty if the detail page cannot be fetched.
      }
      return {
        extension: e.extension,
        author: e.author,
        date_added: e.date_added!,
        description,
      }
    }))
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')
    return results
  }
  catch {
    return []
  }
})
