export function positionCursor(dot, ring, x, y) {
  if (!dot || !ring) return
  const transform = `translate3d(${x}px,${y}px,0)`
  dot.style.transform = transform
  ring.style.transform = transform
  dot.classList.add('is-visible')
  ring.classList.add('is-visible')
}

export function hideCursor(dot, ring) {
  dot?.classList.remove('is-visible')
  ring?.classList.remove('is-visible', 'hover')
}
