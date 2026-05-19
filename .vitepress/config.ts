import { defineConfig } from 'vitepress'
import sidebar from './sidebar'

const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('build')

export default defineConfig({
  title: '从零开始系统学习 C/C++ 编程',
  description: 'C/C++ 全栈学习路线教程',
  lang: 'zh-CN',
  base: isProduction ? '/hello-cpp/' : '/',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'C 语言', link: '/01-c/01-basics/01-intro' },
      { text: 'C++ 基础', link: '/02-cpp/01-intro/01-intro' },
      { text: 'C++11', link: '/03-cpp11/01-auto/01-auto' },
      { text: 'C++17', link: '/04-cpp17/01-structured-bindings/01-basics' },
      { text: '最佳实践', link: '/05-best-practices/01-code-style' },
    ],

    sidebar,

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/baxiang/hello-cpp' },
    ],

    outline: {
      label: '本页目录',
      level: [2, 3],
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
  },

  markdown: {
    lineNumbers: true,
  },

  srcExclude: [
    '**/node_modules/**',
    '**/.vitepress/**',
    'docs/**',
    'AGENTS.md',
    '.github/**',
  ],
})
