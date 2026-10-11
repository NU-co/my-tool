# 技术速查手册 · Dev Cheatsheet

一个纯静态的单页技术速查网站，覆盖日常开发最常查的九类内容，支持全文检索、一键复制与深色 / 浅色主题。

**在线地址：** https://NU-co.github.io/my-tool/

## 内容分类

| 分类 | 条目 | 说明 |
| --- | --- | --- |
| Git 版本控制 | 14 | 分支、提交、撤销、stash、rebase 与 reflog 找回 |
| Linux 与 Shell | 14 | 文件、进程、端口、打包、管道与重定向 |
| HTTP 与网络 | 12 | 状态码语义、常用头字段、幂等性、CORS、curl 调试 |
| JavaScript / TypeScript | 15 | 数组对象技巧、异步控制、防抖节流、浏览器 API |
| Python | 15 | 虚拟环境、推导式、pathlib、dataclass、命令行参数 |
| SQL | 11 | 查询骨架、连接聚合、窗口函数、索引与执行计划 |
| Docker 与容器 | 10 | 镜像构建、容器排障、多阶段构建、清理 |
| 正则表达式 | 14 | 元字符、分组环视、邮箱 / URL / IP / 日期等常用模式 |
| VS Code 快捷键 | 12 | 导航、多光标、重构、格式化 |

## 文件结构

```
my-tool/
├── index.html    页面结构
├── styles.css    全部样式（CSS 变量驱动主题）
├── data.js       速查内容数据（唯一需要改动的文件）
├── app.js        渲染 / 检索 / 复制 / 主题逻辑
├── .nojekyll     让 GitHub Pages 跳过 Jekyll 处理
└── README.md
```

无框架、无构建、无依赖，浏览器直接打开 `index.html` 即可运行。

## 功能

- **全文检索**：同时匹配命令、说明、代码片段和检索别名；命中片段高亮显示。
- **一键复制**：每条命令右上角复制按钮，`file://` 下自动回退到 `execCommand`。
- **主题切换**：默认跟随系统 `prefers-color-scheme`，手动切换后写入 `localStorage`。
- **目录联动**：侧边栏目录滚动高亮，移动端变成可横向滑动的分类胶囊。
- **快捷键**：<kbd>/</kbd> 或 <kbd>Ctrl</kbd>+<kbd>K</kbd> 聚焦搜索，<kbd>Esc</kbd> 清空。
- **响应式与打印**：窄屏单列布局，打印样式自动隐藏交互元素。

## 本地预览

```bash
# 任选一种
npx --yes serve -l 8123 .
python -m http.server 8123
```

然后打开 <http://127.0.0.1:8123/>。

## 如何增改内容

只改 `data.js`。往对应分区的 `items` 数组里追加对象即可：

```js
{
  k: 'git bisect start',      // 关键词或命令，作为主标题
  d: '二分查找引入 bug 的提交。', // 说明文字
  c: 'git bisect good <sha>', // 可选：需要单独展示并可复制的多行代码
  tags: ['二分', '排查']       // 可选：检索别名
}
```

检索会自动覆盖新条目，无需改动其他文件。

## 部署

仓库 `main` 分支根目录即为站点根目录，GitHub Pages 的 Source 设为 `Deploy from a branch` → `main` → `/ (root)`。推送后约一分钟内自动更新。

> 提示：删除、强制覆盖、`prune` 这类命令已在说明中标注风险，实际执行前请先确认影响范围。
