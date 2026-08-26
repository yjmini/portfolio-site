import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const resumeHtml = readFileSync(new URL('../public/resume/resume-public.html', import.meta.url), 'utf8')

test('public resume lists TOEIC Speaking IH', () => {
  assert.match(resumeHtml, /<span>TOEIC Speaking<\/span><small>IH<\/small>/u)
})

test('public resume uses the official academy name and common project award', () => {
  assert.match(resumeHtml, /삼성 청년 SW·AI 아카데미/u)
  assert.match(resumeHtml, /삼성 청년 SW·AI 아카데미 공통프로젝트 우수상\(1등\)/u)
  assert.doesNotMatch(resumeHtml, /Samsung Software AI Academy for Youth|삼성 청년 SW 아카데미/u)
})

test('public resume gives SQLD and ADsP separate certification rows', () => {
  assert.match(resumeHtml, /<span>SQLD<\/span><small>2023<\/small>/u)
  assert.match(resumeHtml, /<span>ADsP<\/span><small>2023<\/small>/u)
  assert.doesNotMatch(resumeHtml, /SQLD\s*\/\s*ADsP/u)
})
