import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'nav-bar-title-after': () => h('span', { class: 'book-brand' }, [
      h('span', { class: 'book-brand-title' }, '专业之外'),
      h('span', { class: 'book-brand-subtitle' }, '从学生到职业人的 21 堂成长课')
    ]),
    'doc-before': () => h('p', { class: 'book-caption' }, '专业之外：从学生到职业人的 21 堂成长课')
  })
}
