import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const resumeHtml = readFileSync(new URL('../public/resume/resume-public.html', import.meta.url), 'utf8')

test('public resume lists TOEIC Speaking IH', () => {
  assert.match(resumeHtml, /<span>TOEIC Speaking<\/span><small>IH<\/small>/u)
})

test('public resume gives SQLD and ADsP separate certification rows', () => {
  assert.match(resumeHtml, /<span>SQLD<\/span><small>2023<\/small>/u)
  assert.match(resumeHtml, /<span>ADsP<\/span><small>2023<\/small>/u)
  assert.doesNotMatch(resumeHtml, /SQLD\s*\/\s*ADsP/u)
})
