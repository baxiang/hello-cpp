# 3. 依赖管理

本章介绍如何在 CMake 中查找和管理外部依赖。

## 3.1 find_package 基础

`find_package` 是 CMake 查找外部包的标准方式。

### 基本用法

```cmake
# 查找必需的包
find_package(Threads REQUIRED)

# 查找特定版本的包
find_package(Boost 1.70 REQUIRED)

# 查找包的特定组件
find_package(Boost 1.70 REQUIRED COMPONENTS filesystem system)

# 可选查找
find_package(ZLIB)
if(ZLIB_FOUND)
    target_link_libraries(myapp PRIVATE ZLIB::ZLIB)
endif()
```

### 查找模式

`find_package` 有两种查找模式：

| 模式 | 说明 | 文件 |
|------|------|------|
| Module 模式 | 使用 FindXXX.cmake 模块 | `FindXXX.cmake` |
| Config 模式 | 使用包提供的配置文件 | `XXXConfig.cmake` |

### 查找路径

CMake 在以下路径查找包：

```cmake
# 标准路径
/usr/local/lib/cmake/
/usr/lib/cmake/
~/.cmake/

# 自定义路径
list(APPEND CMAKE_PREFIX_PATH "/opt/mylib")
find_package(MyLib REQUIRED)

# 或直接指定
find_package(MyLib REQUIRED PATHS /opt/mylib)
```

## 3.2 常用系统包

### Threads（多线程）

```cmake
find_package(Threads REQUIRED)
target_link_libraries(myapp PRIVATE Threads::Threads)
```

### Boost

```cmake
# 查找 Boost
find_package(Boost 1.70 REQUIRED COMPONENTS
    filesystem
    system
    thread
)

# 使用 Boost 头文件库
find_package(Boost 1.70 REQUIRED)
target_link_libraries(myapp PRIVATE Boost::boost)

# 使用 Boost 组件
target_link_libraries(myapp PRIVATE
    Boost::filesystem
    Boost::system
)
```

### OpenSSL

```cmake
find_package(OpenSSL REQUIRED)
target_link_libraries(myapp PRIVATE
    OpenSSL::SSL
    OpenSSL::Crypto
)
```

### ZLIB

```cmake
find_package(ZLIB REQUIRED)
target_link_libraries(myapp PRIVATE ZLIB::ZLIB)
```

### CURL

```cmake
find_package(CURL REQUIRED)
target_link_libraries(myapp PRIVATE CURL::libcurl)
```

### Python

```cmake
find_package(Python3 COMPONENTS Interpreter Development)
if(Python3_FOUND)
    target_include_directories(myapp PRIVATE ${Python3_INCLUDE_DIRS})
    target_link_libraries(myapp PRIVATE ${Python3_LIBRARIES})
endif()
```

### SDL2

```cmake
find_package(SDL2 REQUIRED)
target_link_libraries(myapp PRIVATE SDL2::SDL2)
```

## 3.3 FetchContent（下载依赖）

CMake 3.11+ 提供的内置下载机制，无需预先安装依赖。

### 基本用法

```cmake
include(FetchContent)

# 声明依赖
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG v1.14.0
)

# 下载并使其可用
FetchContent_MakeAvailable(googletest)

# 使用
target_link_libraries(tests PRIVATE gtest_main)
```

### 配置选项

```cmake
# 在 MakeAvailable 前设置选项
set(gtest_disable_pthreads ON CACHE BOOL "" FORCE)

FetchContent_MakeAvailable(googletest)
```

### 多个依赖

```cmake
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.2
)

FetchContent_Declare(
    spdlog
    GIT_REPOSITORY https://github.com/gabime/spdlog.git
    GIT_TAG v1.12.0
)

FetchContent_MakeAvailable(json spdlog)

target_link_libraries(myapp PRIVATE nlohmann_json::nlohmann_json spdlog::spdlog)
```

### 下载到指定目录

```cmake
set(FETCHCONTENT_BASE_DIR ${CMAKE_SOURCE_DIR}/external)
FetchContent_MakeAvailable(googletest)
```

### 常用库的 FetchContent 示例

**GoogleTest：**
```cmake
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG v1.14.0
)
FetchContent_MakeAvailable(googletest)
```

**nlohmann/json：**
```cmake
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.2
)
FetchContent_MakeAvailable(json)
target_link_libraries(myapp PRIVATE nlohmann_json::nlohmann_json)
```

**spdlog：**
```cmake
FetchContent_Declare(
    spdlog
    GIT_REPOSITORY https://github.com/gabime/spdlog.git
    GIT_TAG v1.12.0
)
FetchContent_MakeAvailable(spdlog)
target_link_libraries(myapp PRIVATE spdlog::spdlog)
```

**Catch2：**
```cmake
FetchContent_Declare(
    catch2
    GIT_REPOSITORY https://github.com/catchorg/Catch2.git
    GIT_TAG v3.5.0
)
FetchContent_MakeAvailable(catch2)
target_link_libraries(tests PRIVATE Catch2::Catch2)
```

## 3.4 自定义查找模块

当包没有提供 CMake 配置文件时，需要编写自定义查找模块。

### FindMyLib.cmake

```cmake
# cmake/modules/FindMyLib.cmake

# 查找头文件
find_path(MYLIB_INCLUDE_DIR
    NAMES mylib.h
    PATHS
        /usr/local/include
        /usr/include
        ${CMAKE_SOURCE_DIR}/external/mylib/include
)

# 查找库文件
find_library(MYLIB_LIBRARY
    NAMES mylib mylib-static
    PATHS
        /usr/local/lib
        /usr/lib
        ${CMAKE_SOURCE_DIR}/external/mylib/lib
)

# 标准处理
include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(MyLib
    REQUIRED_VARS MYLIB_LIBRARY MYLIB_INCLUDE_DIR
    VERSION_VAR MYLIB_VERSION
)

# 创建导入目标
if(MyLib_FOUND AND NOT TARGET MyLib::MyLib)
    add_library(MyLib::MyLib UNKNOWN IMPORTED)
    set_target_properties(MyLib::MyLib PROPERTIES
        IMPORTED_LOCATION "${MYLIB_LIBRARY}"
        INTERFACE_INCLUDE_DIRECTORIES "${MYLIB_INCLUDE_DIR}"
    )
endif()

# 标记为高级变量（不在 GUI 显示）
mark_as_advanced(MYLIB_INCLUDE_DIR MYLIB_LIBRARY)
```

### 使用自定义模块

```cmake
# 添加模块路径
list(APPEND CMAKE_MODULE_PATH ${CMAKE_SOURCE_DIR}/cmake/modules)

# 查找包
find_package(MyLib REQUIRED)

# 使用
target_link_libraries(myapp PRIVATE MyLib::MyLib)
```

## 3.5 find_package 详细选项

```cmake
# 版本要求
find_package(Boost 1.70)              # 任意版本 >= 1.70
find_package(Boost 1.70 EXACT)        # 精确版本 1.70

# 必需/可选
find_package(Boost REQUIRED)          # 必需，找不到则报错
find_package(Boost QUIET)             # 安静模式，不输出信息

# 组件
find_package(Boost COMPONENTS filesystem system)
find_package(Boost OPTIONAL_COMPONENTS python)  # 可选组件

# 查找路径
find_package(MyLib PATHS /opt/mylib /usr/local/mylib)

# 禁用特定模式
find_package(MyLib MODULE)            # 只用 Module 模式
find_package(MyLib CONFIG)            # 只用 Config 模式

# 注册包版本
find_package(MyLib 1.0 REQUIRED)
```

## 3.6 包版本检查

```cmake
find_package(Boost 1.70 REQUIRED)

# 检查版本
if(Boost_VERSION_STRING VERSION_GREATER_EQUAL "1.74.0")
    message(STATUS "Boost 1.74+ features available")
endif()

# 检查组件
if(TARGET Boost::python)
    target_link_libraries(myapp PRIVATE Boost::python)
endif()
```

## 3.7 Conan 与 CMake 集成

Conan 是 C++ 包管理器，可与 CMake 无缝集成。

### 安装 Conan

```bash
pip install conan
```

### conanfile.txt

```
[requires]
boost/1.81.0
openssl/3.1.0

[generators]
CMakeDeps
CMakeToolchain

[layout]
cmake_layout
```

### CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.15)
project(MyApp)

find_package(Boost REQUIRED)
find_package(OpenSSL REQUIRED)

add_executable(myapp main.cpp)
target_link_libraries(myapp PRIVATE Boost::boost OpenSSL::SSL)
```

### 构建流程

```bash
# 安装依赖
conan install . --output-folder=build --build=missing

# 配置和构建
cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake
cmake --build .
```

## 3.8 vcpkg 与 CMake 集成

vcpkg 是微软开发的 C++ 包管理器。

### 安装 vcpkg

```bash
git clone https://github.com/Microsoft/vcpkg.git
./vcpkg/bootstrap-vcpkg.sh
```

### 安装包

```bash
./vcpkg/vcpkg install boost openssl
```

### CMake 集成

```cmake
# 设置 vcpkg 工具链
# cmake -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake ..

# 或在 CMakeLists.txt 中
set(CMAKE_TOOLCHAIN_FILE "/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake")

find_package(Boost REQUIRED)
find_package(OpenSSL REQUIRED)

target_link_libraries(myapp PRIVATE Boost::boost OpenSSL::SSL)
```

## 3.9 依赖管理最佳实践

### 推荐策略

| 场景 | 推荐方式 |
|------|----------|
| 系统库（Threads, OpenSSL） | find_package |
| 常用第三方库（Boost, GTest） | find_package 或 FetchContent |
| 项目特定依赖 | FetchContent |
| 版本敏感依赖 | FetchContent + 固定版本 |
| 团队协作 | Conan/vcpkg |

### 版本锁定

```cmake
# 使用固定版本
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.2  # 使用具体版本号，不要用 main
)
```

### 依赖隔离

```cmake
# 使用 EXCLUDE_FROM_ALL 避免安装依赖的目标
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG v1.14.0
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)
```

## 3.10 实践练习

### 练习 1：使用 find_package

创建项目使用 Threads 和 Boost：

- 多线程程序
- 使用 Boost filesystem

### 练习 2：使用 FetchContent

使用 FetchContent 下载 nlohmann/json：

- 解析 JSON 文件
- 输出解析结果

### 练习 3：自定义查找模块

为本地库编写 FindXXX.cmake：

- 创建简单的本地库
- 编写查找模块
- 在项目中使用

## 下一步

掌握依赖管理后，继续阅读 [04-testing.md](04-testing.md) 学习测试集成。