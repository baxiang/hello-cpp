# 4. 故障排除

本章汇总 Dev Container 开发环境中的常见问题及解决方案。

## 4.1 容器启动问题

### Docker Desktop 未运行

**错误信息：**
```
Cannot connect to the Docker daemon. Is the docker daemon running?
```

**解决方案：**

1. 确保 Docker Desktop 已启动
2. 检查 Docker 服务状态：

```bash
# macOS/Windows
# 打开 Docker Desktop 应用

# Linux
sudo systemctl status docker
sudo systemctl start docker
```

### 权限问题（Linux）

**错误信息：**
```
permission denied while trying to connect to the Docker daemon socket
```

**解决方案：**

```bash
# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新登录或执行
newgrp docker

# 验证
docker ps
```

### 镜像拉取失败

**错误信息：**
```
Error: failed to pull image "mcr.microsoft.com/devcontainers/cpp:..."
```

**解决方案：**

1. 检查网络连接
2. 配置镜像加速器（国内用户）：

```json
// Docker Desktop → Settings → Docker Engine
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

3. 使用代理：

```bash
# 设置 Docker 代理
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
```

### 容器构建超时

**错误信息：**
```
Error: context deadline exceeded
```

**解决方案：**

1. 增加构建超时时间：

```json
// devcontainer.json
{
  "build": {
    "dockerfile": "Dockerfile",
    "options": ["--network=host"]
  }
}
```

2. 使用国内镜像源：

```dockerfile
# Dockerfile 中使用国内镜像
FROM ubuntu:22.04

# 使用阿里云镜像源
RUN sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
```

### 端口冲突

**错误信息：**
```
Error: port is already allocated
```

**解决方案：**

1. 查找占用端口的进程：

```bash
# macOS/Linux
lsof -i :8080

# Windows
netstat -ano | findstr :8080
```

2. 修改 devcontainer.json 中的端口映射：

```json
{
  "forwardPorts": [8081]  // 改用其他端口
}
```

## 4.2 扩展问题

### IntelliSense 不工作

**症状：**
- 代码无高亮
- 无代码补全
- 红色波浪线错误

**解决方案：**

1. 检查 C/C++ 扩展是否安装：

```bash
code --list-extensions | grep cpptools
```

2. 重新加载窗口：`Cmd+Shift+P` → `Developer: Reload Window`

3. 检查 `c_cpp_properties.json` 配置：

```json
{
  "configurations": [
    {
      "name": "Linux",
      "compilerPath": "/usr/bin/g++",
      "cppStandard": "c++17",
      "intelliSenseMode": "linux-gcc-x64"
    }
  ]
}
```

4. 使用 CMake Tools 提供配置：

```json
// settings.json
{
  "C_Cpp.default.configurationProvider": "ms-vscode.cmake-tools"
}
```

5. 重建 IntelliSense 数据库：

`Cmd+Shift+P` → `C/C++: Reset IntelliSense Database`

### CMake 配置错误

**错误信息：**
```
CMake Error: Could not find CMAKE_C_COMPILER
```

**解决方案：**

1. 确保编译器已安装：

```bash
# 检查 GCC
g++ --version
gcc --version

# 检查 CMake
cmake --version
```

2. 在容器中安装编译器：

```dockerfile
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    gdb
```

3. 手动选择 CMake Kit：

`Cmd+Shift+P` → `CMake: Select a Kit`

### 扩展安装失败

**错误信息：**
```
Failed to install extension 'ms-vscode.cpptools'
```

**解决方案：**

1. 检查网络连接
2. 手动下载扩展 VSIX 文件：

```bash
# 从 VSCode 市场下载 .vsix 文件
# 然后手动安装
code --install-extension ms-vscode.cpptools-<version>.vsix
```

3. 在 devcontainer.json 中预装扩展：

```json
{
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode.cpptools"
      ]
    }
  }
}
```

### clangd 与 IntelliSense 冲突

**症状：**
- 重复的错误提示
- 性能下降

**解决方案：**

使用 clangd 时禁用 C/C++ IntelliSense：

```json
// settings.json
{
  "C_Cpp.intelliSenseEngine": "disabled",
  "C_Cpp.autocomplete": "disabled",
  "C_Cpp.errorSquiggles": "disabled"
}
```

## 4.3 调试问题

### 调试器连接失败

**错误信息：**
```
Could not load program '...'.  No such file or directory.
```

**解决方案：**

1. 确保程序已编译且包含调试信息：

```bash
g++ -g -o myprogram myprogram.cpp
```

2. 检查 `launch.json` 中的程序路径：

```json
{
  "program": "${workspaceFolder}/build/myprogram"
}
```

3. 使用变量确保路径正确：

```json
{
  "program": "${command:cmake.launchTargetPath}"
}
```

### 断点不命中

**可能原因：**

1. 代码优化导致断点无效
2. 源码路径不匹配
3. 调试信息缺失

**解决方案：**

1. 使用 Debug 模式编译：

```cmake
# CMakeLists.txt
set(CMAKE_BUILD_TYPE Debug)
set(CMAKE_CXX_FLAGS_DEBUG "-g -O0")
```

2. 检查源码路径映射：

```json
// launch.json
{
  "sourceFileMap": {
    "/build/src": "${workspaceFolder}/src"
  }
}
```

3. 验证调试信息：

```bash
# 检查可执行文件是否包含调试信息
file myprogram
readelf --debug-dump=myprogram | head
```

### GDB 无法调试

**错误信息：**
```
ptrace: Operation not permitted
```

**解决方案：**

在 `devcontainer.json` 中添加权限：

```json
{
  "runArgs": [
    "--cap-add=SYS_PTRACE",
    "--security-opt",
    "seccomp=unconfined"
  ]
}
```

或在 Dockerfile 中：

```dockerfile
# 使用 --privileged 标志（不推荐生产环境）
# 或添加 ptrace 权限
```

### LLDB 调试问题

**错误信息：**
```
lldb: command not found
```

**解决方案：**

1. 安装 LLDB：

```bash
# Ubuntu/Debian
apt-get install lldb

# macOS (已预装)
xcode-select --install
```

2. 使用 CodeLLDB 扩展：

```json
// launch.json
{
  "type": "lldb",
  "request": "launch",
  "name": "Debug",
  "program": "${workspaceFolder}/build/myprogram"
}
```

## 4.4 性能问题

### 容器运行缓慢

**可能原因：**

1. 资源分配不足
2. 文件系统性能问题
3. 网络代理影响

**解决方案：**

1. 增加 Docker 资源：

Docker Desktop → Settings → Resources

| 资源 | 推荐值 |
|------|--------|
| CPUs | 4+ |
| Memory | 8GB+ |
| Swap | 2GB |

2. 优化文件挂载：

```json
// devcontainer.json
{
  "mounts": [
    {
      "source": "my-volume",
      "target": "/workspace/build",
      "type": "volume"
    }
  ]
}
```

3. 使用命名卷存储构建产物：

```bash
# 创建命名卷
docker volume create build-cache

# 在 devcontainer.json 中挂载
{
  "mounts": [
    "source=build-cache,target=/workspace/build,type=volume"
  ]
}
```

### 文件系统性能差（macOS）

**解决方案：**

1. 使用 VirtioFS（Docker Desktop 4.6+）：

Docker Desktop → Settings → General → Use VirtioFS

2. 使用命名卷代替绑定挂载：

```json
{
  "mounts": [
    "source=${localEnv:HOME}/.cache,target=/home/vscode/.cache,type=bind,consistency=cached"
  ]
}
```

3. 将构建目录放在容器内：

```cmake
# CMakeLists.txt
set(CMAKE_BINARY_DIR ${CMAKE_SOURCE_DIR}/build)
```

### 内存不足

**错误信息：**
```
Process finished with exit code 137 (interrupted by signal 9: SIGKILL)
```

**解决方案：**

1. 增加 Docker 内存限制
2. 减少并行编译数：

```bash
cmake --build build --parallel 2  # 只用 2 个并行任务
```

3. 使用 swap：

```bash
# 创建 swap 文件（Linux）
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 4.5 网络问题

### 代理配置

**在容器内配置代理：**

```json
// devcontainer.json
{
  "containerEnv": {
    "HTTP_PROXY": "http://proxy.example.com:8080",
    "HTTPS_PROXY": "http://proxy.example.com:8080",
    "NO_PROXY": "localhost,127.0.0.1"
  }
}
```

**在 Dockerfile 中配置：**

```dockerfile
ENV HTTP_PROXY=http://proxy.example.com:8080
ENV HTTPS_PROXY=http://proxy.example.com:8080
```

### 包下载失败

**错误信息：**
```
E: Failed to fetch http://archive.ubuntu.com/...
```

**解决方案：**

1. 使用国内镜像源：

```dockerfile
# Ubuntu 镜像源
RUN sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list

# 或使用清华源
RUN sed -i 's/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
```

2. 配置 pip 镜像：

```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

3. 配置 Conan 镜像：

```bash
conan remote add conan-center https://mirrors.tuna.tsinghua.edu.cn/conan-center
```

### Git 克隆失败

**错误信息：**
```
fatal: unable to access 'https://github.com/...': Connection timed out
```

**解决方案：**

1. 配置 Git 代理：

```bash
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy http://proxy.example.com:8080
```

2. 使用 SSH 替代 HTTPS：

```bash
git remote set-url origin git@github.com:user/repo.git
```

## 4.6 其他问题

### Git 权限问题

**错误信息：**
```
fatal: detected dubious ownership in repository at '/workspace/...'
```

**解决方案：**

```bash
# 在容器内执行
git config --global --add safe.directory /workspace
```

或在 `devcontainer.json` 中：

```json
{
  "postStartCommand": "git config --global --add safe.directory ${containerWorkspaceFolder}"
}
```

### 文件权限问题

**症状：**
- 无法编辑文件
- 权限被拒绝

**解决方案：**

1. 使用正确的用户运行容器：

```json
// devcontainer.json
{
  "remoteUser": "vscode"
}
```

2. 修复文件权限：

```bash
# 在容器内执行
sudo chown -R vscode:vscode /workspace
```

### 容器时间不同步

**解决方案：**

```json
// devcontainer.json
{
  "runArgs": [
    "--privileged"
  ],
  "postStartCommand": "hwclock -s || true"
}
```

### 中文乱码

**解决方案：**

```dockerfile
# Dockerfile
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

RUN apt-get update && apt-get install -y locales \
    && locale-gen en_US.UTF-8 \
    && update-locale LANG=en_US.UTF-8
```

## 4.7 日志查看

### 查看 Dev Container 日志

1. 打开输出面板：`Cmd+Shift+U`
2. 选择 "Dev Containers" 或 "Remote - Containers"

### 查看 Docker 日志

```bash
# 查看容器日志
docker logs <container_id>

# 实时查看日志
docker logs -f <container_id>

# 查看构建日志
docker build --progress=plain .
```

### 查看 VSCode 日志

`Cmd+Shift+P` → `Developer: Open Logs Folder`

## 4.8 重置环境

如果问题无法解决，可以尝试重置：

### 重建容器

`Cmd+Shift+P` → `Dev Containers: Rebuild Container`

### 清理 Docker 资源

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的容器
docker container prune

# 清理未使用的卷
docker volume prune

# 完全清理（谨慎使用）
docker system prune -a --volumes
```

### 重置 VSCode 设置

删除 `.vscode` 目录并重新配置：

```bash
rm -rf .vscode
```

---

## 常见错误速查表

| 错误信息 | 可能原因 | 解决方案 |
|----------|----------|----------|
| `Cannot connect to Docker daemon` | Docker 未运行 | 启动 Docker Desktop |
| `permission denied` | 用户不在 docker 组 | `usermod -aG docker $USER` |
| `port is already allocated` | 端口被占用 | 修改端口或终止占用进程 |
| `failed to pull image` | 网络问题 | 配置镜像加速器 |
| `ptrace: Operation not permitted` | 缺少调试权限 | 添加 `--cap-add=SYS_PTRACE` |
| `exit code 137` | 内存不足 | 增加 Docker 内存限制 |
| `dubious ownership` | Git 安全目录问题 | `git config --global --add safe.directory` |
| `Could not find CMAKE_C_COMPILER` | 编译器未安装 | 安装 build-essential |