# 2. Conan 使用指南

Conan 是目前最流行的 C/C++ 包管理器，跨平台支持好，包数量多，适合商业项目和复杂依赖场景。

## 2.1 安装 Conan

### 使用 pip 安装（推荐）

```bash
# 安装 Conan
pip install conan

# 验证安装
conan --version
# 输出: Conan version 2.x.x
```

### 其他安装方式

```bash
# macOS - Homebrew
brew install conan

# Windows - Chocolatey
choco install conan

# Linux - apt (部分发行版)
sudo apt install conan
```

### 版本说明

Conan 有两个主要版本：
- **Conan 1.x**：旧版本，部分项目仍在使用
- **Conan 2.x**：新版本，推荐使用

```bash
# 检查版本
conan --version

# 如果需要 Conan 1.x
pip install conan==1.60.0
```

## 2.2 初始配置

### Profile 配置

Conan 使用 profile 定义编译环境：

```bash
# 自动检测并创建默认 profile
conan profile detect

# 查看当前 profile
conan profile show default
```

**输出示例：**
```
[settings]
os=Linux
arch=x86_64
compiler=gcc
compiler.version=11
compiler.libcxx=libstdc++11
build_type=Release
```

### 手动创建 Profile

```bash
# 创建自定义 profile
conan profile new myprofile

# 编辑 profile
conan profile edit myprofile
```

**Profile 文件内容：**
```ini
[settings]
os=Linux
arch=x86_64
compiler=gcc
compiler.version=11
compiler.libcxx=libstdc++11
build_type=Release

[conf]
tools.cmake.cmaketoolchain:system_name=Linux
```

### 多 Profile 管理

```bash
# Debug profile
conan profile new debug
conan profile set debug settings.build_type=Debug

# Release profile
conan profile new release
conan profile set release settings.build_type=Release

# 使用特定 profile
conan install . --profile=debug
```

## 2.3 定义依赖

### conanfile.txt（简单项目）

```ini
[requires]
# 定义依赖包
fmt/10.1.0
nlohmann_json/3.11.2
boost/1.81.0

[generators]
# 生成 CMake 配置文件
CMakeDeps
CMakeToolchain

[layout]
# 使用 CMake 标准布局
cmake_layout
```

### conanfile.py（复杂项目）

```python
from conan import ConanFile
from conan.tools.cmake import CMakeToolchain, cmake_layout

class MyProjectConan(ConanFile):
    # 项目信息
    name = "myproject"
    version = "1.0.0"
    license = "MIT"
    author = "Your Name"
    description = "My C++ project"

    # 编译配置
    settings = "os", "compiler", "build_type", "arch"
    generators = "CMakeDeps", "CMakeToolchain"

    # 依赖定义
    requirements = [
        "fmt/10.1.0",
        "nlohmann_json/3.11.2",
    ]

    # 可选依赖
    options = {"with_ssl": [True, False]}
    default_options = {"with_ssl": False}

    def requirements(self):
        if self.options.with_ssl:
            self.requires("openssl/3.1.0")

    def layout(self):
        cmake_layout(self)
```

## 2.4 安装依赖

### 基本安装

```bash
# 安装依赖到 build 目录
conan install . --output-folder=build --build=missing

# 使用特定 profile
conan install . --profile=debug --output-folder=build

# 指定构建类型
conan install . --settings=build_type=Debug
```

### 安装选项

| 选项 | 说明 |
|------|------|
| `--output-folder` | 输出目录 |
| `--build=missing` | 构建缺失的二进制包 |
| `--profile` | 使用特定 profile |
| `--settings` | 覆盖 settings |
| `--options` | 设置包选项 |

### 生成文件

安装后生成的文件：

```
build/
├── conan_toolchain.cmake    # CMake 工具链文件
├── CMakeUserPresets.json    # CMake 预设文件
├── fmt-config.cmake         # fmt 包配置
├── nlohmann_json-config.cmake
└── graph_info.json          # 依赖图信息
```

## 2.5 CMake 集成

### 方式一：使用工具链文件

```cmake
cmake_minimum_required(VERSION 3.15)
project(MyProject LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)

# Conan 生成的工具链文件会自动处理依赖路径
# 无需手动 include，通过 CMAKE_TOOLCHAIN_FILE 传入

add_executable(myapp src/main.cpp)

# 使用 find_package 查找 Conan 安装的包
find_package(fmt REQUIRED)
find_package(nlohmann_json REQUIRED)

target_link_libraries(myapp PRIVATE
    fmt::fmt
    nlohmann_json::nlohmann_json
)
```

**构建命令：**
```bash
# 安装依赖
conan install . --output-folder=build --build=missing

# 配置 CMake（使用 Conan 工具链）
cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=build/conan_toolchain.cmake

# 构建
cmake --build build
```

### 方式二：使用 CMake 预设

Conan 2.x 会生成 `CMakeUserPresets.json`：

```bash
# 安装依赖
conan install . --output-folder=build --build=missing

# 使用预设配置
cmake --preset conan-default

# 构建
cmake --build --preset conan-release
```

### 方式三：layout 方式（推荐）

```python
# conanfile.py
def layout(self):
    cmake_layout(self)
```

```bash
# Conan 自动处理路径
conan install . --build=missing
cmake --preset conan-default
cmake --build --preset conan-release
```

## 2.6 常用包示例

### fmt（格式化库）

```ini
[requires]
fmt/10.1.0
```

```cpp
#include <fmt/core.h>

int main() {
    fmt::print("Hello, {}!\n", "world");
    return 0;
}
```

### nlohmann_json（JSON 库）

```ini
[requires]
nlohmann_json/3.11.2
```

```cpp
#include <nlohmann/json.hpp>

int main() {
    nlohmann::json j = {"name", "value"};
    std::cout << j << std::endl;
    return 0;
}
```

### Boost

```ini
[requires]
boost/1.81.0
```

```cmake
find_package(boost REQUIRED)
target_link_libraries(myapp PRIVATE boost::headers)
```

### OpenSSL

```ini
[requires]
openssl/3.1.0
```

```cmake
find_package(openssl REQUIRED)
target_link_libraries(myapp PRIVATE openssl::ssl openssl::crypto)
```

## 2.7 搜索和查看包

### 搜索包

```bash
# 在 Conan Center 搜索
conan search fmt

# 搜索所有版本
conan search fmt --remote=conancenter

# 搜索关键字
conan search json
```

### 查看包信息

```bash
# 查看包详情
conan inspect fmt/10.1.0

# 查看包选项
conan inspect fmt/10.1.0 --options

# 查看包依赖
conan inspect fmt/10.1.0 --requires
```

### Conan Center

Conan Center 是官方包仓库：https://conan.io/center/

包含大量常用库：
- fmt、spdlog（日志）
- nlohmann_json（JSON）
- boost、openssl（通用库）
- google-test、catch2（测试）

## 2.8 发布自己的包

### 创建 conanfile.py

```python
from conan import ConanFile
from conan.tools.cmake import CMake, CMakeToolchain, cmake_layout
from conan.tools.files import copy

class MyLibConan(ConanFile):
    name = "mylib"
    version = "1.0.0"
    license = "MIT"
    author = "Your Name"
    url = "https://github.com/yourname/mylib"
    description = "My C++ library"

    settings = "os", "compiler", "build_type", "arch"
    options = {"shared": [True, False]}
    default_options = {"shared": False}

    generators = "CMakeDeps", "CMakeToolchain"

    def layout(self):
        cmake_layout(self)

    def source(self):
        # 获取源码（如果从 Git）
        self.run("git clone https://github.com/yourname/mylib.git")

    def generate(self):
        tc = CMakeToolchain(self)
        tc.generate()

    def build(self):
        cmake = CMake(self)
        cmake.configure()
        cmake.build()

    def package(self):
        cmake = CMake(self)
        cmake.install()

        # 或手动复制文件
        copy(self, "*.h", dst=self.package_info.include_dir, src="include")
        copy(self, "*.lib", dst=self.package_info.lib_dir, keep_path=False)
        copy(self, "*.a", dst=self.package_info.lib_dir, keep_path=False)

    def package_info(self):
        self.cpp_info.libs = ["mylib"]
```

### 创建包

```bash
# 在包目录执行
conan create .
```

### 上传到仓库

```bash
# 添加远程仓库
conan remote add myrepo https://myrepo.com

# 上传包
conan upload mylib/1.0.0 --remote=myrepo
```

## 2.9 锁定依赖版本

### 创建 lockfile

```bash
# 生成 lockfile
conan lock create conanfile.py --lockfile-out=conan.lock

# 使用 lockfile 安装
conan install . --lockfile=conan.lock
```

### lockfile 内容

```json
{
  "requires": [
    {
      "ref": "fmt/10.1.0",
      "package_id": "..."
    },
    {
      "ref": "nlohmann_json/3.11.2",
      "package_id": "..."
    }
  ]
}
```

## 2.10 完整项目示例

```
my-conan-project/
├── CMakeLists.txt
├── conanfile.txt
├── src/
│   └── main.cpp
└── build/
```

**conanfile.txt：**
```ini
[requires]
fmt/10.1.0
nlohmann_json/3.11.2

[generators]
CMakeDeps
CMakeToolchain

[layout]
cmake_layout
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

**src/main.cpp：**
```cpp
#include <fmt/core.h>
#include <nlohmann/json.hpp>

int main() {
    nlohmann::json j = {{"name", "Conan"}};
    fmt::print("Hello from {}!\n", j["name"].get<std::string>());
    return 0;
}
```

**构建步骤：**
```bash
# 1. 安装依赖
conan install . --output-folder=build --build=missing

# 2. 配置
cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=build/conan_toolchain.cmake

# 3. 构建
cmake --build build

# 4. 运行
./build/myapp
```

## 下一步

掌握 Conan 后，继续阅读 [05-best-practices.md](05-best-practices.md) 学习最佳实践。