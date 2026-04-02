# 3. vcpkg 使用指南

vcpkg 是微软开发的跨平台 C++ 包管理器，与 Visual Studio 集成良好，适合 Windows 项目和微软技术栈。

## 3.1 安装 vcpkg

### macOS / Linux 安装

```bash
# 克隆 vcpkg 仓库
git clone https://github.com/Microsoft/vcpkg.git

# 进入目录
cd vcpkg

# Bootstrap（初始化）
./bootstrap-vcpkg.sh

# 验证安装
./vcpkg --version
```

### Windows 安装

```powershell
# 克隆仓库
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg

# Bootstrap
.\bootstrap-vcpkg.bat

# 验证
.\vcpkg --version
```

### 推荐安装位置

```bash
# 推荐安装到固定位置
# macOS/Linux
mkdir -p ~/tools
git clone https://github.com/Microsoft/vcpkg.git ~/tools/vcpkg

# Windows
git clone https://github.com/Microsoft/vcpkg.git C:\tools\vcpkg
```

### 系统集成（可选）

```bash
# 集成到系统（一次即可）
./vcpkg integrate install

# 输出：
# Applied user-wide integration for this vcpkg root.
# CMake projects should use: "-DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake"
```

## 3.2 基本使用

### 安装包

```bash
# 安装单个包
./vcpkg install fmt

# 安装多个包
./vcpkg install fmt nlohmann-json boost

# 安装特定版本
./vcpkg install fmt:x64-linux@10.1.0

# 安装特定架构
./vcpkg install fmt:x64-windows
./vcpkg install fmt:x64-osx
./vcpkg install fmt:arm64-osx
```

### 搜索包

```bash
# 搜索包
./vcpkg search json

# 搜索特定名称
./vcpkg search nlohmann

# 查看包详情
./vcpkg show fmt
```

### 列出已安装包

```bash
# 列出所有已安装包
./vcpkg list

# 列出特定架构
./vcpkg list fmt:x64-linux
```

### 更新包

```bash
# 更新 vcpkg 本身
cd vcpkg
git pull
./bootstrap-vcpkg.sh

# 更新包数据库
./vcpkg upgrade

# 重新安装过时的包
./vcpkg upgrade --no-dry-run
```

### 移除包

```bash
# 移除包
./vcpkg remove fmt

# 移除包及其依赖
./vcpkg remove fmt --recurse

# 清理未使用的包
./vcpkg remove --outdated
```

## 3.3 清单模式（Manifest Mode）

清单模式使用 `vcpkg.json` 文件定义依赖，类似 npm 的 `package.json`。

### 创建 vcpkg.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My C++ project",
  "dependencies": [
    "fmt",
    "nlohmann-json",
    {
      "name": "boost",
      "features": ["filesystem", "system"]
    }
  ],
  "builtin-baseline": "2023.11.01"
}
```

### 字段说明

| 字段 | 说明 |
|------|------|
| `name` | 项目名称 |
| `version` | 项目版本 |
| `dependencies` | 依赖列表 |
| `features` | 包的特定功能 |
| `builtin-baseline` | 包版本基准日期 |

### 版本约束

```json
{
  "dependencies": [
    {
      "name": "fmt",
      "version>=": "10.1.0"
    },
    {
      "name": "nlohmann-json",
      "version>=": "3.11.0"
    }
  ]
}
```

### 使用清单模式

```bash
# 在项目根目录（包含 vcpkg.json）
# vcpkg 自动读取并安装依赖
cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake
cmake --build build
```

### 配置文件

清单模式会生成 `vcpkg_installed` 目录：

```
my-project/
├── vcpkg.json
├── vcpkg_installed/
│   ├── x64-linux/
│   │   ├── include/
│   │   └── lib/
│   └── vcpkg/
│       └── info/
└── build/
```

## 3.4 CMake 集成

### 方式一：工具链文件（推荐）

```bash
# 使用 vcpkg 工具链文件
cmake -S . -B build \
  -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake

cmake --build build
```

### 方式二：CMakePresets.json

```json
{
  "version": 3,
  "configurePresets": [
    {
      "name": "vcpkg",
      "hidden": true,
      "cacheVariables": {
        "CMAKE_TOOLCHAIN_FILE": "$env{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"
      }
    },
    {
      "name": "linux",
      "inherits": "vcpkg",
      "generator": "Ninja"
    }
  ]
}
```

```bash
# 设置环境变量
export VCPKG_ROOT=/path/to/vcpkg

# 使用预设
cmake --preset linux
cmake --build build
```

### 方式三：CMakeLists.txt 中设置

```cmake
cmake_minimum_required(VERSION 3.15)
project(MyProject)

# 设置工具链文件（需要在 project() 之前）
if(DEFINED ENV{VCPKG_ROOT} AND NOT DEFINED CMAKE_TOOLCHAIN_FILE)
    set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake")
endif()

find_package(fmt REQUIRED)
add_executable(myapp src/main.cpp)
target_link_libraries(myapp PRIVATE fmt::fmt)
```

## 3.5 常用包示例

### fmt

```json
// vcpkg.json
{
  "dependencies": ["fmt"]
}
```

```cmake
find_package(fmt REQUIRED)
target_link_libraries(myapp PRIVATE fmt::fmt)
```

### nlohmann-json

```json
{
  "dependencies": ["nlohmann-json"]
}
```

```cmake
find_package(nlohmann_json REQUIRED)
target_link_libraries(myapp PRIVATE nlohmann_json::nlohmann_json)
```

### Boost

```json
{
  "dependencies": [
    {
      "name": "boost",
      "features": ["filesystem", "system", "thread"]
    }
  ]
}
```

```cmake
find_package(Boost REQUIRED COMPONENTS filesystem system)
target_link_libraries(myapp PRIVATE Boost::filesystem Boost::system)
```

### OpenSSL

```json
{
  "dependencies": ["openssl"]
}
```

```cmake
find_package(OpenSSL REQUIRED)
target_link_libraries(myapp PRIVATE OpenSSL::SSL OpenSSL::Crypto)
```

### GoogleTest

```json
{
  "dependencies": ["gtest"]
}
```

```cmake
find_package(GTest REQUIRED)
target_link_libraries(tests PRIVATE GTest::gtest GTest::gtest_main)
```

## 3.6 三元组（Triplet）

三元组定义目标平台和架构。

### 常用三元组

| 三元组 | 说明 |
|--------|------|
| `x64-windows` | Windows 64位，动态链接 |
| `x64-windows-static` | Windows 64位，静态链接 |
| `x64-linux` | Linux 64位 |
| `x64-osx` | macOS 64位（Intel） |
| `arm64-osx` | macOS ARM（Apple Silicon） |

### 使用特定三元组

```bash
# 安装特定架构
./vcpkg install fmt:x64-windows-static

# 多架构安装
./vcpkg install fmt:x64-windows fmt:x64-windows-static
```

### 自定义三元组

```cmake
# 创建自定义三元组文件
# triplets/community/x64-linux-custom.cmake
set(VCPKG_TARGET_ARCHITECTURE x64)
set(VCPKG_CRT_LINKAGE dynamic)
set(VCPKG_LIBRARY_LINKAGE static)
set(VCPKG_BUILD_TYPE release)

# 使用自定义三元组
./vcpkg install fmt --triplet=x64-linux-custom
```

## 3.7 私有仓库

### 添加私有仓库

```bash
# 添加私有仓库
./vcpkg add-registry --name=myrepo --url=https://github.com/myorg/vcpkg-registry

# 或在 vcpkg-configuration.json 中配置
```

### vcpkg-configuration.json

```json
{
  "registries": [
    {
      "kind": "git",
      "repository": "https://github.com/myorg/vcpkg-registry",
      "baseline": "main",
      "packages": ["mylib", "myotherlib"]
    }
  ]
}
```

## 3.8 完整项目示例

```
my-vcpkg-project/
├── CMakeLists.txt
├── vcpkg.json
├── CMakePresets.json
├── src/
│   └── main.cpp
└── build/
```

**vcpkg.json：**
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": [
    "fmt",
    "nlohmann-json"
  ],
  "builtin-baseline": "2023.11.01"
}
```

**CMakeLists.txt：**
```cmake
cmake_minimum_required(VERSION 3.15)
project(MyProject LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)

find_package(fmt REQUIRED)
find_package(nlohmann_json REQUIRED)

add_executable(myapp src/main.cpp)
target_link_libraries(myapp PRIVATE fmt::fmt nlohmann_json::nlohmann_json)
```

**CMakePresets.json：**
```json
{
  "version": 3,
  "configurePresets": [
    {
      "name": "default",
      "binaryDir": "${sourceDir}/build",
      "cacheVariables": {
        "CMAKE_TOOLCHAIN_FILE": "$env{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake",
        "CMAKE_BUILD_TYPE": "Release"
      }
    }
  ],
  "buildPresets": [
    {
      "name": "default",
      "configurePreset": "default"
    }
  ]
}
```

**src/main.cpp：**
```cpp
#include <fmt/core.h>
#include <nlohmann/json.hpp>

int main() {
    nlohmann::json j = {{"name", "vcpkg"}};
    fmt::print("Hello from {}!\n", j["name"].get<std::string>());
    return 0;
}
```

**构建步骤：**
```bash
# 1. 设置环境变量
export VCPKG_ROOT=/path/to/vcpkg

# 2. 配置
cmake --preset default

# 3. 构建
cmake --build --preset default

# 4. 运行
./build/myapp
```

## 3.9 vcpkg vs Conan

| 特性 | vcpkg | Conan |
|------|-------|-------|
| 微软集成 | ✅ 完美 | 一般 |
| Visual Studio | ✅ 自动集成 | 需配置 |
| 二进制缓存 | ✅ | ✅ 更完善 |
| 清单模式 | ✅ | ✅ |
| 私有仓库 | ✅ | ✅ 更灵活 |
| 跨平台 | ✅ | ✅ 更完善 |
| 学习曲线 | 较低 | 中等 |

## 下一步

掌握 vcpkg 后，继续阅读 [05-best-practices.md](05-best-practices.md) 学习最佳实践。