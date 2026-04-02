# 4. FetchContent 使用

FetchContent 是 CMake 3.11+ 内置的模块，可以直接从 Git 仓库或 URL 下载依赖，无需额外工具。

## 4.1 FetchContent 基础

### 基本用法

```cmake
cmake_minimum_required(VERSION 3.14)
project(MyProject)

include(FetchContent)

# 声明依赖
FetchContent_Declare(
    fmt
    GIT_REPOSITORY https://github.com/fmtlib/fmt.git
    GIT_TAG        10.1.0
)

# 下载并使其可用
FetchContent_MakeAvailable(fmt)

# 使用
add_executable(myapp main.cpp)
target_link_libraries(myapp PRIVATE fmt::fmt)
```

### 工作流程

```
配置阶段：
1. FetchContent_Declare 声明依赖
2. FetchContent_MakeAvailable 下载并配置

构建阶段：
3. 编译下载的依赖
4. 链接到主项目
```

### 下载位置

默认下载到 `_deps` 目录：

```
build/
└── _deps/
    └── fmt-src/       # 源码
    └── fmt-build/     # 构建产物
    └── fmt-subbuild/  # 子项目构建
```

可自定义下载位置：

```cmake
set(FETCHCONTENT_BASE_DIR ${CMAKE_SOURCE_DIR}/external)
FetchContent_MakeAvailable(fmt)
```

## 4.2 FetchContent_Declare 参数

### Git 仓库

```cmake
FetchContent_Declare(
    mylib
    GIT_REPOSITORY https://github.com/user/mylib.git
    GIT_TAG        v1.0.0        # 标签
    GIT_TAG        main          # 分支
    GIT_TAG        a1b2c3d       # 提交哈希
)
```

### URL 下载

```cmake
FetchContent_Declare(
    mylib
    URL      https://example.com/mylib-1.0.tar.gz
    URL_HASH SHA256=abc123...
)
```

### 本地路径

```cmake
FetchContent_Declare(
    mylib
    SOURCE_DIR /path/to/local/mylib
)
```

### 完整参数

```cmake
FetchContent_Declare(
    mylib
    GIT_REPOSITORY https://github.com/user/mylib.git
    GIT_TAG        v1.0.0
    GIT_SHALLOW    TRUE          # 浅克隆（推荐）
    GIT_PROGRESS   TRUE          # 显示进度
    TIMEOUT        60            # 超时时间（秒）
    SOURCE_DIR     ${CMAKE_SOURCE_DIR}/external/mylib  # 源码目录
    BINARY_DIR     ${CMAKE_BINARY_DIR}/external/mylib-build
)
```

## 4.3 常用库示例

### fmt（格式化库）

```cmake
FetchContent_Declare(
    fmt
    GIT_REPOSITORY https://github.com/fmtlib/fmt.git
    GIT_TAG        10.1.0
)
FetchContent_MakeAvailable(fmt)

target_link_libraries(myapp PRIVATE fmt::fmt)
```

```cpp
#include <fmt/core.h>

int main() {
    fmt::print("Hello, {}!\n", "world");
    return 0;
}
```

### nlohmann_json（JSON 库）

```cmake
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG        v3.11.2
)
FetchContent_MakeAvailable(json)

target_link_libraries(myapp PRIVATE nlohmann_json::nlohmann_json)
```

```cpp
#include <nlohmann/json.hpp>

int main() {
    nlohmann::json j = {{"key", "value"}};
    std::cout << j << std::endl;
    return 0;
}
```

### spdlog（日志库）

```cmake
FetchContent_Declare(
    spdlog
    GIT_REPOSITORY https://github.com/gabime/spdlog.git
    GIT_TAG        v1.12.0
)
FetchContent_MakeAvailable(spdlog)

target_link_libraries(myapp PRIVATE spdlog::spdlog)
```

```cpp
#include <spdlog/spdlog.h>

int main() {
    spdlog::info("Hello, world!");
    return 0;
}
```

### GoogleTest

```cmake
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG        v1.14.0
)
# Windows: 防止覆盖编译器设置
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()
add_executable(tests test_main.cpp)
target_link_libraries(tests PRIVATE gtest_main)

include(GoogleTest)
gtest_discover_tests(tests)
```

### Catch2

```cmake
FetchContent_Declare(
    catch2
    GIT_REPOSITORY https://github.com/catchorg/Catch2.git
    GIT_TAG        v3.5.0
)
FetchContent_MakeAvailable(catch2)

add_executable(tests test_main.cpp)
target_link_libraries(tests PRIVATE Catch2::Catch2)
```

### Boost（部分）

```cmake
# Boost 较大，建议使用 Conan/vcpkg
# 但可以单独获取某些组件

FetchContent_Declare(
    boost-cmake
    GIT_REPOSITORY https://github.com/boostorg/cmake.git
    GIT_TAG        main
)
```

## 4.4 多依赖管理

### 批量声明

```cmake
include(FetchContent)

FetchContent_Declare(
    fmt
    GIT_REPOSITORY https://github.com/fmtlib/fmt.git
    GIT_TAG        10.1.0
)

FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG        v3.11.2
)

FetchContent_Declare(
    spdlog
    GIT_REPOSITORY https://github.com/gabime/spdlog.git
    GIT_TAG        v1.12.0
)

# 批量下载
FetchContent_MakeAvailable(fmt json spdlog)

target_link_libraries(myapp PRIVATE
    fmt::fmt
    nlohmann_json::nlohmann_json
    spdlog::spdlog
)
```

### 依赖顺序

```cmake
# 如果依赖之间有依赖关系，按顺序声明
FetchContent_Declare(depA ...)
FetchContent_Declare(depB ...)  # depB 可能依赖 depA

FetchContent_MakeAvailable(depA depB)
```

## 4.5 高级用法

### 条件下载

```cmake
option(USE_EXTERNAL_FMT "Use external fmt" OFF)

if(USE_EXTERNAL_FMT)
    find_package(fmt REQUIRED)
else()
    FetchContent_Declare(fmt ...)
    FetchContent_MakeAvailable(fmt)
endif()

target_link_libraries(myapp PRIVATE fmt::fmt)
```

### 配置下载的库

```cmake
FetchContent_Declare(
    mylib
    GIT_REPOSITORY https://github.com/user/mylib.git
    GIT_TAG        v1.0.0
)

# 在 MakeAvailable 前设置选项
set(MYLIB_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(MYLIB_ENABLE_FEATURE ON CACHE BOOL "" FORCE)

FetchContent_MakeAvailable(mylib)
```

### 排除目标

```cmake
FetchContent_Declare(
    mylib
    GIT_REPOSITORY https://github.com/user/mylib.git
    GIT_TAG        v1.0.0
)
FetchContent_MakeAvailable(mylib)

# 排除不需要的目标
set_target_properties(mylib_tests PROPERTIES EXCLUDE_FROM_ALL TRUE)
```

### 获取下载信息

```cmake
FetchContent_GetProperties(fmt)
if(NOT fmt_POPULATED)
    FetchContent_Populate(fmt)
endif()

# 使用源码路径
message(STATUS "fmt source: ${fmt_SOURCE_DIR}")
```

## 4.6 FetchContent vs 包管理器

### 优点

| 优点 | 说明 |
|------|------|
| 无需额外工具 | CMake 内置 |
| 配置简单 | 几行代码即可 |
| 版本控制 | GIT_TAG 锁定版本 |
| 灵活性高 | 任意 Git 仓库 |

### 缺点

| 缺点 | 说明 |
|------|------|
| 无二进制缓存 | 每次重新编译 |
| 无传递依赖 | 需手动处理 |
| 首次构建慢 | 需下载编译 |
| 无版本冲突检测 | 可能冲突 |

### 适用场景

- 小型项目
- 依赖少于 3 个
- 快速原型开发
- 不在 Conan/vcpkg 仓库的库

## 4.7 最佳实践

### 锁定版本

```cmake
# 好的做法：使用具体版本
FetchContent_Declare(
    fmt
    GIT_TAG 10.1.0
)

# 避免：使用分支名
FetchContent_Declare(
    fmt
    GIT_TAG main  # 可能变化
)
```

### 浅克隆

```cmake
FetchContent_Declare(
    mylib
    GIT_REPOSITORY https://github.com/user/mylib.git
    GIT_TAG        v1.0.0
    GIT_SHALLOW    TRUE  # 只下载最新提交，节省空间和时间
)
```

### 固定下载位置

```cmake
# 避免每次重新下载
set(FETCHCONTENT_BASE_DIR ${CMAKE_SOURCE_DIR}/external)

FetchContent_Declare(
    fmt
    GIT_REPOSITORY https://github.com/fmtlib/fmt.git
    GIT_TAG        10.1.0
)
FetchContent_MakeAvailable(fmt)
```

### 使用 EXCLUDE_FROM_ALL

```cmake
# 避免安装下载的库
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG        v1.14.0
)

# 设置不安装
set(INSTALL_GTEST OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)
```

## 4.8 完整项目示例

```
my-fetchcontent-project/
├── CMakeLists.txt
├── src/
│   └── main.cpp
└── external/       # FetchContent 下载目录
```

**CMakeLists.txt：**
```cmake
cmake_minimum_required(VERSION 3.14)
project(MyProject LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)

# 设置下载目录
set(FETCHCONTENT_BASE_DIR ${CMAKE_SOURCE_DIR}/external)

include(FetchContent)

# 下载依赖
FetchContent_Declare(
    fmt
    GIT_REPOSITORY https://github.com/fmtlib/fmt.git
    GIT_TAG        10.1.0
    GIT_SHALLOW    TRUE
)

FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG        v3.11.2
    GIT_SHALLOW    TRUE
)

FetchContent_MakeAvailable(fmt json)

# 创建可执行文件
add_executable(myapp src/main.cpp)
target_link_libraries(myapp PRIVATE fmt::fmt nlohmann_json::nlohmann_json)
```

**src/main.cpp：**
```cpp
#include <fmt/core.h>
#include <nlohmann/json.hpp>

int main() {
    nlohmann::json j = {{"name", "FetchContent"}};
    fmt::print("Hello from {}!\n", j["name"].get<std::string>());
    return 0;
}
```

**构建步骤：**
```bash
# 配置（首次会下载依赖）
cmake -S . -B build

# 构建
cmake --build build

# 运行
./build/myapp
```

## 下一步

掌握 FetchContent 后，继续阅读 [05-best-practices.md](05-best-practices.md) 学习最佳实践。