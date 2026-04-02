# 7. CMake 完全指南

CMake 是跨平台的构建系统生成器，已成为现代 C++ 项目的标准构建工具。本章节从基础到高级，全面介绍 CMake 的使用。

## 什么是 CMake？

CMake（Cross Platform Make）是一个开源的构建系统生成器，它：

- **跨平台**：支持 Windows、Linux、macOS
- **跨编译器**：支持 GCC、Clang、MSVC 等
- **生成原生构建文件**：生成 Makefile、Ninja、Visual Studio 项目等
- **现代 C++ 标准支持**：完整支持 C++11/14/17/20

### CMake vs 传统构建系统

| 特性 | CMake | Makefile | Visual Studio |
|------|-------|----------|---------------|
| 跨平台 | ✅ | ❌ | ❌ |
| IDE 支持 | ✅ 多种 IDE | ❌ | ✅ 仅 VS |
| 依赖管理 | ✅ find_package | ❌ 手动 | 部分 |
| 配置灵活性 | ✅ 高 | 中 | 低 |

## 章节导航

| 文档 | 内容 |
|------|------|
| [01-basics.md](01-basics.md) | CMake 基础、项目结构、构建流程 |
| [02-libraries.md](02-libraries.md) | 静态库、共享库、头文件库、对象库 |
| [03-dependencies.md](03-dependencies.md) | find_package、FetchContent、自定义查找模块 |
| [04-testing.md](04-testing.md) | CTest、GoogleTest 集成 |
| [05-cross-platform.md](05-cross-platform.md) | 平台检测、跨平台配置、多架构支持 |
| [06-advanced.md](06-advanced.md) | 安装打包、性能优化、实用技巧 |

## 快速开始

### 最简单的 CMake 项目

```
hello-cmake/
├── CMakeLists.txt
└── main.cpp
```

**CMakeLists.txt：**
```cmake
cmake_minimum_required(VERSION 3.10)
project(HelloCMake)

add_executable(hello main.cpp)
```

**构建命令：**
```bash
mkdir build && cd build
cmake ..
cmake --build .
./hello
```

## 学习路径

```
CMake 基础 → 库管理 → 依赖管理 → 测试集成 → 跨平台 → 高级主题
```

## 前置知识

- C++ 基础语法
- 基本的命令行操作
- 了解编译流程（编译、链接）

## 推荐版本

建议使用 **CMake 3.15+**，支持更多现代特性：

```bash
# 检查 CMake 版本
cmake --version

# macOS 安装最新版
brew install cmake

# Ubuntu 安装
sudo apt-get install cmake
```

## 相关章节

- [6. 包管理](../06-package-management.md) - Conan/vcpkg 与 CMake 集成
- [8. VSCode 容器化开发环境](../08-dev-container/README.md) - Dev Container 中的 CMake 配置