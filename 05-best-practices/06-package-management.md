# 包管理

C++ 长期以来缺乏官方的包管理工具，但近年来出现了多个优秀的第三方包管理器。本章介绍现代 C++ 包管理的常用工具和最佳实践。

## 为什么需要包管理

在没有包管理器之前，C++ 项目的依赖管理通常很痛苦：

- 手动下载源代码并编译
- 配置复杂的头文件搜索路径
- 处理依赖的依赖（传递依赖）
- 管理不同版本的库
- 跨平台共享依赖配置

包管理器可以自动解决这些问题。

## 主流 C++ 包管理器

### 1. Conan

**Conan** 是目前最流行的 C/C++ 包管理器，跨平台支持好，包数量多。

#### 安装

```bash
# 使用 pip 安装
pip install conan

# 或使用 Homebrew（macOS）
brew install conan

# 验证安装
conan --version
```

#### 基本使用

```bash
# 初始化配置（首次使用）
conan profile detect

# 创建 conanfile.txt 定义依赖
# 内容示例：
# [requires]
# nlohmann_json/3.11.2
# fmt/10.1.0
#
# [generators]
# CMakeDeps
# CMakeToolchain
```

#### 与 CMake 集成

```cmake
cmake_minimum_required(VERSION 3.15)
project(MyProject)

# 使用 Conan 生成的配置
include(${CMAKE_BINARY_DIR}/conan_toolchain.cmake)

add_executable(myapp src/main.cpp)

# 链接 Conan 管理的依赖
find_package(nlohmann_json REQUIRED)
find_package(fmt REQUIRED)

target_link_libraries(myapp PRIVATE nlohmann_json::nlohmann_json fmt::fmt)
```

```bash
# 安装依赖
conan install . --output-folder=build --build=missing

# 构建项目
cmake -S . -B build
cmake --build build
```

#### 发布自己的包

```python
# conanfile.py 示例
from conan import ConanFile
from conan.tools.cmake import CMakeToolchain, CMake, cmake_layout

class MyLibConan(ConanFile):
    name = "mylib"
    version = "1.0.0"
    license = "MIT"
    author = "Your Name"
    url = "https://github.com/yourname/mylib"
    description = "A sample C++ library"
    topics = ("utility", "cpp")
    settings = "os", "compiler", "build_type", "arch"
    generators = "CMakeDeps", "CMakeToolchain"

    def build(self):
        cmake = CMake(self)
        cmake.configure()
        cmake.build()

    def package(self):
        cmake = CMake(self)
        cmake.install()
```

---

### 2. vcpkg

**vcpkg** 是微软开发的跨平台包管理器，与 Visual Studio 集成好。

#### 安装

```bash
# macOS / Linux
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
./bootstrap-vcpkg.sh

# Windows (PowerShell)
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
.\bootstrap-vcpkg.bat
```

#### 基本使用

```bash
# 安装依赖
./vcpkg install fmt nlohmann-json

# 集成到系统（只需执行一次）
./vcpkg integrate install

# 搜索包
./vcpkg search json
```

#### 与 CMake 集成

```bash
# 使用 vcpkg 工具链文件
cmake -S . -B build \
  -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake
cmake --build build
```

或使用环境变量：

```bash
export CMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake
```

#### vcpkg.json 配置

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": [
    "fmt",
    "nlohmann-json",
    {
      "name": "boost",
      "features": ["system", "filesystem"]
    }
  ],
  "builtin-baseline": "latest"
}
```

---

### 3. CMake FetchContent（轻量级方案）

如果不想引入外部包管理器，可以使用 CMake 的 FetchContent 模块直接获取依赖。

```cmake
cmake_minimum_required(VERSION 3.14)
project(MyProject)

include(FetchContent)

# 获取 nlohmann_json
FetchContent_Declare(
  nlohmann_json
  GIT_REPOSITORY https://github.com/nlohmann/json.git
  GIT_TAG        v3.11.2
)
FetchContent_MakeAvailable(nlohmann_json)

# 获取 fmt
FetchContent_Declare(
  fmt
  GIT_REPOSITORY https://github.com/fmtlib/fmt.git
  GIT_TAG        10.1.0
)
FetchContent_MakeAvailable(fmt)

add_executable(myapp src/main.cpp)
target_link_libraries(myapp PRIVATE nlohmann_json::nlohmann_json fmt::fmt)
```

**优点：**
- 无需额外工具
- 配置简单

**缺点：**
- 每次构建可能需要重新下载
- 没有二进制缓存
- 依赖冲突需手动处理

---

## 包管理器对比

| 特性 | Conan | vcpkg | FetchContent |
|------|-------|-------|--------------|
| 包数量 | 大量 | 大量 | 无限制 |
| 二进制缓存 | 支持 | 支持 | 不支持 |
| 跨平台 | 优秀 | 良好 | 依赖 CMake |
| 学习曲线 | 中等 | 较低 | 低 |
| 社区活跃度 | 高 | 高 | - |
| 适合场景 | 商业项目、复杂依赖 | Windows 项目、微软生态 | 小型项目、简单依赖 |

---

## 最佳实践建议

### 1. 选择合适的包管理器

- **小型项目/库**：优先使用 FetchContent
- **商业项目/复杂依赖**：使用 Conan 或 vcpkg
- **Windows 为主**：vcpkg 是不错的选择
- **跨平台团队**：Conan 更灵活

### 2. 锁定依赖版本

避免使用 `latest`，明确指定版本号：

```cmake
# 好的做法
FetchContent_Declare(
  fmt
  GIT_TAG 10.1.0  # 具体版本
)

# 避免这样做
FetchContent_Declare(
  fmt
  GIT_TAG main  # 可能随时变化
)
```

### 3. 使用 lockfile

Conan 和 vcpkg 都支持锁定依赖版本：

```bash
# Conan 锁
conan lock create conanfile.py
conan install --lockfile=conan.lock

# vcpkg 清单模式（自动锁定）
# 使用 vcpkg.json 即可
```

### 4. 在 CI/CD 中使用缓存

```yaml
# GitHub Actions 示例
- name: Cache Conan packages
  uses: actions/cache@v3
  with:
    path: ~/.conan2/p
    key: ${{ runner.os }}-conan-${{ hashFiles('**/conanfile.txt') }}
```

---

## 快速开始示例

以下是一个使用 Conan + CMake 的完整项目结构：

```
my-project/
├── CMakeLists.txt
├── conanfile.txt
├── src/
│   └── main.cpp
└── README.md
```

**conanfile.txt**
```ini
[requires]
nlohmann_json/3.11.2
fmt/10.1.0

[generators]
CMakeDeps
CMakeToolchain
```

**CMakeLists.txt**
```cmake
cmake_minimum_required(VERSION 3.15)
project(MyProject LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)

include(${CMAKE_BINARY_DIR}/conan_toolchain.cmake)
find_package(nlohmann_json REQUIRED)
find_package(fmt REQUIRED)

add_executable(myapp src/main.cpp)
target_link_libraries(myapp PRIVATE nlohmann_json::nlohmann_json fmt::fmt)
```

**src/main.cpp**
```cpp
#include <nlohmann/json.hpp>
#include <fmt/core.h>

int main() {
    nlohmann::json j = {{"name", "world"}};
    fmt::print("Hello, {}!\n", j["name"].get<std::string>());
    return 0;
}
```

**构建命令**
```bash
mkdir build && cd build
conan install .. --build=missing
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake
cmake --build .
./myapp
```

---

## 总结

现代 C++ 包管理已经非常成熟，推荐：

1. 新项目从开始就使用包管理器
2. 团队内部统一选择一种包管理器
3. 锁定依赖版本，确保可重现性
4. 在 CI/CD 中利用缓存加速构建

合适的包管理工具可以大幅提升开发效率和项目的可维护性。
