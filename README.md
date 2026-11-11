# 面试题库大全

`AI Agent` / `Python` / `React` 三套面试题库（答案版），用 [VitePress](https://vitepress.dev) 建成的静态站，托管在 GitHub Pages。

线上地址：`https://silencer-1984.github.io/mianshiti/`

## 命令

```bash
npm install          # 首次
npm run docs:dev     # 开发模式，热更新，http://localhost:5173
npm run docs:build   # 构建静态站 → 根目录 dist/
npm run docs:preview # 预览构建产物，http://localhost:4173
npm run docs:serve   # 构建 + 预览（一条命令，推荐）
```

## 目录

- 根目录三个 `*.md`：题库正文，**原地不动**，直接作为站点页面
- `.vitepress/config.mts`：站点配置（短路径映射、中文搜索分词、侧边栏、产物路径）
- `.vitepress/theme/`：自定义主题，问答卡片的 CSS 在这里
- `scripts/normalize-qa.mjs`：题库排版规范化脚本（幂等）
- `index.md`：首页
- `public/`：favicon 与 `.nojekyll`
- `.github/workflows/deploy.yml`：GitHub Actions 自动构建发布
- `dist/`：构建产物，纯静态，已被 gitignore

文件名带中文和空格，通过 `rewrites` 映射成 `/ai-agent.html`、`/python.html`、`/react.html`，源文件不用改名。
`srcExclude` 排除了 `README.md`、`.workbuddy/`、`.github/`、`node_modules/`、`dist/`，避免把非题库内容扫成页面。

## 题库排版约定

题目行是独立加粗段落 `**1. 题干（公司）**`，答案另起一段，**中间必须留一个空行**。Markdown 里单个换行只是软换行、仍属于同一段落，不空行就会渲染成 `<p><strong>题目</strong> 答案…</p>`，视觉上黏成一段。

三个题库已用脚本统一处理过 539 处（151 + 201 + 187）：

```bash
node scripts/normalize-qa.mjs   # 幂等，可重复执行；自动跳过 README.md / index.md
```

新增或粘贴题目后跑一次即可；脚本只插空行，不改任何正文。题目段落的卡片样式在 `.vitepress/theme/style.css`，用 `.vp-doc p:has(> strong:only-child)` 精确命中「整段只有一个加粗」的段落，答案里的行内加粗（如 `**单向数据流**`）不会被误伤。

## 部署到 GitHub Pages

仓库：`git@github.com:Silencer-1984/mianshiti.git`

1. **仓库 Settings → Pages → Build and deployment → Source 选 `GitHub Actions`**（新建仓库默认不是这个，必须手动开一次）。
2. push 到 `main` 会自动触发 `.github/workflows/deploy.yml`：`npm ci` → 构建 → `upload-pages-artifact` → `deploy-pages`。
3. 部署地址 `https://silencer-1984.github.io/mianshiti/`。

### 部署相关的三处配置

| 配置 | 值 | 原因 |
|---|---|---|
| `base` | CI 里由 `BASE_PATH` 传入 `/${{ github.event.repository.name }}/` | 项目页部署在子路径下，资源必须带前缀 |
| `cleanUrls` | `false` | GitHub Pages 不做无扩展名重写，URL 是 `/react.html` |
| `public/.nojekyll` | 空文件 | 阻止 Jekyll 处理产物 |

如果改部署到 `<用户名>.github.io` 用户主页仓库（根路径），把 workflow 里的 `BASE_PATH` 改成 `/`。

### 手动部署（不想用 Actions）

```bash
BASE_PATH=/mianshiti/ npm run docs:build
# 然后把 dist/ 整个推到 gh-pages 分支
```

## 本机环境备忘（推送相关）

与 `/面试准备` 同一台机器，两个坑已处理：

1. **HTTPS 走不通**：系统代理是 TUN 模式（DNS 解析到 `198.18.0.22`），git 的 schannel 后端握手失败。本仓库已设置 `http.sslBackend = openssl`、`http.sslCAInfo = C:\Program Files\Git\mingw64\etc\ssl\certs\ca-bundle.crt`。
2. **SSH 22 端口被代理关闭**，改走 GitHub 的 443 端口。`~/.ssh/config`：

   ```
   Host github.com
     HostName ssh.github.com
     Port 443
     User git
     IdentityFile C:/Users/1/.ssh/id_rsa
     IdentitiesOnly yes
   ```

   生效的是 `id_rsa`，`id_ed25519` 没有加到 GitHub。
3. **本机没有 `gh` CLI**：Pages 的 Source 设置、Actions 运行状态只能在网页上看，命令行开不了。
4. npm registry 是 `https://registry.npmmirror.com`（国内镜像）。
5. **本机本地构建前必须把 `TMP`/`TEMP` 指到工作区内目录**，否则 esbuild 删除 `%TEMP%\esbuild-*` 临时文件时报 `Access is denied`，构建在 `building client + server bundles` 阶段失败。这是本机安全软件/环境对系统 Temp 新写入文件的锁定，与 WorkBuddy 命令沙箱无关（`dangerouslyDisableSandbox` 无效），和 `ESBUILD_BINARY_PATH`、依赖版本也无关。用 PowerShell 执行：

   ```powershell
   New-Item -ItemType Directory -Force .\_tmp | Out-Null
   $env:TMP  = (Resolve-Path '.\_tmp').Path
   $env:TEMP = $env:TMP
   $env:BASE_PATH = '/mianshiti/'
   npm run docs:build
   ```

   `BASE_PATH` 在 Git Bash 里会被 MSYS 转成 `C:/Program Files/Git/...`，所以本地验证请用 PowerShell；CI 的 `ubuntu-latest` 没有这两个问题，`deploy.yml` 不用改。

## 注意

**`docs:preview` 在启动时会对 `dist` 做一次文件列表快照。** 预览开着时重新构建，新产物文件名带新 hash，服务器不认识，会出现页面正常但 JS/CSS 404 —— 表现为**搜索点不开、主题切不了、右侧目录不显示**。重新构建后务必重启 preview，或直接用 `npm run docs:serve`。

构建产物里的资源是绝对路径，`file://` 双击打开会 404，必须走 HTTP 服务。
