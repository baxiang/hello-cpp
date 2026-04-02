# 8. VSCode 容器化 C++ 开发环境

本章节介绍如何使用 VSCode + Docker Dev Containers 搭建标准化、可复现的 C++ 开发环境。

## 为什么使用容器化开发环境？

### 传统开发环境的痛点

- **环境不一致**：团队成员操作系统、编译器版本不同，导致代码行为差异
- **配置繁琐**：新成员入职需要花费大量时间配置开发环境
- **依赖冲突**：不同项目需要不同版本的库，容易产生冲突
- **难以复现**：问题难以在他人的机器上复现

### 容器化开发的优势

- **环境一致性**：所有人在相同的容器中开发，消除"在我机器上能跑"的问题
- **快速启动**：一条命令即可搭建完整的开发环境
- **隔离性**：不同项目的依赖完全隔离，互不干扰
- **版本控制**：开发环境配置纳入版本控制，可追溯、可回滚
- **跨平台**：Windows、macOS、Linux 用户使用相同的开发环境

## 章节导航

| 文档 | 内容 |
|------|------|
| [01-installation.md](01-installation.md) | Docker Desktop、VSCode、Dev Containers 扩展安装 |
| [02-configuration.md](02-configuration.md) | devcontainer.json、Dockerfile 配置示例 |
| [03-vscode-setup.md](03-vscode-setup.md) | C++ 扩展、调试配置、IntelliSense 设置 |
| [04-troubleshooting.md](04-troubleshooting.md) | 常见问题与解决方案 |

## 快速开始

如果你已经安装好 Docker Desktop 和 VSCode，可以快速体验：

1. 打开 VSCode，安装 **Dev Containers** 扩展
2. 在项目根目录创建 `.devcontainer` 文件夹
3. 创建 `devcontainer.json` 配置文件：

```json
{
  "name": "C++ Dev Container",
  "image": "mcr.microsoft.com/devcontainers/cpp:0-ubuntu-22.04",
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {}
  }
}
```

4. 按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
5. 输入 `Dev Containers: Reopen in Container`
6. 等待容器构建完成，即可开始开发

## 前置知识

- 基本的命令行操作
- 了解 Docker 的基本概念（镜像、容器）
- 熟悉 VSCode 基本操作

## 系统要求

| 项目 | 最低要求 | 推荐配置 |
|------|----------|----------|
| 内存 | 8 GB | 16 GB 或更多 |
| 存储 | 20 GB 可用空间 | 50 GB 或更多 |
| CPU | 2 核 | 4 核或更多 |
| 操作系统 | Windows 10/11, macOS 10.15+, Ubuntu 18.04+ | 最新稳定版 |

## 相关章节

- [06. 包管理](../06-package-management.md) - 在容器内使用 Conan/vcpkg
- [07. CMake 完全指南](../07-cmake-guide.md) - CMake 项目配置
- [附录2. 编译工具链](../a2-toolchain.md) - GCC/Clang 编译器知识