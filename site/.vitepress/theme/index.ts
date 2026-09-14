import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-before': () => h('p', { class: 'book-caption' }, '学会工作 · 从学生到职业人的前三年')
  })
}
