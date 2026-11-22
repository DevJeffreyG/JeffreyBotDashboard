export const parseMarkdown = (str: string) => {
  if (!str) return ''

  let parsedStr = str
    .replace(/(?<!\\)\*\*(?:(?!\s))((?:(?!\*\*|\n).)+)\*\*/g, '<b>$1</b>')
    .replace(/(?<!\\)\*(?:(?!\s))((?:(?!\n|\*).)+)\*/g, '<i>$1</i>')
    .replace(/(?<!\\)~(?:(?!\s))((?:(?!\n|~).)+)~/g, '<s>$1</s>')
    .replace(/(?<!\\)__(?:(?!\s))((?:(?!\n|__).)+)__/g, '<u>$1</u>')
    .replace(/(?<!\\)_(?:(?!\s))((?:(?!\n|_).)+)_/g, '<u>$1</u>')
    .replace(/(?<!\\)##(?:(?!\s))((?:(?!\n|##).)+)##/g, '<h2 class="text-2xl md:text-4xl font-bold mt-5 mb-5">$1</h2>')
    .replace(/\[w\]([\s\S]*?)\[\/w\]/g, '<span class="whispering">$1</span>')
    .replace(/\\n/g, '<br/>')
    .replace(/\\(?=\*\*|\*|~|__|_|##)/g, '')

  // Renderizado de enlaces [texto](url) y [texto](!url)
  const elements = parsedStr.match(/\[.*?\)/g)
  if (elements) {
    for (const el of elements) {
      const txtMatch = el.match(/\[(.*?)\]/)
      const urlMatch = el.match(/\((.*?)\)/)

      if (txtMatch && urlMatch) {
        const txt = txtMatch[1]
        let url = urlMatch[1]

        const isHiddenLink = url.startsWith('!')
        const blank = url.endsWith('!') || url.startsWith('http')

        if (isHiddenLink) {
          url = url.slice(1)
        }

        if (blank) {
          url = url.replace(/!$/, '')
        }

        const linkClass = isHiddenLink ? '' : 'class="show-link" '

        parsedStr = parsedStr.replace(
          el,
          `<a ${linkClass}href="${url}" ${blank ? 'target="_blank" rel="noopener noreferrer"' : ''}>${txt}</a>`
        )
      }
    }
  }

  return parsedStr
}