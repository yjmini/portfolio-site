export const portfolioUrl = 'https://yjmini.github.io/portfolio-site/'
export const attributionLine = `출처: 윤정민 포트폴리오 — ${portfolioUrl}`

export function appendSourceAttribution(text) {
  const value = String(text ?? '').trimEnd()
  if (!value || value.includes(attributionLine)) return value
  return `${value}\n\n${attributionLine}`
}

export function installCopyAttribution(doc = globalThis.document) {
  if (!doc?.addEventListener) return () => {}

  const onCopy = (event) => {
    const target = event.target
    if (target?.closest?.('input, textarea, [contenteditable="true"], code, pre')) return

    const selectedText = doc.getSelection?.()?.toString()
    if (!selectedText?.trim() || !event.clipboardData) return

    event.preventDefault()
    event.clipboardData.setData('text/plain', appendSourceAttribution(selectedText))
  }

  doc.addEventListener('copy', onCopy)
  return () => doc.removeEventListener('copy', onCopy)
}
