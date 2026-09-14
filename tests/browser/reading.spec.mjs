import { test, expect } from '@playwright/test'
import { loadBook } from '../../scripts/book.mjs'

test('桌面布局、所有章节直达与前后章导航', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
  await page.setViewportSize({ width: 1440, height: 1000 })
  const book = await loadBook(process.cwd())
  await page.goto('./')
  await expect(page.locator('h1')).toContainText('序言')
  await expect(page.locator('.VPSidebar')).toBeVisible()
  const sidebar = await page.locator('.VPSidebar').boundingBox()
  const article = await page.locator('.vp-doc').boundingBox()
  expect(sidebar.x + sidebar.width).toBeLessThanOrEqual(article.x)
  await page.screenshot({ path: 'test-results/desktop-preface.png', fullPage: true })
  for (const chapter of book.chapters) {
    await page.goto(`${chapter.route}.html`)
    await expect(page.locator('h1')).toContainText(chapter.title)
    expect(await page.locator('.vp-doc h2').count()).toBeGreaterThan(0)
    await expect(page.locator('.VPSidebarItem.is-active a').first()).toHaveAttribute('href', new RegExp(chapter.route))
  }
  await expect(page.locator('.pager-link.next')).toHaveCount(0)
  await page.locator('.pager-link.prev').click()
  await expect(page.locator('h1')).toContainText('第20章')
  await page.screenshot({ path: 'test-results/desktop-chapter.png', fullPage: false })
  expect(errors).toEqual([])
})

test('中文全文搜索能找到正文并跳转到对应章节', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: '搜索书中内容' }).click()
  await page.locator('#localsearch-input').fill('知识债务')
  const result = page.locator('.VPLocalSearchBox a').filter({ hasText: '知识债务' }).first()
  await expect(result).toBeVisible()
  await result.click()
  await expect(page).toHaveURL(/chapter-17\.html#/)
  await expect(page.locator('h1')).toContainText('第17章')
})

test('手机目录、深色主题和无横向溢出', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('chapter-04.html')
  await page.getByRole('button', { name: '全书目录' }).click()
  await expect(page.locator('.VPSidebar')).toBeVisible()
  await page.locator('.VPSidebar a').filter({ hasText: '第5章' }).click()
  await expect(page.locator('h1')).toContainText('第5章')
  await expect(page.locator('.VPSidebar')).not.toHaveClass(/open/)
  await expect.poll(async () => {
    const box = await page.locator('.VPSidebar').boundingBox()
    return Math.round(box.x + box.width)
  }).toBeLessThanOrEqual(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/mobile-chapter.png', fullPage: false })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.getByRole('switch').first().click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.screenshot({ path: 'test-results/dark-chapter.png', fullPage: false })
})
