# 1. CMake 基础

本章介绍 CMake 的基本概念、项目结构和构建流程。

## 1.1 CMake 工作流程

CMake 的构建过程分为两个阶段：

1. **配置阶段（Configure）**：解析 `CMakeLists.txt`，生成构建系统文件
2. **构建阶段（Build）**：使用生成的构建系统编译项目

```bash
# 配置阶段
cmake -B build -S .

# 构建阶段
cmake --build build

# 或传统方式
mkdir build && cd build
cmake ..
make
```

### 常用生成器

| 生成器 | 说明 | 适用平台 |
|--------|------|----------|
| `Unix Makefiles` | 生成 Makefile | Linux/macOS |
| `Ninja` | 快速构建系统 | 全平台 |
| `Visual Studio` | VS 项目文件 | Windows |
| `Xcode` | Xcode 项目 | macOS |

```bash
# 指定生成器
cmake -G Ninja ..

# 查看可用生成器
cmake --help
```

## 1.2 最简单的 CMake 项目

### 项目结构

```
hello-cmake/
├── CMakeLists.txt
└── src/
    └── main.cpp
```

### CMakeLists.txt

```cmake
# 指定最低 CMake 版本
cmake_minimum_required(VERSION 3.10)

# 项目名称
project(HelloCMake)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 17)

# 创建可执行文件
add_executable(hello src/main.cpp)
```

### main.cpp

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, CMake!" << std::endl;
    return 0;
}
```

### 构建步骤

```bash
# 1. 创建构建目录
mkdir build && cd build

# 2. 配置项目
cmake ..

# 3. 构建项目
cmake --build .

# 4. 运行程序
./hello
```

## 1.3 标准项目结构

推荐的项目目录结构：

```
my-project/
├── CMakeLists.txt          # 根目录 CMake
├── src/
│   ├── CMakeLists.txt      # 源码目录 CMake
│   ├── main.cpp
│   └── utils.cpp
├── include/
│   └── utils.h
├── tests/
│   ├── CMakeLists.txt
│   └── test_utils.cpp
├── cmake/
│   └── MyLibConfig.cmake.in
├── docs/
├── README.md
└── build/                  # 构建输出目录
```

### 根目录 CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.15)

project(MyProject
    VERSION 1.0.0
    DESCRIPTION "My awesome C++ project"
    LANGUAGES CXX
)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 设置输出目录
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)

# 添加子目录
add_subdirectory(src)

# 可选：添加测试
option(BUILD_TESTS "Build tests" ON)
if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()

# 可选：添加示例
option(BUILD_EXAMPLES "Build examples" OFF)
if(BUILD_EXAMPLES)
    add_subdirectory(examples)
endif()
```

### src/CMakeLists.txt

```cmake
# 收集源文件
set(SOURCES
    main.cpp
    utils.cpp
)

# 创建可执行文件
add_executable(myapp ${SOURCES})

# 添加头文件搜索路径
target_include_directories(myapp PRIVATE
    ${CMAKE_SOURCE_DIR}/include
)

# 编译选项
target_compile_options(myapp PRIVATE
    -Wall
    -Wextra
    -Wpedantic
)

# 链接库（如果有）
target_link_libraries(myapp PRIVATE
    mylib
)
```

## 1.4 CMake 常用命令

### project()

定义项目信息：

```cmake
project(MyProject
    VERSION 1.0.0           # 版本号
    DESCRIPTION "..."       # 描述
    LANGUAGES CXX C         # 支持的语言
)

# 访问项目变量
message(STATUS "Project: ${PROJECT_NAME}")
message(STATUS "Version: ${PROJECT_VERSION}")
```

### set()

设置变量：

```cmake
# 设置普通变量
set(MY_VAR "value")

# 设置列表
set(SOURCES a.cpp b.cpp c.cpp)
set(SOURCES "a.cpp;b.cpp;c.cpp")  # 同上

# 设置缓存变量（可从命令行修改）
set(CMAKE_BUILD_TYPE Release CACHE STRING "Build type")

# 设置环境变量
set(ENV{PATH} "/new/path:$ENV{PATH}")
```

### message()

输出信息：

```cmake
message(STATUS "普通信息")
message(WARNING "警告信息")
message(FATAL_ERROR "错误信息，终止执行")
message(AUTHOR_WARNING "开发者警告")
```

### option()

定义用户选项：

```cmake
option(ENABLE_FEATURE "Enable feature X" ON)
option(BUILD_TESTS "Build test suite" OFF)

if(ENABLE_FEATURE)
    target_compile_definitions(myapp PRIVATE FEATURE_ENABLED)
endif()
```

### add_executable()

创建可执行文件：

```cmake
add_executable(myapp main.cpp)

# 添加多个源文件
add_executable(myapp
    main.cpp
    utils.cpp
    helper.cpp
)
```

### add_library()

创建库：

```cmake
# 静态库
add_library(mylib STATIC lib.cpp)

# 共享库
add_library(mylib SHARED lib.cpp)

# 自动选择（根据 BUILD_SHARED_LIBS）
add_library(mylib lib.cpp)
```

## 1.5 构建类型

CMake 支持多种构建类型：

```cmake
# 设置构建类型
set(CMAKE_BUILD_TYPE Release CACHE STRING "Build type")

# 可选值：
# - Debug: 调试版本，包含调试信息
# - Release: 发布版本，优化开启
# - RelWithDebInfo: 带调试信息的发布版本
# - MinSizeRel: 最小尺寸发布版本
```

### 各类型的编译选项

| 类型 | 编译选项 |
|------|----------|
| Debug | `-g -O0` |
| Release | `-O2 -DNDEBUG` |
| RelWithDebInfo | `-g -O2` |
| MinSizeRel | `-Os -DNDEBUG` |

### 自定义编译选项

```cmake
# Debug 模式额外选项
set(CMAKE_CXX_FLAGS_DEBUG "-g -O0 -DDEBUG")

# Release 模式额外选项
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -DNDEBUG")

# 或使用现代方式
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    target_compile_options(myapp PRIVATE -g -O0)
endif()
```

## 1.6 变量详解

### 内置变量

```cmake
# 项目相关
PROJECT_NAME           # 项目名称
PROJECT_VERSION        # 项目版本
PROJECT_SOURCE_DIR     # 项目源目录
PROJECT_BINARY_DIR     # 项目构建目录

# CMake 相关
CMAKE_SOURCE_DIR       # 顶层源目录
CMAKE_BINARY_DIR       # 顶层构建目录
CMAKE_CURRENT_SOURCE_DIR  # 当前 CMakeLists.txt 目录
CMAKE_CURRENT_BINARY_DIR  # 当前构建目录

# 编译相关
CMAKE_CXX_COMPILER     # C++ 编译器
CMAKE_CXX_STANDARD     # C++ 标准
CMAKE_BUILD_TYPE       # 构建类型

# 输出目录
CMAKE_RUNTIME_OUTPUT_DIRECTORY  # 可执行文件输出目录
CMAKE_LIBRARY_OUTPUT_DIRECTORY  # 共享库输出目录
CMAKE_ARCHIVE_OUTPUT_DIRECTORY  # 静态库输出目录
```

### 安装目录变量

```cmake
include(GNUInstallDirs)

# 标准安装路径
CMAKE_INSTALL_PREFIX          # 安装前缀 (/usr/local)
CMAKE_INSTALL_BINDIR          # 可执行文件 (bin)
CMAKE_INSTALL_LIBDIR          # 库文件 (lib)
CMAKE_INSTALL_INCLUDEDIR      # 头文件 (include)
CMAKE_INSTALL_DATADIR         # 数据文件 (share)
CMAKE_INSTALL_SYSCONFDIR      # 配置文件 (etc)
```

## 1.7 构建命令详解

### cmake 命令

```bash
# 基本配置
cmake -B build -S .

# 指定生成器
cmake -G Ninja -B build

# 指定构建类型
cmake -B build -DCMAKE_BUILD_TYPE=Release

# 指定安装路径
cmake -B build -DCMAKE_INSTALL_PREFIX=/usr/local

# 指定编译器
cmake -B build -DCMAKE_CXX_COMPILER=clang++

# 传递自定义变量
cmake -B build -DENABLE_FEATURE=ON

# 查看详细输出
cmake -B build -DCMAKE_VERBOSE_MAKEFILE=ON
```

### cmake --build 命令

```bash
# 构建所有目标
cmake --build build

# 构建特定目标
cmake --build build --target myapp

# 并行构建
cmake --build build --parallel 4

# 清理
cmake --build build --target clean

# 详细输出
cmake --build build -- VERBOSE=1
```

### cmake --install 命令

```bash
# 安装到默认位置
cmake --install build

# 安装到指定位置
cmake --install build --prefix /opt/myapp
```

## 1.8 实践练习

### 练习 1：创建简单项目

创建一个包含两个源文件的 CMake 项目：

```
exercise1/
├── CMakeLists.txt
├── main.cpp
└── math.cpp
```

要求：
- 使用 C++17 标准
- 添加 `-Wall` 编译选项
- 输出可执行文件名为 `calculator`

### 练习 2：多目录项目

创建包含子目录的项目：

```
exercise2/
├── CMakeLists.txt
├── src/
│   ├── CMakeLists.txt
│   └── main.cpp
├── include/
│   └── app.h
└── lib/
    ├── CMakeLists.txt
    ├── utils.cpp
    └── utils.h
```

要求：
- lib 目录生成静态库
- src 目录生成可执行文件并链接库

## 下一步

掌握基础后，继续阅读 [02-libraries.md](02-libraries.md) 学习库的构建与使用。