import test from 'node:test'
import assert from 'node:assert/strict'

import { hideCursor, positionCursor } from '../src/cursor.js'

function cursorElement() {
  const classes = new Set()
  return {
    style: {},
    classList: {
      add: value => classes.add(value),
      remove: value => classes.delete(value),
      contains: value => classes.has(value),
    },
  }
}

test('positionCursor places the dot and ring at the exact pointer coordinates', () => {
  const dot = cursorElement()
  const ring = cursorElement()

  positionCursor(dot, ring, 320, 180)

  assert.equal(dot.style.transform, 'translate3d(320px,180px,0)')
  assert.equal(ring.style.transform, 'translate3d(320px,180px,0)')
  assert.equal(dot.classList.contains('is-visible'), true)
  assert.equal(ring.classList.contains('is-visible'), true)
})

test('hideCursor hides both cursor elements', () => {
  const dot = cursorElement()
  const ring = cursorElement()
  positionCursor(dot, ring, 10, 20)

  hideCursor(dot, ring)

  assert.equal(dot.classList.contains('is-visible'), false)
  assert.equal(ring.classList.contains('is-visible'), false)
})
