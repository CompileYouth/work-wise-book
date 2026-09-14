import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { loadBook, sidebarFor, writeBook } from './book.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const book = await loadBook(root)
await writeBook(book, join(root, 'site/content'))
await mkdir(join(root, 'site/.vitepress'), { recursive: true })
await writeFile(join(root, 'site/.vitepress/book.json'), JSON.stringify(sidebarFor(book), null, 2) + '\n')
console.log(`已生成序言与 ${book.chapters.length} 章正文，按 ${book.parts.length} 篇组织。`)
