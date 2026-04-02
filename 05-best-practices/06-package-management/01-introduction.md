# 1. 包管理概述

本章介绍 C++ 包管理的背景、主流工具对比和选择建议。

## 1.1 传统依赖管理的痛点

在没有包管理器之前，C++ 项目管理依赖面临诸多挑战：

### 手动管理

```bash
# 传统方式：手动下载、编译、安装
wget https://github.com/some-lib/releases/download/v1.0/lib.tar.gz
tar -xzf lib.tar.gz
cd lib
./configure --prefix=/usr/local
make
make install

# 然后在项目中配置
g++ -I/usr/local/include -L/usr/local/lib -lsome-lib main.cpp
```

**问题：**
- 耗时费力，每个依赖都要重复这个过程
- 不同平台需要不同的配置
- 版本更新需要重新操作

### 传递依赖

```
你的项目 → 依赖 A → 依赖 B → 依赖 C
```

手动管理时，需要追踪并安装所有传递依赖，容易遗漏。

### 版本冲突

```
项目依赖：
- 库 A 需要 Boost 1.70
- 库 B 需要 Boost 1.80
```

不同依赖要求不同版本的同一个库，手动解决非常困难。

### 跨平台差异

| 平台 | 默认库路径 | 头文件路径 | 库命名 |
|------|------------|------------|--------|
| Linux | /usr/lib | /usr/include | libxxx.so |
| macOS | /usr/local/lib | /usr/local/include | libxxx.dylib |
| Windows | 无标准 | 无标准 | xxx.dll |

团队成员使用不同操作系统，配置难以统一。

## 1.2 包管理器的优势

### 自动化依赖获取

```bash
# Conan：一条命令安装所有依赖
conan install . --build=missing

# vcpkg：自动下载编译
vcpkg install fmt nlohmann-json
```

### 二进制缓存

```
首次构建：下载源码 → 编译 → 缓存二进制
后续构建：直接使用缓存（秒级完成）
```

### 传递依赖自动处理

包管理器自动解析并安装所有传递依赖：

```
你请求：fmt/10.1.0
Conan 自动安装：
- fmt/10.1.0
- 其所有传递依赖（如有）
```

### 版本锁定

```json
// vcpkg.json - 锁定版本
{
  "dependencies": [
    { "name": "fmt", "version>=": "10.1.0" }
  ]
}
```

确保团队成员和 CI/CD 使用相同的依赖版本。

## 1.3 主流包管理器对比

### 功能对比

| 特性 | Conan | vcpkg | FetchContent |
|------|-------|-------|--------------|
| 包数量 | 1500+ | 1900+ | 无限制（直接从 Git） |
| 二进制缓存 | ✅ 完善 | ✅ 支持 | ❌ 无 |
| 传递依赖 | ✅ 自动 | ✅ 自动 | ❌ 手动 |
| 版本锁定 | ✅ lockfile | ✅ 清单模式 | ✅ GIT_TAG |
| 跨平台 | ✅ 优秀 | ✅ 良好 | ✅ 依赖 CMake |
| CMake 集成 | ✅ 完善 | ✅ 完善 | ✅ 内置 |
| 私有仓库 | ✅ 支持 | ✅ 支持 | ✅ Git URL |
| 学习曲线 | 中等 | 较低 | 低 |
| 社区活跃度 | 高 | 高 | - |

### 适用场景对比

| 场景 | 推荐工具 | 原因 |
|------|----------|------|
| 小型个人项目 | FetchContent | 无需额外工具，配置简单 |
| 中型项目 | Conan/vcpkg | 二进制缓存加速构建 |
| 大型商业项目 | Conan | 灵活配置、私有仓库支持 |
| Windows 为主 | vcpkg | Visual Studio 集成好 |
| 跨平台团队 | Conan | 平台支持最完善 |
| 快速原型开发 | FetchContent | 最快上手 |

### 性能对比

| 操作 | Conan | vcpkg | FetchContent |
|------|-------|-------|--------------|
| 首次安装 | 分钟级 | 分钟级 | 分钟级 |
| 二次安装（有缓存） | 秒级 | 秒级 | 分钟级（重新下载） |
| CI/CD 构建 | 快（有缓存） | 快（有缓存） | 慢（每次下载） |

## 1.4 选择建议

### 决策流程

```
                    开始
                      │
                      ▼
              ┌───────────────┐
              │ 项目规模？    │
              └───────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
      小型         中型         大型
         │            │            │
         ▼            ▼            ▼
   FetchContent   Conan/vcpkg    Conan
         │            │
         │     ┌──────┴──────┐
         │     │             │
         │  Windows为主   跨平台
         │     │             │
         │     ▼             ▼
         │   vcpkg        Conan
         │
         ▼
      完成
```

### 具体建议

**选择 FetchContent：**
- 个人学习项目
- 快速原型开发
- 依赖少于 3 个
- 不需要二进制缓存

**选择 vcpkg：**
- Windows 开发环境
- Visual Studio 用户
- 微软技术栈项目
- 团队已使用 vcpkg

**选择 Conan：**
- 大型商业项目
- 跨平台开发团队
- 需要私有包仓库
- 复杂依赖关系
- 需要精细版本控制

## 1.5 工具组合使用

实际项目中可以组合使用：

### Conan + FetchContent

```cmake
# Conan 管理主要依赖
# FetchContent 获取不在 Conan 仓库的库

include(FetchContent)
FetchContent_Declare(
    my-private-lib
    GIT_REPOSITORY https://github.com/myorg/private-lib.git
    GIT_TAG v1.0.0
)
FetchContent_MakeAvailable(my-private-lib)

# Conan 依赖通过 find_package 使用
find_package(fmt REQUIRED)
target_link_libraries(myapp PRIVATE fmt::fmt my-private-lib)
```

### vcpkg + FetchContent

```cmake
# vcpkg 管理系统级依赖
# FetchContent 获取项目特定库

# CMAKE_TOOLCHAIN_FILE 指向 vcpkg
# 然后使用 FetchContent 获取额外依赖
```

## 1.6 包管理趋势

### 行业趋势

- **企业采用率上升**：越来越多企业使用 Conan/vcpkg
- **CI/CD 集成**：包管理成为 CI/CD 标准环节
- **标准化努力**：C++ 标准委员会讨论官方包管理

### 学习建议

1. **先学 FetchContent**：最简单，理解基本概念
2. **再学 Conan 或 vcpkg**：根据项目需求选择
3. **掌握最佳实践**：版本锁定、缓存利用

## 下一步

了解概述后，根据需求选择学习：

- [02-conan.md](02-conan.md) - 学习 Conan 详细使用
- [03-vcpkg.md](03-vcpkg.md) - 学习 vcpkg 详细使用
- [04-fetchcontent.md](04-fetchcontent.md) - 学习 FetchContent 使用