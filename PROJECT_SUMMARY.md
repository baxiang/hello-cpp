# C/C++ 技术文档 - 项目完成总结

## 项目统计

| 部分 | 节数 | 文件数 |
|------|------|--------|
| C 语言基础 | 10 节 | 40 |
| C++98/03 基础 | 7 节 | 22 |
| C++11/14 新特性 | 6 节 | 21 |
| C++17 新特性 | 4 节 | 9 |
| 最佳实践 | 8 节 | 9 |
| **总计** | **35 节** | **101** |

## 文档结构

```
hello-cpp/
├── README.md                          # 主文档（完整导航）
├── c/                                 # C 语言（10 章，30 节内容）
│   ├── 1-basics/                      # C 语言基础
│   ├── 2-control/                     # 控制结构
│   ├── 3-array-string/                # 数组和字符串
│   ├── 4-functions/                   # 函数
│   ├── 5-pointers/                    # 指针
│   ├── 6-memory/                      # 内存管理
│   ├── 7-structs/                     # 结构体和联合体
│   ├── 8-file/                        # 文件操作
│   ├── 9-preprocessor/                # 预处理器
│   └── 10-standard-lib/               # 标准库
├── cpp/                               # C++98/03（7 章，15 节内容）
│   ├── 1-intro/                       # C++ 入门
│   ├── 2-classes/                     # 类和对象
│   ├── 3-inheritance/                 # 继承
│   ├── 4-polymorphism/                # 多态
│   ├── 5-templates/                   # 模板
│   ├── 6-stl/                         # STL
│   └── 7-exceptions/                  # 异常
├── cpp11/                             # C++11/14（6 章，15 节内容）
│   ├── 1-auto/                        # 类型推导
│   ├── 2-smart-pointers/              # 智能指针
│   ├── 3-move/                        # 移动语义
│   ├── 4-lambda/                      # Lambda 表达式
│   ├── 5-thread/                      # 多线程
│   └── 6-others/                      # 其他特性
├── cpp17/                             # C++17（4 章，5 节内容）
│   ├── 1-structured-bindings/         # 结构化绑定
│   ├── 2-optional-variant/            # optional/variant
│   ├── 3-filesystem/                  # 文件系统
│   └── 4-string-view/                 # string_view
└── part5-best-practices/              # 最佳实践（8 节）
    ├── 01-code-style.md               # 代码规范
    ├── 02-raii.md                     # RAII 原则
    ├── 03-modern-cpp.md               # 现代 C++ 风格
    ├── 04-performance.md              # 性能优化
    ├── 05-pitfalls.md                 # 常见陷阱
    ├── a1-design-patterns.md          # 设计模式
    ├── a2-toolchain.md                # 编译工具链
    └── a3-debugging.md                # 调试技巧
```

## 学习路径

```
C 语言基础 → C++ 基础 → C++11 现代特性 → C++17 新特性 → 最佳实践
```

## 文档特点

1. **完整的知识体系**: 从 C 语言基础到现代 C++17
2. **丰富的代码示例**: 每个主题都配有完整的可运行代码
3. **实践练习**: 每节都有练习题巩固知识
4. **清晰的导航**: README 提供完整的链接索引

## 快速开始

```bash
# 编译 C 程序
gcc -o hello hello.c

# 编译 C++ 程序
g++ -std=c++17 -o hello hello.cpp
```

## 许可证

MIT License
