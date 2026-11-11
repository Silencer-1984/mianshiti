/**
 * 统一题库排版：在每道「题目行」后面补一个空行，让题目和答案分成两个段落。
 *
 * 题目行格式：**1. 题干（公司）**
 * 原始文件里答案紧贴下一行，Markdown 会当成同一段落的软换行，
 * 渲染结果是「<p><strong>题目</strong> 答案…</p>」，视觉上黏在一起。
 *
 * 幂等：已有空行则跳过，可重复执行。
 * 用法：node scripts/normalize-qa.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SKIP = new Set(['README.md', 'index.md'])
const QUESTION = /^\*\*\d+[.、]/

const files = readdirSync(root).filter(
  (f) => f.endsWith('.md') && !SKIP.has(f)
)

let total = 0
for (const name of files) {
  const path = resolve(root, name)
  const src = readFileSync(path, 'utf8')
  const eol = src.includes('\r\n') ? '\r\n' : '\n'
  const lines = src.split(/\r?\n/)
  const out = []
  let fixed = 0

  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i])
    const isQuestion = QUESTION.test(lines[i])
    const nextLineNeedsBreak =
      i + 1 < lines.length && lines[i + 1].trim() !== ''
    if (isQuestion && nextLineNeedsBreak) {
      out.push('')
      fixed++
    }
  }

  if (fixed > 0) writeFileSync(path, out.join(eol), 'utf8')
  console.log(`${name}: 插入 ${fixed} 个空行`)
  total += fixed
}
console.log(`共处理 ${total} 道题目`)
