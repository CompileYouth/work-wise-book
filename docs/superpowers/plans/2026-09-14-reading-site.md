# Workwise 阅读网站实施计划

目标：使用现有序言与 21 章正文，提供类似 Vue 文档的阅读体验，部署到 GitHub Pages。

架构：VitePress 负责静态页面、导航、搜索和移动布局；构建前从 `书稿/正文` 生成页面，从 `书稿/目录.md` 提取五篇分组。正文保持原样，章节标题以正文为准。生成目录不进入版本库，避免双份书稿。

技术：Node.js 22、VitePress 1.6、Vue 3、Node 原生测试、Playwright 浏览器验证、GitHub Actions / Pages。

- [x] 先写内容校验测试：所有章节一一对应、顺序完整、生成正文与源文逐字一致、不含编辑记录或公众号原文。
- [x] 实现 `scripts/book.mjs` 与 `scripts/prepare-book.mjs`，生成序言首页、章节页及导航数据。
- [x] 配置 `site/.vitepress/config.mts`：五篇目录、本章导航、前后章、中文搜索、深浅色、GitHub 项目路径。
- [x] 调整阅读排版：绿色强调色、适合中文的字体与行距、手机折叠目录，不增加与阅读无关的首页。
- [x] 执行 `npm test`、`npm run build`，核对所有 HTML 正文和资源路径；用浏览器检查桌面、手机和搜索。
- [x] 添加 GitHub Actions 构建部署、维护说明。用户已明确同意将原仓库公开，验证完成后执行公开、提交推送、启用 Pages。
- [x] 等待部署完成，检查线上首页、章节直达、搜索与手机导航。只有线上验证成功后报告上线。

验证记录：正文校验 2 项、构建链接校验 1 项、浏览器场景 3 项均通过；浏览器检查覆盖全部 21 章，桌面与手机截图已人工检查。npm audit 未发现已知漏洞。GitHub 工作流已通过已连接的 GitHub 工具写入，仓库已公开并启用 Pages；线上发布验证已完成。

线上验证：GitHub Actions 运行 https://github.com/CompileYouth/work-wise-book/actions/runs/34854348289 构建与部署成功。对 https://compileyouth.github.io/work-wise-book/ 执行全部 3 项浏览器场景，覆盖 21 章直接访问、中文搜索结果跳转、前后章、手机导航和主题切换，全部通过。原书稿及公众号原文未修改。
