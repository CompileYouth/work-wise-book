# Workwise · 学会工作

从学生到职业人的前三年。全书围绕看懂职场、把事情做成、与人合作、管理自己和持续成长展开。

**在线阅读：[Workwise 阅读网站](https://compileyouth.github.io/work-wise-book/)**

## 内容与网站

- `书稿/正文/`：序言和 21 章正文，网站内容的唯一来源。
- `书稿/目录.md`：全书篇章分组；网站章节名称取各章正文的一级标题。
- `site/`：VitePress 阅读网站，包含目录、章节导航、中文全文搜索及深浅色主题。
- `公众号文章整理/`、其他书稿资料：原文与编辑资料，不打包进阅读网站。

## 本地阅读与维护

需要 Node.js 22 或更新版本。

```sh
npm ci
npm run dev
```

按终端提示打开地址。修改正文后重新运行 `npm run dev` 即可刷新生成内容；修改网站样式会即时更新。不要直接编辑 `site/content/`，这里的页面每次启动或构建都会从书稿重新生成。

```sh
npm test             # 校验章节顺序和正文一致性
npm run build        # 构建静态网站
npm run test:site    # 检查全部页面、内部链接和资源路径
npm run preview     # 预览构建结果
```

浏览器验证使用 `npm run test:browser`，需要本机安装 Google Chrome。覆盖所有章节直达、中文搜索、前后章导航、手机目录和深色主题。

## 部署

GitHub Pages 使用 GitHub Actions 部署，配置在 `.github/workflows/pages.yml`。推送正文或网站更新到 `main` 后自动校验、构建并部署，也可在 Actions 页面手动运行 **Deploy reading website**。

网站路径为 `/work-wise-book/`，由 `site/.vitepress/config.mts` 的 `base` 配置指定。仅上传 `site/.vitepress/dist/` 静态产物，站点不需要服务器或数据库。

依赖锁定在 `package-lock.json`。VitePress 使用稳定版 1.6.4；Vite 覆盖到 6.4.3，以避开其默认旧版开发服务器的已知安全问题，构建和浏览器行为已验证。
