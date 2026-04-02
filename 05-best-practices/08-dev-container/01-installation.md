# 1. 环境安装与配置

本章介绍如何安装和配置容器化 C++ 开发环境所需的软件。

## 1.1 Docker Desktop 安装

Docker Desktop 是 Docker 官方提供的桌面版容器运行环境，支持 macOS、Windows 和 Linux。

### macOS 安装

**方式一：官网下载（推荐）**

1. 访问 [Docker Desktop 官网](https://www.docker.com/products/docker-desktop/)
2. 下载 macOS 版本（Intel 芯片选 "Intel chip"，Apple Silicon 选 "Apple Silicon"）
3. 双击下载的 `.dmg` 文件
4. 将 Docker 图标拖到 Applications 文件夹
5. 打开 Docker Desktop，完成初始化设置

**方式二：Homebrew 安装**

```bash
# 安装 Docker Desktop
brew install --cask docker

# 启动 Docker Desktop（首次需要手动打开并授权）
open /Applications/Docker.app
```

**验证安装：**

```bash
# 检查 Docker 版本
docker --version
# 输出示例: Docker version 24.0.6, build ed223bc

# 检查 Docker 是否运行
docker info
```

### Windows 安装

**前置要求：**
- Windows 10 64位（版本 2004+）或 Windows 11
- 启用 WSL 2（Windows Subsystem for Linux）

**安装步骤：**

1. 启用 WSL 2（管理员权限运行 PowerShell）：

```powershell
# 启用 WSL
wsl --install

# 或手动启用
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 重启后设置 WSL 2 为默认版本
wsl --set-default-version 2
```

2. 下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)

3. 安装时选择 "Use WSL 2 instead of Hyper-V"

4. 完成安装后重启电脑

**验证安装：**

```powershell
docker --version
docker run hello-world
```

### Linux 安装

以 Ubuntu 为例：

```bash
# 更新包索引
sudo apt-get update

# 安装依赖
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 添加 Docker 官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 添加 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 将当前用户添加到 docker 组（免 sudo 运行 docker）
sudo usermod -aG docker $USER

# 重新登录后验证
docker --version
```

### Docker Desktop 配置建议

安装后建议进行以下配置：

**资源分配：**

打开 Docker Desktop → Settings → Resources：

| 资源 | 推荐设置 |
|------|----------|
| CPUs | 4 或更多 |
| Memory | 8 GB 或更多 |
| Swap | 2 GB |
| Disk image size | 64 GB |

**国内镜像加速（可选）：**

Settings → Docker Engine，添加镜像源：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

## 1.2 Visual Studio Code 安装

VSCode 是微软开发的免费、开源代码编辑器，对 C++ 开发有良好支持。

### macOS 安装

```bash
# Homebrew 安装
brew install --cask visual-studio-code

# 或官网下载
# https://code.visualstudio.com/
```

### Windows 安装

1. 访问 [VSCode 官网](https://code.visualstudio.com/)
2. 下载 Windows 版本
3. 安装时建议勾选：
   - 添加到 PATH
   - 添加"通过 Code 打开"到右键菜单

### Linux 安装

```bash
# Ubuntu/Debian
sudo snap install code --classic

# 或通过 apt
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install code
```

### 验证安装

```bash
# 命令行启动 VSCode
code --version
# 输出示例: 1.82.0

# 打开当前目录
code .
```

## 1.3 Dev Containers 扩展安装

Dev Containers 扩展允许 VSCode 在 Docker 容器中运行开发环境。

### 安装步骤

1. 打开 VSCode
2. 按 `Cmd+Shift+X` (macOS) 或 `Ctrl+Shift+X` (Windows/Linux) 打开扩展面板
3. 搜索 "Dev Containers"
4. 安装由 Microsoft 发布的 **Dev Containers** 扩展

**扩展 ID：** `ms-vscode-remote.remote-containers`

**命令行安装：**

```bash
code --install-extension ms-vscode-remote.remote-containers
```

### 相关扩展（推荐一并安装）

```bash
# C/C++ 扩展（必装）
code --install-extension ms-vscode.cpptools

# CMake 工具
code --install-extension ms-vscode.cmake-tools

# C/C++ 扩展包（包含多个实用扩展）
code --install-extension ms-vscode.cpptools-extension-pack
```

### 验证安装

1. 按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
2. 输入 `Dev Containers`
3. 应该能看到 Dev Containers 相关命令列表

## 1.4 完整安装验证

创建一个简单的测试项目验证环境：

```bash
# 创建测试目录
mkdir -p ~/test-cpp-devcontainer/.devcontainer
cd ~/test-cpp-devcontainer

# 创建 devcontainer.json
cat > .devcontainer/devcontainer.json << 'EOF'
{
  "name": "C++ Test",
  "image": "mcr.microsoft.com/devcontainers/cpp:0-ubuntu-22.04"
}
EOF

# 创建简单的 C++ 文件
cat > main.cpp << 'EOF'
#include <iostream>

int main() {
    std::cout << "Hello from Dev Container!" << std::endl;
    return 0;
}
EOF

# 用 VSCode 打开
code .
```

在 VSCode 中：

1. 按 `Cmd+Shift+P`
2. 选择 `Dev Containers: Reopen in Container`
3. 等待容器构建（首次可能需要几分钟）
4. 在容器内打开终端：`Ctrl+``
5. 编译运行：

```bash
g++ -o main main.cpp
./main
# 输出: Hello from Dev Container!
```

如果看到正确输出，说明环境配置成功！

## 1.5 常见安装问题

### Docker Desktop 无法启动

**macOS：**
- 检查是否授权 Docker Desktop 系统扩展
- 系统偏好设置 → 安全性与隐私 → 允许 Docker

**Windows：**
- 确保 WSL 2 已正确安装
- 确保 Hyper-V 或 WSL 2 后端已启用
- 尝试在 BIOS 中启用虚拟化（VT-x/AMD-V）

**Linux：**
- 确保 Docker 服务已启动：`sudo systemctl start docker`
- 检查用户是否在 docker 组：`groups $USER`

### Dev Containers 命令不可用

- 确认 Docker Desktop 正在运行
- 确认 Dev Containers 扩展已正确安装
- 尝试重新加载 VSCode：`Cmd+Shift+P` → `Developer: Reload Window`

### 容器构建失败

- 检查网络连接，确保能访问 Docker Hub
- 尝试配置镜像加速器
- 查看 Docker Desktop 日志排查问题

更多问题请参考 [04-troubleshooting.md](04-troubleshooting.md)。

## 下一步

环境安装完成后，继续阅读 [02-configuration.md](02-configuration.md) 学习如何配置开发容器。