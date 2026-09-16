import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'
import sidebar from './book.json'

const base = '/work-wise-book/'

export default defineConfig({
  title: '专业之外：从学生到职业人的 21 堂成长课',
  description: '《专业之外：从学生到职业人的 21 堂成长课》，面向工作 0—5 年的职场人。看懂职场，把事做成，与人合作，自我管理，持续成长。',
  lang: 'zh-CN',
  base,
  srcDir: './content',
  vite: { publicDir: fileURLToPath(new URL('../public', import.meta.url)) },
  cleanUrls: false,
  appearance: true,
  lastUpdated: false,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#258566' }]
  ],
  themeConfig: {
    logo: { src: '/favicon.svg', alt: '' },
    siteTitle: false,
    nav: [{ text: '序言', link: '/' }],
    sidebar,
    outline: { level: [2, 3], label: '本章目录' },
    docFooter: { prev: '上一章', next: '下一章' },
    sidebarMenuLabel: '全书目录',
    darkModeSwitchLabel: '阅读主题',
    lightModeSwitchTitle: '切换到浅色主题',
    darkModeSwitchTitle: '切换到深色主题',
    returnToTopLabel: '回到顶部',
    skipToContentLabel: '跳转到正文',
    notFound: {
      title: '这一页还没找到',
      quote: '可以从序言开始，或通过左侧目录继续阅读。',
      linkLabel: '回到序言',
      linkText: '回到序言'
    },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (text: string) => Array.from(
              new Intl.Segmenter('zh-CN', { granularity: 'word' }).segment(text),
              segment => segment.isWordLike ? segment.segment.toLowerCase() : ''
            ).filter(Boolean)
          },
          searchOptions: { prefix: true, fuzzy: 0, combineWith: 'AND' }
        },
        translations: {
          button: { buttonText: '搜索书中内容', buttonAriaLabel: '搜索书中内容' },
          modal: {
            displayDetails: '显示正文摘要',
            resetButtonTitle: '清空搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到相关内容',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    }
  }
})
