# 2. 配置文件示例

本章详细介绍 Dev Containers 的配置文件，包括 `devcontainer.json`、`Dockerfile` 和 `docker-compose.yml`。

## 2.1 项目结构

一个完整的 Dev Container 项目结构如下：

```
my-cpp-project/
├── .devcontainer/
│   ├── devcontainer.json    # 主配置文件（必需）
│   ├── Dockerfile           # 自定义镜像（可选）
│   └── docker-compose.yml   # 多容器配置（可选）
├── src/
│   └── main.cpp
├── CMakeLists.txt
└── README.md
```

## 2.2 devcontainer.json 配置

`devcontainer.json` 是 Dev Containers 的核心配置文件。

### 基础配置

最简单的配置，使用预构建镜像：

```json
{
  "name": "C++ Dev Container",
  "image": "mcr.microsoft.com/devcontainers/cpp:0-ubuntu-22.04"
}
```

### 完整配置示例

```json
{
  "name": "C++ Development Environment",

  // 方式一：使用预构建镜像
  "image": "mcr.microsoft.com/devcontainers/cpp:0-ubuntu-22.04",

  // 方式二：使用 Dockerfile（二选一）
  // "build": {
  //   "dockerfile": "Dockerfile",
  //   "context": ".."
  // },

  // 方式三：使用 docker-compose（二选一）
  // "dockerComposeFile": "docker-compose.yml",
  // "service": "development",
  // "workspaceFolder": "/workspace",

  // 安装开发工具和配置
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {
      "installZsh": true,
      "configureZshAsDefaultShell": true,
      "installOhMyZsh": true,
      "upgradePackages": true
    },
    "ghcr.io/devcontainers/features/git:1": {
      "version": "latest"
    },
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },

  // VSCode 设置
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode.cpptools",
        "ms-vscode.cmake-tools",
        "ms-vscode.cpptools-extension-pack"
      ],
      "settings": {
        "C_Cpp.default.compilerPath": "/usr/bin/g++",
        "C_Cpp.default.cStandard": "c17",
        "C_Cpp.default.cppStandard": "c++17",
        "C_Cpp.intelliSenseEngine": "default",
        "C_Cpp.errorSquiggles": "enabled",
        "editor.formatOnSave": true,
        "editor.tabSize": 4
      }
    }
  },

  // 容器创建后执行的命令
  "postCreateCommand": "cmake --version && g++ --version",

  // 容器启动后执行的命令
  "postStartCommand": "git config --global --add safe.directory ${containerWorkspaceFolder}",

  // 用户配置
  "remoteUser": "vscode",

  // 端口转发
  "forwardPorts": [8080],

  // 环境变量
  "containerEnv": {
    "MY_ENV_VAR": "value"
  },

  // 挂载卷
  "mounts": [
    "source=my-cpp-cache,target=/home/vscode/.cache,type=volume"
  ],

  // 运行参数
  "runArgs": [
    "--cap-add=SYS_PTRACE",
    "--security-opt",
    "seccomp=unconfined"
  ]
}
```

### 关键字段说明

| 字段 | 说明 |
|------|------|
| `name` | 容器名称，显示在 VSCode 状态栏 |
| `image` | 使用的 Docker 镜像 |
| `build.dockerfile` | 指定自定义 Dockerfile |
| `dockerComposeFile` | 使用 docker-compose 配置 |
| `features` | 安装额外开发工具 |
| `customizations.vscode.extensions` | 自动安装的 VSCode 扩展 |
| `customizations.vscode.settings` | 容器内的 VSCode 设置 |
| `postCreateCommand` | 容器创建后执行的命令 |
| `postStartCommand` | 容器每次启动执行的命令 |
| `remoteUser` | 容器内使用的用户名 |
| `forwardPorts` | 自动转发的端口 |

### 常用镜像选择

| 镜像 | 说明 |
|------|------|
| `mcr.microsoft.com/devcontainers/cpp:0-ubuntu-22.04` | Ubuntu 22.04 + GCC |
| `mcr.microsoft.com/devcontainers/cpp:0-debian-11` | Debian 11 + GCC |
| `mcr.microsoft.com/devcontainers/base:ubuntu-22.04` | 基础 Ubuntu 镜像 |
| `gcc:12` | 官方 GCC 镜像 |
| `clang:15` | 官方 Clang 镜像 |

## 2.3 Dockerfile 编写

当预构建镜像不能满足需求时，可以编写自定义 Dockerfile。

### 基础 Dockerfile

```dockerfile
# 使用官方 GCC 镜像作为基础
FROM gcc:12

# 设置工作目录
WORKDIR /workspace

# 安装常用开发工具
RUN apt-get update && apt-get install -y \
    cmake \
    gdb \
    valgrind \
    clang-format \
    clang-tidy \
    git \
    curl \
    wget \
    vim \
    && rm -rf /var/lib/apt/lists/*

# 安装 vcpkg（可选）
RUN git clone https://github.com/Microsoft/vcpkg.git /opt/vcpkg \
    && /opt/vcpkg/bootstrap-vcpkg.sh

ENV VCPKG_ROOT=/opt/vcpkg
ENV PATH="${VCPKG_ROOT}:${PATH}"

# 设置非 root 用户
ARG USERNAME=devuser
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

USER $USERNAME

# 设置默认命令
CMD ["/bin/bash"]
```

### 多阶段构建 Dockerfile

用于优化镜像大小：

```dockerfile
# 构建阶段
FROM gcc:12 AS builder

WORKDIR /build
COPY . .

RUN mkdir build && cd build \
    && cmake .. -DCMAKE_BUILD_TYPE=Release \
    && make -j$(nproc)

# 运行阶段
FROM ubuntu:22.04

WORKDIR /app

# 只复制必要的运行时文件
COPY --from=builder /build/build/myapp /app/

CMD ["./myapp"]
```

### 带 Conan 包管理的 Dockerfile

```dockerfile
FROM gcc:12

WORKDIR /workspace

# 安装 Python 和 Conan
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    cmake \
    gdb \
    && pip3 install conan \
    && rm -rf /var/lib/apt/lists/*

# 配置 Conan
RUN conan profile detect --force

# 创建非 root 用户
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && chown -R $USER_UID:$USER_GID /workspace

USER $USERNAME

CMD ["/bin/bash"]
```

## 2.4 docker-compose.yml 配置

当项目需要多个服务（如数据库）时，使用 docker-compose。

### 基础配置

```yaml
version: '3.8'

services:
  # 开发容器
  development:
    build:
      context: ..
      dockerfile: .devcontainer/Dockerfile
    volumes:
      - ..:/workspace:cached
    command: sleep infinity
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
    networks:
      - dev-network

  # 数据库服务
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - dev-network

networks:
  dev-network:

volumes:
  postgres-data:
```

### 对应的 devcontainer.json

```json
{
  "name": "C++ with PostgreSQL",
  "dockerComposeFile": "docker-compose.yml",
  "service": "development",
  "workspaceFolder": "/workspace",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode.cpptools",
        "ms-vscode.cmake-tools"
      ]
    }
  },
  "forwardPorts": [5432],
  "postCreateCommand": "cmake --version"
}
```

## 2.5 CMake 项目集成配置

### 完整项目示例

**项目结构：**

```
my-cmake-project/
├── .devcontainer/
│   ├── devcontainer.json
│   └── Dockerfile
├── src/
│   ├── main.cpp
│   └── utils.cpp
├── include/
│   └── utils.h
├── tests/
│   └── test_main.cpp
├── CMakeLists.txt
└── .clang-format
```

**devcontainer.json：**

```json
{
  "name": "CMake C++ Dev",
  "build": {
    "dockerfile": "Dockerfile"
  },
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode.cpptools",
        "ms-vscode.cmake-tools",
        "ms-vscode.cpptools-extension-pack",
        "xaver.clang-format"
      ],
      "settings": {
        "C_Cpp.default.configurationProvider": "ms-vscode.cmake-tools",
        "cmake.buildDirectory": "${workspaceFolder}/build",
        "cmake.configureOnOpen": true,
        "cmake.debugConfig": {
          "lldb": {
            "miDebuggerPath": "/usr/bin/gdb"
          }
        }
      }
    }
  },
  "postCreateCommand": "mkdir -p build && cd build && cmake ..",
  "remoteUser": "vscode"
}
```

**Dockerfile：**

```dockerfile
FROM mcr.microsoft.com/devcontainers/cpp:0-ubuntu-22.04

# 安装额外的开发工具
RUN apt-get update && apt-get install -y \
    ninja-build \
    lcov \
    && rm -rf /var/lib/apt/lists/*

# 配置 CMake 默认使用 Ninja
ENV CMAKE_GENERATOR=Ninja
```

## 2.6 配置验证

创建配置后，验证是否正确：

```bash
# 在项目根目录
cd my-cpp-project

# 用 VSCode 打开
code .

# 在 VSCode 中按 Cmd+Shift+P
# 选择 "Dev Containers: Reopen in Container"
# 观察输出日志，确认无错误

# 容器启动后，在终端验证
g++ --version
cmake --version
```

## 下一步

配置完成后，继续阅读 [03-vscode-setup.md](03-vscode-setup.md) 学习 VSCode C++ 扩展的详细配置。