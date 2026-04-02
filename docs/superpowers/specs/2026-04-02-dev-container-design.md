# 设计文档：VSCode 容器化 C++ 开发环境

## 概述

在 `05-best-practices` 下创建 `08-dev-container/` 子目录，包含 4 个文档，指导读者使用 Docker + VSCode Dev Containers 搭建容器化 C++ 开发环境。

## 目标读者

- C/C++ 学习者，希望搭建标准化的开发环境
- 需要跨平台一致开发体验的开发者
- 团队协作，需要统一开发环境的场景

## 目录结构

```
05-best-practices/
├── 08-dev-container/
│   ├── README.md              # 概览与快速导航
│   ├── 01-installation.md     # 环境安装与配置
│   ├── 02-configuration.md    # 配置文件示例
│   ├── 03-vscode-setup.md     # VSCode C++ 扩展配置
│   └── 04-troubleshooting.md  # 故障排除
└── ... (其他现有文件)
```

## 文档内容规划

### 1. README.md

- 章节简介
- 为什么使用容器化开发环境
- 文档导航链接
- 前置知识要求

### 2. 01-installation.md

**内容大纲：**

1. **Docker Desktop 安装**
   - macOS 安装步骤
   - Windows 安装步骤
   - Linux 安装步骤
   - 安装验证命令

2. **VSCode 安装**
   - 下载与安装
   - 基本配置建议

3. **Dev Containers 扩展安装**
   - 扩展 ID: `ms-vscode-remote.remote-containers`
   - 安装步骤截图说明

4. **系统要求**
   - 最低硬件配置
   - 推荐硬件配置
   - 操作系统版本要求

### 3. 02-configuration.md

**内容大纲：**

1. **devcontainer.json 配置**
   - 基础配置结构
   - 完整配置示例
   - 关键字段说明

2. **Dockerfile 编写**
   - 基础镜像选择（gcc/clang）
   - 开发工具安装
   - 环境变量配置

3. **docker-compose.yml（可选）**
   - 多容器场景
   - 数据库/服务依赖

4. **项目结构示例**
   ```
   .devcontainer/
   ├── devcontainer.json
   ├── Dockerfile
   └── docker-compose.yml (可选)
   ```

5. **CMake 集成配置**
   - CMake 工具链文件
   - 构建目录配置

### 4. 03-vscode-setup.md

**内容大纲：**

1. **必备扩展**
   - C/C++ 扩展 (ms-vscode.cpptools)
   - CMake Tools (ms-vscode.cmake-tools)
   - C/C++ Extension Pack

2. **推荐扩展**
   - CodeLLDB (调试器)
   - clangd (可选，替代 IntelliSense)
   - GitLens

3. **调试配置**
   - launch.json 配置
   - tasks.json 配置
   - 断点调试使用

4. **IntelliSense 配置**
   - c_cpp_properties.json
   - 包含路径配置
   - C++ 标准版本设置

5. **代码格式化**
   - .clang-format 配置
   - 格式化快捷键

### 5. 04-troubleshooting.md

**内容大纲：**

1. **容器启动问题**
   - Docker 未启动
   - 权限问题
   - 端口冲突

2. **扩展问题**
   - IntelliSense 不工作
   - 调试器连接失败
   - CMake 配置错误

3. **性能问题**
   - 容器运行缓慢
   - 文件系统挂载性能
   - 内存不足

4. **网络问题**
   - 网络代理配置
   - 包下载失败

5. **常见错误信息及解决方案**

## 与现有文档的关系

- **06-package-management.md**：包管理在容器内的使用（Conan/vcpkg）
- **07-cmake-guide.md**：CMake 在容器内的配置
- **a2-toolchain.md**：编译工具链背景知识

## 文档风格

- 遵循现有文档的 Markdown 格式
- 代码块使用语法高亮
- 包含实际可运行的配置示例
- 每个配置项附带注释说明
- 提供验证步骤确认配置正确

## 后续扩展

可选的后续内容：
- 多阶段构建优化镜像大小
- GPU 开发环境配置
- 远程开发场景