import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// The manuscript is the only content source; editorial notes never enter the site.
export async function loadBook(root) {
  const folder = join(root, '书稿/正文')
  const names = await readdir(folder)
  const prefaces = names.filter(name => /^序言.*\.md$/.test(name))
  if (prefaces.length !== 1) throw new Error('正文目录必须有且仅有一篇序言')
  async function readPage(filename, route, number) {
    const content = await readFile(join(folder, filename), 'utf8')
    const title = content.match(/^# (.+)$/m)?.[1]
    if (!title) throw new Error(`${filename} 缺少一级标题`)
    return { filename, route, number, title, content }
  }
  const preface = await readPage(prefaces[0], 'index')
  const chapters = await Promise.all(names.filter(name => /^第\d+章.*\.md$/.test(name)).map(name => {
    const number = Number(name.match(/^第(\d+)章/)[1])
    return readPage(name, `chapter-${String(number).padStart(2, '0')}`, number)
  }))
  chapters.sort((a, b) => a.number - b.number)
  if (!chapters.length || chapters.some((c, i) => c.number !== i + 1)) {
    throw new Error('章节编号重复或不连续，请检查正文文件')
  }
  const outline = await readFile(join(root, '书稿/目录.md'), 'utf8')
  const parts = []
  for (const line of outline.split('\n')) {
    const part = line.match(/^## (第.+篇)[｜|](.+)$/)
    if (part) parts.push({ text: `${part[1]} · ${part[2].split('：')[0]}`, items: [] })
    const match = line.match(/^### 第(\d+)章/)
    if (match) {
      const chapter = chapters.find(c => c.number === Number(match[1]))
      if (!chapter || !parts.length) throw new Error(`目录与正文不对应：${line}`)
      parts.at(-1).items.push(chapter)
    }
  }
  const ordered = parts.flatMap(p => p.items)
  if (ordered.length !== chapters.length || ordered.some((c, i) => c !== chapters[i])) {
    throw new Error('目录存在遗漏、重复或错序的章节')
  }
  return { preface, chapters, parts }
}

export function sidebarFor(book) {
  return [
    { text: '序言', items: [{ text: '序言 · 毕业之后，还要重新学习什么', link: '/' }] },
    ...book.parts.map(part => ({
      text: part.text,
      collapsed: false,
      items: part.items.map(c => ({ text: c.title.replace(/\s+/g, ' '), link: `/${c.route}` }))
    }))
  ]
}

export async function writeBook(book, output) {
  await mkdir(output, { recursive: true })
  const pages = [book.preface, ...book.chapters]
  const wanted = new Set(pages.map(p => `${p.route}.md`))
  for (const name of await readdir(output)) {
    if (name.endsWith('.md') && !wanted.has(name)) await rm(join(output, name))
  }
  for (const [i, page] of pages.entries()) {
    const link = p => ({ text: p.title, link: p.route === 'index' ? '/' : `/${p.route}` })
    const meta = {
      title: page.title,
      description: page.content.split('\n').find(line => line && !line.startsWith('#'))?.slice(0, 150),
      prev: i === 0 ? false : link(pages[i - 1]),
      next: i === pages.length - 1 ? false : link(pages[i + 1])
    }
    const header = Object.entries(meta).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')
    await writeFile(join(output, `${page.route}.md`), `---\n${header}\n---\n\n${page.content}`)
  }
}
