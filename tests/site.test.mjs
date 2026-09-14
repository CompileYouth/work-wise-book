import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir, access } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { loadBook } from '../scripts/book.mjs'

const dist = resolve('site/.vitepress/dist')
const base = '/work-wise-book/'

test('构建产物包含全部阅读页面，项目路径下的内部链接和资源均有效', async () => {
  const book = await loadBook(resolve('.'))
  const pages = [book.preface, ...book.chapters]
  assert.equal((await readdir(dist)).filter(name => name.endsWith('.html')).length, pages.length + 1)
  for (const page of pages) {
    const html = await readFile(join(dist, page.route + '.html'), 'utf8')
    assert(html.includes(page.title), `${page.route} 缺少正文标题`)
    assert(!html.includes('/Users/'), `${page.route} 存在本地文件路径`)
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (!raw.startsWith('/')) continue
      assert(raw.startsWith(base), `未带项目路径的资源：${raw}`)
      const target = decodeURIComponent(raw.slice(base.length).split(/[?#]/)[0])
      await access(join(dist, target || 'index.html'))
    }
  }
})
