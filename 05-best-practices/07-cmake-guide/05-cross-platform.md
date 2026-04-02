# 5. 跨平台构建

本章介绍如何编写跨平台的 CMake 配置，支持 Windows、Linux 和 macOS。

## 5.1 平台检测

### 检测操作系统

```cmake
# 方式一：使用内置变量
if(WIN32)
    message(STATUS "Building for Windows")
elseif(UNIX AND NOT APPLE)
    message(STATUS "Building for Linux")
elseif(APPLE)
    message(STATUS "Building for macOS")
endif()

# 方式二：使用 CMAKE_SYSTEM_NAME
if(CMAKE_SYSTEM_NAME STREQUAL "Windows")
    # Windows 特定代码
elseif(CMAKE_SYSTEM_NAME STREQUAL "Linux")
    # Linux 特定代码
elseif(CMAKE_SYSTEM_NAME STREQUAL "Darwin")
    # macOS 特定代码
endif()
```

### 平台变量

| 变量 | Windows | Linux | macOS |
|------|---------|-------|-------|
| `WIN32` | TRUE | FALSE | FALSE |
| `UNIX` | FALSE | TRUE | TRUE |
| `APPLE` | FALSE | FALSE | TRUE |
| `CMAKE_SYSTEM_NAME` | Windows | Linux | Darwin |

### 检测编译器

```cmake
# 检测编译器类型
if(CMAKE_CXX_COMPILER_ID STREQUAL "GNU")
    message(STATUS "Using GCC: ${CMAKE_CXX_COMPILER_VERSION}")
elseif(CMAKE_CXX_COMPILER_ID STREQUAL "Clang")
    message(STATUS "Using Clang: ${CMAKE_CXX_COMPILER_VERSION}")
elseif(CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")
    message(STATUS "Using MSVC: ${CMAKE_CXX_COMPILER_VERSION}")
endif()

# 检测编译器版本
if(CMAKE_CXX_COMPILER_VERSION VERSION_GREATER_EQUAL "9.0")
    # GCC 9+ 特性
endif()
```

### 编译器变量

| 变量 | GCC | Clang | MSVC |
|------|-----|-------|------|
| `CMAKE_CXX_COMPILER_ID` | GNU | Clang | MSVC |
| `CMAKE_CXX_COMPILER_VERSION` | 版本号 | 版本号 | 版本号 |

## 5.2 平台特定源文件

```cmake
# 根据平台选择源文件
set(COMMON_SOURCES
    src/main.cpp
    src/utils.cpp
)

if(WIN32)
    set(PLATFORM_SOURCES
        src/platform_windows.cpp
    )
elseif(UNIX AND NOT APPLE)
    set(PLATFORM_SOURCES
        src/platform_linux.cpp
    )
elseif(APPLE)
    set(PLATFORM_SOURCES
        src/platform_macos.cpp
    )
endif()

add_executable(myapp
    ${COMMON_SOURCES}
    ${PLATFORM_SOURCES}
)
```

## 5.3 平台特定编译选项

### 编译器特定选项

```cmake
if(MSVC)
    # MSVC 选项
    target_compile_options(myapp PRIVATE
        /W4             # 警告级别
        /permissive-    # 严格标准一致性
        /utf-8          # UTF-8 源文件
    )

    # 定义
    target_compile_definitions(myapp PRIVATE
        _CRT_SECURE_NO_WARNINGS
        NOMINMAX
    )
else()
    # GCC/Clang 选项
    target_compile_options(myapp PRIVATE
        -Wall
        -Wextra
        -Wpedantic
        -Werror
    )
endif()
```

### 优化选项

```cmake
if(MSVC)
    target_compile_options(myapp PRIVATE
        $<$<CONFIG:Release>:/O2>
        $<$<CONFIG:Debug>:/Od /Zi>
    )
else()
    target_compile_options(myapp PRIVATE
        $<$<CONFIG:Release>:-O2 -DNDEBUG>
        $<$<CONFIG:Debug>:-g -O0>
    )
endif()
```

## 5.4 平台特定链接库

```cmake
# Windows 特定库
if(WIN32)
    target_link_libraries(myapp PRIVATE
        ws2_32      # Winsock
        shell32     # Shell API
        user32      # User API
    )
endif()

# Linux 特定库
if(UNIX AND NOT APPLE)
    find_package(Threads REQUIRED)
    target_link_libraries(myapp PRIVATE
        Threads::Threads
        dl          # 动态加载
        rt          # 实时库
    )
endif()

# macOS 特定框架
if(APPLE)
    find_library(FOUNDATION_FRAMEWORK Foundation)
    find_library(COREFOUNDATION_FRAMEWORK CoreFoundation)
    target_link_libraries(myapp PRIVATE
        ${FOUNDATION_FRAMEWORK}
        ${COREFOUNDATION_FRAMEWORK}
    )
endif()
```

## 5.5 生成器表达式

生成器表达式在构建时求值，适合跨平台配置。

### 条件表达式

```cmake
# 平台条件
target_compile_definitions(myapp PRIVATE
    $<$<PLATFORM_ID:Windows>:WINDOWS_BUILD>
    $<$<PLATFORM_ID:Linux>:LINUX_BUILD>
    $<$<PLATFORM_ID:Darwin>:MACOS_BUILD>
)

# 编译器条件
target_compile_options(myapp PRIVATE
    $<$<CXX_COMPILER_ID:GNU>:-Wall>
    $<$<CXX_COMPILER_ID:Clang>:-Wextra>
    $<$<CXX_COMPILER_ID:MSVC>:/W4>
)

# 构建类型条件
target_compile_options(myapp PRIVATE
    $<$<CONFIG:Debug>:-g -O0>
    $<$<CONFIG:Release>:-O2>
)
```

### 常用生成器表达式

| 表达式 | 说明 |
|--------|------|
| `$<PLATFORM_ID>` | 平台标识 |
| `$<CXX_COMPILER_ID>` | 编译器标识 |
| `$<CONFIG>` | 构建类型 |
| `$<BOOL:value>` | 布尔转换 |
| `$<AND:expr1,expr2>` | 逻辑与 |
| `$<OR:expr1,expr2>` | 逻辑或 |
| `$<NOT:expr>` | 逻辑非 |
| `$<IF:cond,true,false>` | 条件选择 |

### 组合表达式

```cmake
# 复杂条件
target_compile_options(myapp PRIVATE
    $<$<AND:$<CXX_COMPILER_ID:GNU>,$<CONFIG:Release>>:-O3 -march=native>
    $<$<AND:$<CXX_COMPILER_ID:Clang>,$<PLATFORM_ID:Darwin>>:-stdlib=libc++>
)

# 条件包含目录
target_include_directories(myapp PRIVATE
    $<$<BOOL:${USE_CUSTOM_INCLUDE}>:${CUSTOM_INCLUDE_DIR}>
)
```

## 5.6 完整跨平台示例

```cmake
cmake_minimum_required(VERSION 3.15)
project(CrossPlatformApp VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 选项
option(ENABLE_LOGGING "Enable logging" ON)

# 源文件
set(SOURCES
    src/main.cpp
    src/app.cpp
)

# 平台特定源文件
if(WIN32)
    list(APPEND SOURCES src/platform_windows.cpp)
    target_compile_definitions(myapp PRIVATE PLATFORM_WINDOWS)
elseif(UNIX AND NOT APPLE)
    list(APPEND SOURCES src/platform_linux.cpp)
    target_compile_definitions(myapp PRIVATE PLATFORM_LINUX)
elseif(APPLE)
    list(APPEND SOURCES src/platform_macos.cpp)
    target_compile_definitions(myapp PRIVATE PLATFORM_MACOS)
endif()

# 创建可执行文件
add_executable(myapp ${SOURCES})

# 头文件路径
target_include_directories(myapp PRIVATE
    ${CMAKE_SOURCE_DIR}/include
)

# 编译器特定选项
if(MSVC)
    target_compile_options(myapp PRIVATE
        /W4
        /permissive-
        /utf-8
    )
    target_compile_definitions(myapp PRIVATE
        _CRT_SECURE_NO_WARNINGS
        NOMINMAX
    )
else()
    target_compile_options(myapp PRIVATE
        -Wall
        -Wextra
        -Wpedantic
        $<$<CONFIG:Release>:-O2>
        $<$<CONFIG:Debug>:-g -O0>
    )
endif()

# 平台特定链接库
if(WIN32)
    target_link_libraries(myapp PRIVATE ws2_32)
elseif(UNIX)
    find_package(Threads REQUIRED)
    target_link_libraries(myapp PRIVATE Threads::Threads)
    if(NOT APPLE)
        target_link_libraries(myapp PRIVATE dl rt)
    endif()
endif()

# macOS 框架
if(APPLE)
    find_library(FOUNDATION_FRAMEWORK Foundation)
    target_link_libraries(myapp PRIVATE ${FOUNDATION_FRAMEWORK})
endif()

# 日志选项
if(ENABLE_LOGGING)
    target_compile_definitions(myapp PRIVATE LOGGING_ENABLED)
    target_sources(myapp PRIVATE src/logger.cpp)
endif()

# 安装
include(GNUInstallDirs)
install(TARGETS myapp
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
```

## 5.7 多架构支持

### Apple Silicon (arm64/x86_64)

```cmake
# Universal Binary（同时支持 arm64 和 x86_64）
if(APPLE)
    set(CMAKE_OSX_ARCHITECTURES "arm64;x86_64" CACHE STRING "" FORCE)
endif()

# 或指定单一架构
if(APPLE)
    set(CMAKE_OSX_ARCHITECTURES "arm64" CACHE STRING "" FORCE)
endif()
```

### macOS 版本支持

```cmake
# 设置最低 macOS 版本
if(APPLE)
    set(CMAKE_OSX_DEPLOYMENT_TARGET "10.15" CACHE STRING "" FORCE)
endif()
```

### Windows 32/64 位

```cmake
# 检测架构
if(CMAKE_SIZEOF_VOID_P EQUAL 8)
    message(STATUS "64-bit build")
else()
    message(STATUS "32-bit build")
endif()
```

## 5.8 跨平台文件操作

### 文件路径

```cmake
# 使用 CMake 跨平台路径函数
cmake_path(SET MY_PATH "${CMAKE_SOURCE_DIR}/data/file.txt")

# 或使用 file() 命令
file(TO_CMAKE_PATH "${ENV_PATH}" CMAKE_PATH)
file(TO_NATIVE_PATH "${CMAKE_PATH}" NATIVE_PATH)
```

### 复制文件

```cmake
# 跨平台复制
configure_file(
    ${CMAKE_SOURCE_DIR}/config.json
    ${CMAKE_BINARY_DIR}/config.json
    COPYONLY
)

# 或使用 file()
file(COPY ${CMAKE_SOURCE_DIR}/data/
    DESTINATION ${CMAKE_BINARY_DIR}/data/
)
```

## 5.9 跨平台执行命令

```cmake
# 使用 CMake 命令而非系统命令
# 避免 execute_process 调用平台特定命令

# 创建目录
file(MAKE_DIRECTORY ${CMAKE_BINARY_DIR}/output)

# 删除文件
file(REMOVE ${CMAKE_BINARY_DIR}/temp.txt)

# 删除目录
file(REMOVE_RECURSE ${CMAKE_BINARY_DIR}/temp_dir)
```

## 5.10 常见跨平台问题

### 问题 1：路径分隔符

```cmake
# 错误：使用硬编码路径
set(DATA_DIR "C:/data")  # 仅 Windows

# 正确：使用 CMake 变量
set(DATA_DIR "${CMAKE_SOURCE_DIR}/data")
```

### 问题 2：文件扩展名

```cmake
# 共享库扩展名
if(WIN32)
    set(LIB_SUFFIX ".dll")
elseif(APPLE)
    set(LIB_SUFFIX ".dylib")
else()
    set(LIB_SUFFIX ".so")
endif()

# 或使用 CMake 属性
get_target_property(lib_location mylib LOCATION)
```

### 问题 3：环境变量

```cmake
# 获取环境变量
set(USER_HOME $ENV{HOME})
if(WIN32)
    set(USER_HOME $ENV{USERPROFILE})
endif()
```

## 5.11 实践练习

### 练习 1：平台检测

编写输出平台信息的 CMake 配置：

- 显示操作系统、编译器
- 显示架构（32/64位）

### 练习 2：跨平台编译选项

为不同编译器设置不同的警告选项：

- GCC: -Wall -Wextra
- Clang: -Wall -Wextra -Wpedantic
- MSVC: /W4

### 练习 3：平台特定库

创建跨平台网络程序：

- Windows: 使用 ws2_32
- Linux/macOS: 使用原生 socket

## 下一步

掌握跨平台构建后，继续阅读 [06-advanced.md](06-advanced.md) 学习高级主题。