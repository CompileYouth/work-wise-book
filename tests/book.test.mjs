import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { loadBook, writeBook } from '../scripts/book.mjs'

const root = resolve('.')

test('每章仅出现一次，按书稿目录分为五篇，标题取正文', async () => {
  const book = await loadBook(root)
  const source = await readdir(join(root, '书稿/正文'))
  const chapters = source.filter(name => /^第\d+章.*\.md$/.test(name))
  assert.equal(book.chapters.length, chapters.length)
  assert.equal(book.chapters.length, 21)
  assert.equal(book.parts.length, 5)
  assert.deepEqual(book.chapters.map(c => c.number), Array.from({ length: 21 }, (_, i) => i + 1))
  assert.deepEqual(book.parts.flatMap(p => p.items.map(c => c.number)), book.chapters.map(c => c.number))
  for (const chapter of book.chapters) {
    const original = await readFile(join(root, '书稿/正文', chapter.filename), 'utf8')
    assert.equal(chapter.title, original.match(/^# (.+)$/m)[1])
  }
})

test('生成页面逐字保留正文，只发布序言与章节，更新时清理旧页面', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'workwise-book-'))
  try {
    const book = await loadBook(root)
    await writeBook(book, dir)
    const pages = [book.preface, ...book.chapters]
    assert.equal((await readdir(dir)).length, pages.length)
    for (const page of pages) {
      const published = await readFile(join(dir, page.route + '.md'), 'utf8')
      const original = await readFile(join(root, '书稿/正文', page.filename), 'utf8')
      assert.equal(published.replace(/^---\n[\s\S]*?\n---\n\n/, ''), original)
      assert(!published.includes('/Users/'))
    }
    const { writeFile } = await import('node:fs/promises')
    await writeFile(join(dir, 'old-chapter.md'), '旧页面')
    await writeBook(book, dir)
    assert(!(await readdir(dir)).includes('old-chapter.md'))
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
