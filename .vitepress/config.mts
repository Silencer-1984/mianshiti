import { defineConfig } from 'vitepress'

// 部署到 GitHub 项目页（https://<user>.github.io/mianshiti/）时构建要带 base。
// 本地构建默认 '/'；CI 里通过 BASE_PATH 环境变量传入 '/<repo>/'。
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  lang: 'zh-CN',
  title: '面试题库大全',
  description: 'AI Agent / Python / React 三套面试题库（答案版）',
  base,
  // GitHub Pages 不做无扩展名重写，URL 是 /python.html
  cleanUrls: false,
  lastUpdated: false,
  // 源目录就是项目根，三个题库 md 原地不动；产物放到仓库根 dist/
  outDir: './dist',
  srcExclude: [
    'README.md',
    'node_modules/**',
    'dist/**',
    '.workbuddy/**',
    '.github/**'
  ],

  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }]],

  // 文件名带中文和空格，映射成短路径，不改动源文件命名
  rewrites: {
    'AI Agent 面试题与八股文汇总-答案版.md': 'ai-agent.md',
    'Python面试题与八股文汇总-答案版.md': 'python.md',
    'temp-React题库答案.md': 'react.md'
  },

  markdown: {
    lineNumbers: true
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'AI Agent', link: '/ai-agent' },
      { text: 'Python', link: '/python' },
      { text: 'React', link: '/react' }
    ],

    sidebar: [
      {
        text: 'AI Agent · 151 题',
        items: [{ text: '基础概念 → 系统设计 → 手撕代码', link: '/ai-agent' }]
      },
      {
        text: 'Python · 201 题',
        items: [{ text: '语言特性 → GIL 并发 → Web 框架', link: '/python' }]
      },
      {
        text: 'React',
        items: [{ text: '组件模型 → Hooks → Fiber → 新特性', link: '/react' }]
      }
    ],

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索题库',
            buttonAriaLabel: '搜索题库'
          },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除查询',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        },
        miniSearch: {
          options: {
            // 中文按「整段 + 相邻双字」切词，否则默认分词器召回很差
            tokenize: (text: string) => {
              const tokens: string[] = []
              for (const raw of text.split(/[^A-Za-z0-9\u4e00-\u9fa5]+/)) {
                if (!raw) continue
                tokens.push(raw)
                if (/[\u4e00-\u9fa5]/.test(raw)) {
                  for (let i = 0; i < raw.length - 1; i++) {
                    tokens.push(raw.slice(i, i + 2))
                  }
                }
              }
              return tokens
            }
          }
        }
      }
    }
  }
})
