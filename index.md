---
layout: home

hero:
  name: 面试题库大全
  text: 3 套题库 · 400+ 道题
  tagline: AI Agent / Python / React，答案版，按面试口吻整理
  actions:
    - theme: brand
      text: 开始刷题
      link: /ai-agent
    - theme: alt
      text: Python 题库
      link: /python

features:
  - title: 结论先行
    details: 每题先给一句话结论，再补真实场景和坑，适合口述而不是背课文。
  - title: 保留公司出处
    details: 题目保留原题的公司标注，方便按目标公司挑重点复习。
  - title: 中文搜索可用
    details: 本地搜索做了中文双字切分，直接搜「闭包」「GIL」「Fiber」都能召回。
---

## 题库

| 题库 | 规模 | 覆盖 |
|---|---|---|
| [AI Agent 面试题库](/ai-agent) | 151 题 · 9 章 | 架构模式、Agent Harness、工具调用与 MCP、记忆与上下文、多智能体、评估与安全、系统设计、手撕代码 |
| [Python 面试题库](/python) | 201 题 · 10 章 | 语言特性、数据结构、拷贝与传参、装饰器、迭代器、面向对象、GC、GIL 与并发、常用库、Web 框架 |
| [React 面试题库](/react) | 7 章 | 组件模型、Hooks、状态管理、虚拟 DOM 与 Fiber、性能优化、React 18/19、路由与 SSR |

## 怎么用

- 三套题库各是一个长页面，用右侧「本页目录」按章节跳，或直接顶部搜索定位关键词。
- 题目加粗标出、答案紧跟其后，适合盖住答案自测。
- 站点是纯静态的，离线把 `dist/` 用任意 HTTP 服务打开也能看。
