# CMake 完全指南

CMake 是跨平台的构建系统生成器，已成为现代 C++ 项目的标准构建工具。本章从基础到高级，全面介绍 CMake 的使用。

## 一、CMake 基础

### 1.1 最简单的 CMake 项目

```
hello-cmake/
├── CMakeLists.txt
└── src/
    └── main.cpp
```

**CMakeLists.txt**
```cmake
cmake_minimum_required(VERSION 3.10)
project(HelloCMake)

set(CMAKE_CXX_STANDARD 17)

add_executable(hello src/main.cpp)
```

**src/main.cpp**
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, CMake!" << std::endl;
    return 0;
}
```

**构建命令**
```bash
mkdir build && cd build
cmake ..
cmake --build .
./hello
```

### 1.2 标准项目结构

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
└── build/
```

**根目录 CMakeLists.txt**
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

# 添加子目录
add_subdirectory(src)

# 可选：添加测试
option(BUILD_TESTS "Build tests" ON)
if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()
```

**src/CMakeLists.txt**
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
```

---

## 二、库的构建与使用

### 2.1 静态库

```cmake
# 创建静态库
add_library(mylib STATIC
    src/lib/utils.cpp
    src/lib/math.cpp
)

# 设置库的头文件路径
target_include_directories(mylib PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

# 链接到可执行文件
target_link_libraries(myapp PRIVATE mylib)
```

### 2.2 共享库

```cmake
# 创建共享库
add_library(mylib SHARED
    src/lib/utils.cpp
)

# 设置库版本
set_target_properties(mylib PROPERTIES
    VERSION 1.0.0
    SOVERSION 1
)

# 导出符号（跨平台）
target_compile_definitions(mylib PRIVATE MYLIB_EXPORTS)
```

### 2.3 头文件库（interface）

```cmake
# 纯头文件库
add_library(header_only_lib INTERFACE)

target_include_directories(header_only_lib INTERFACE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

# 使用
target_link_libraries(myapp PRIVATE header_only_lib)
```

### 2.4 对象库（Object Library）

```cmake
# 对象库用于共享编译单元
add_library(common_objs OBJECT
    utils.cpp
    helpers.cpp
)

# 多个目标可以使用这些对象文件
add_executable(app1 main1.cpp $<TARGET_OBJECTS:common_objs>)
add_executable(app2 main2.cpp $<TARGET_OBJECTS:common_objs>)
```

---

## 三、查找和使用外部包

### 3.1 find_package 基础

```cmake
# 查找包
find_package(Threads REQUIRED)
find_package(Boost 1.70 REQUIRED COMPONENTS filesystem system)

# 使用找到的包
target_link_libraries(myapp PRIVATE
    Threads::Threads
    Boost::filesystem
    Boost::system
)
```

### 3.2 常用系统包

```cmake
# OpenSSL
find_package(OpenSSL REQUIRED)
target_link_libraries(myapp PRIVATE OpenSSL::SSL OpenSSL::Crypto)

# Zlib
find_package(ZLIB REQUIRED)
target_include_directories(myapp PRIVATE ${ZLIB_INCLUDE_DIRS})
target_link_libraries(myapp PRIVATE ${ZLIB_LIBRARIES})

# CURL
find_package(CURL REQUIRED)
target_link_libraries(myapp PRIVATE CURL::libcurl)

# Python
find_package(Python3 COMPONENTS Interpreter Development)
if(Python3_FOUND)
    target_include_directories(myapp PRIVATE ${Python3_INCLUDE_DIRS})
    target_link_libraries(myapp PRIVATE ${Python3_LIBRARIES})
endif()
```

### 3.3 自定义查找模块

```cmake
# 在 cmake/modules/FindMyLib.cmake
find_path(MYLIB_INCLUDE_DIR
    NAMES mylib.h
    PATHS /usr/local/include /usr/include
)

find_library(MYLIB_LIBRARY
    NAMES mylib
    PATHS /usr/local/lib /usr/lib
)

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(MyLib
    REQUIRED_VARS MYLIB_LIBRARY MYLIB_INCLUDE_DIR
)

if(MYLIB_FOUND)
    add_library(MyLib::MyLib UNKNOWN IMPORTED)
    set_target_properties(MyLib::MyLib PROPERTIES
        IMPORTED_LOCATION ${MYLIB_LIBRARY}
        INTERFACE_INCLUDE_DIRECTORIES ${MYLIB_INCLUDE_DIR}
    )
endif()
```

使用：
```cmake
list(APPEND CMAKE_MODULE_PATH ${CMAKE_SOURCE_DIR}/cmake/modules)
find_package(MyLib REQUIRED)
target_link_libraries(myapp PRIVATE MyLib::MyLib)
```

---

## 四、现代 CMake 最佳实践

### 4.1 目标属性（Target Properties）

```cmake
# 好的做法：使用 target_* 命令
target_include_directories(myapp PRIVATE include/)
target_compile_definitions(myapp PRIVATE DEBUG_MODE)
target_compile_options(myapp PRIVATE -Wall -Wextra)
target_link_libraries(myapp PRIVATE mylib)

# 避免：使用全局变量
include_directories(include/)  # 不推荐
add_definitions(-DDEBUG_MODE)  # 不推荐
link_directories(/usr/local/lib)  # 不推荐
```

### 4.2 生成器表达式（Generator Expressions）

```cmake
# 条件编译选项
target_compile_options(myapp PRIVATE
    $<$<CONFIG:Debug>:-g -O0>
    $<$<CONFIG:Release>:-O2 -DNDEBUG>
)

# 条件包含目录
target_include_directories(myapp PRIVATE
    $<$<BOOL:${USE_CUSTOM_LIB}>:${CUSTOM_LIB_INCLUDE_DIR}>
)

# 平台特定
target_compile_definitions(myapp PRIVATE
    $<$<PLATFORM_ID:Windows>:WINDOWS_BUILD>
    $<$<PLATFORM_ID:Linux>:LINUX_BUILD>
    $<$<PLATFORM_ID:Darwin>:MACOS_BUILD>
)
```

### 4.3 别名目标

```cmake
# 为库创建别名
add_library(mylib STATIC lib.cpp)
add_library(MyLib::mylib ALIAS mylib)

# 使用别名
target_link_libraries(app PRIVATE MyLib::mylib)
```

### 4.4 导入目标（Imported Targets）

```cmake
# 为外部库创建导入目标
add_library(ExternalLib::ExternalLib UNKNOWN IMPORTED)
set_target_properties(ExternalLib::ExternalLib PROPERTIES
    IMPORTED_LOCATION /path/to/libexternal.so
    INTERFACE_INCLUDE_DIRECTORIES /path/to/include
)
```

---

## 五、安装和打包

### 5.1 基本安装

```cmake
include(GNUInstallDirs)

# 安装可执行文件
install(TARGETS myapp
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)

# 安装库
install(TARGETS mylib
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)

# 安装头文件
install(DIRECTORY include/
    DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}
    FILES_MATCHING PATTERN "*.h" PATTERN "*.hpp"
)

# 安装配置文件
install(FILES config.json
    DESTINATION ${CMAKE_INSTALL_SYSCONFDIR}/myapp
)
```

### 5.2 CMake 配置文件

```cmake
# 生成配置版本
include(CMakePackageConfigHelpers)

# 创建配置文件
configure_package_config_file(
    ${CMAKE_SOURCE_DIR}/cmake/MyLibConfig.cmake.in
    ${CMAKE_BINARY_DIR}/MyLibConfig.cmake
    INSTALL_DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)

# 创建版本文件
write_basic_package_version_file(
    ${CMAKE_BINARY_DIR}/MyLibConfigVersion.cmake
    VERSION 1.0.0
    COMPATIBILITY SameMajorVersion
)

# 安装配置文件
install(FILES
    ${CMAKE_BINARY_DIR}/MyLibConfig.cmake
    ${CMAKE_BINARY_DIR}/MyLibConfigVersion.cmake
    DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)

# 导出目标
install(EXPORT MyLibTargets
    FILE MyLibTargets.cmake
    NAMESPACE MyLib::
    DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)
```

---

## 六、测试集成

### 6.1 CTest 基础

```cmake
# 启用测试
enable_testing()

# 添加测试
add_test(NAME MyTest COMMAND myapp --test)

# 设置测试属性
set_tests_properties(MyTest PROPERTIES
    TIMEOUT 30
    LABELS "unit"
)
```

### 6.2 GoogleTest 集成

```cmake
# 方法 1：使用 find_package
find_package(GTest REQUIRED)
target_link_libraries(test_app PRIVATE GTest::gtest_main)

# 方法 2：使用 FetchContent（推荐）
include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
)
FetchContent_MakeAvailable(googletest)

target_link_libraries(test_app PRIVATE gtest_main)

# 包含 GoogleTest 模块
include(GoogleTest)
gtest_discover_tests(test_app)
```

### 6.3 测试示例

```cpp
// tests/test_utils.cpp
#include <gtest/gtest.h>
#include "utils.h"

TEST(UtilsTest, AddTest) {
    EXPECT_EQ(add(2, 3), 5);
    EXPECT_EQ(add(-1, 1), 0);
}

TEST(UtilsTest, MultiplyTest) {
    EXPECT_EQ(multiply(2, 3), 6);
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
```

```cmake
# tests/CMakeLists.txt
add_executable(test_app test_utils.cpp)
target_link_libraries(test_app PRIVATE myapp_lib gtest_main)

include(GoogleTest)
gtest_discover_tests(test_app)
```

运行测试：
```bash
ctest                 # 运行所有测试
ctest -R AddTest      # 运行匹配的测试
ctest -V              # 详细输出
```

---

## 七、跨平台构建

### 7.1 平台检测

```cmake
# 检测操作系统
if(CMAKE_SYSTEM_NAME STREQUAL "Windows")
    message(STATUS "Building for Windows")
elseif(CMAKE_SYSTEM_NAME STREQUAL "Linux")
    message(STATUS "Building for Linux")
elseif(CMAKE_SYSTEM_NAME STREQUAL "Darwin")
    message(STATUS "Building for macOS")
endif()

# 检测编译器
if(CMAKE_CXX_COMPILER_ID STREQUAL "GNU")
    message(STATUS "Using GCC")
elseif(CMAKE_CXX_COMPILER_ID STREQUAL "Clang")
    message(STATUS "Using Clang")
elseif(CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")
    message(STATUS "Using MSVC")
endif()
```

### 7.2 跨平台配置示例

```cmake
cmake_minimum_required(VERSION 3.15)
project(CrossPlatformApp)

set(CMAKE_CXX_STANDARD 17)

# 平台特定源文件
if(WIN32)
    set(PLATFORM_SOURCES src/platform_windows.cpp)
    target_compile_definitions(myapp PRIVATE PLATFORM_WINDOWS)
elseif(UNIX AND NOT APPLE)
    set(PLATFORM_SOURCES src/platform_linux.cpp)
    target_compile_definitions(myapp PRIVATE PLATFORM_LINUX)
elseif(APPLE)
    set(PLATFORM_SOURCES src/platform_macos.cpp)
    target_compile_definitions(myapp PRIVATE PLATFORM_MACOS)
endif()

# 编译器特定选项
if(MSVC)
    target_compile_options(myapp PRIVATE /W4 /permissive-)
else()
    target_compile_options(myapp PRIVATE -Wall -Wextra -Wpedantic)
endif()

# 链接平台特定库
if(WIN32)
    target_link_libraries(myapp PRIVATE ws2_32)
elseif(UNIX)
    find_package(Threads REQUIRED)
    target_link_libraries(myapp PRIVATE Threads::Threads)
endif()
```

### 7.3 多架构支持（Apple Silicon）

```cmake
# 支持 Universal Binary
if(APPLE)
    set(CMAKE_OSX_ARCHITECTURES "arm64;x86_64" CACHE STRING "" FORCE)
endif()
```

---

## 八、性能优化

### 8.1 预编译头文件（PCH）

```cmake
add_executable(myapp main.cpp utils.cpp)

# 启用预编译头文件
target_precompile_headers(myapp PRIVATE
    <iostream>
    <vector>
    <string>
    "include/common.h"
)
```

### 8.2 链接时优化（LTO）

```cmake
include(CheckIPOSupported)
check_ipo_supported(RESULT lto_supported OUTPUT error)

if(lto_supported)
    set(CMAKE_INTERPROCEDURAL_OPTIMIZATION TRUE)
    message(STATUS "LTO enabled")
else()
    message(STATUS "LTO not supported: ${error}")
endif()
```

### 8.3 并行编译

```cmake
# Unity 构建（批量编译）
set_target_properties(myapp PROPERTIES
    UNITY_BUILD ON
    UNITY_BUILD_BATCH_SIZE 4
)
```

---

## 九、实用技巧

### 9.1 条件编译

```cmake
# 选项
option(ENABLE_LOGGING "Enable logging" ON)
option(ENABLE_TESTING "Enable testing" ON)

if(ENABLE_LOGGING)
    target_compile_definitions(myapp PRIVATE LOGGING_ENABLED)
    target_sources(myapp PRIVATE src/logger.cpp)
endif()
```

### 9.2 版本信息

```cmake
project(MyApp VERSION 1.2.3)

# 生成版本头文件
configure_file(
    ${CMAKE_SOURCE_DIR}/version.h.in
    ${CMAKE_BINARY_DIR}/version.h
)

target_include_directories(myapp PRIVATE ${CMAKE_BINARY_DIR})
```

version.h.in:
```cpp
#ifndef VERSION_H
#define VERSION_H

#define APP_VERSION "@PROJECT_VERSION@"
#define APP_NAME "@PROJECT_NAME@"

#endif
```

### 9.3 自定义命令

```cmake
# 构建前生成代码
add_custom_command(
    OUTPUT ${CMAKE_BINARY_DIR}/generated.cpp
    COMMAND python ${CMAKE_SOURCE_DIR}/generate.py
        --output ${CMAKE_BINARY_DIR}/generated.cpp
    DEPENDS ${CMAKE_SOURCE_DIR}/generate.py
    COMMENT "Generating source code"
)

add_executable(myapp
    main.cpp
    ${CMAKE_BINARY_DIR}/generated.cpp
)
```

### 9.4 查找和处理文件

```cmake
# 收集所有源文件
file(GLOB_RECURSE SOURCES "src/*.cpp")

# 或者明确列出（推荐）
set(SOURCES
    src/main.cpp
    src/utils.cpp
)

# 复制文件
configure_file(
    ${CMAKE_SOURCE_DIR}/data/config.json
    ${CMAKE_BINARY_DIR}/config.json
    COPYONLY
)
```

---

## 十、完整项目示例

```
complete-project/
├── CMakeLists.txt
├── src/
│   ├── CMakeLists.txt
│   ├── main.cpp
│   └── app/
│       ├── CMakeLists.txt
│       ├── app.cpp
│       └── app.h
├── include/
│   └── mylib/
│       ├── utils.h
│       └── types.h
├── lib/
│   └── CMakeLists.txt
├── tests/
│   ├── CMakeLists.txt
│   └── test_utils.cpp
├── cmake/
│   └── MyLibConfig.cmake.in
├── docs/
└── build/
```

**根目录 CMakeLists.txt**
```cmake
cmake_minimum_required(VERSION 3.15)
project(MyLib
    VERSION 1.0.0
    DESCRIPTION "A complete CMake project example"
    LANGUAGES CXX
)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 选项
option(BUILD_SHARED_LIBS "Build shared libraries" ON)
option(BUILD_TESTS "Build tests" ON)
option(BUILD_EXAMPLES "Build examples" OFF)

# 添加子目录
add_subdirectory(lib)
add_subdirectory(src)

if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()

if(BUILD_EXAMPLES)
    add_subdirectory(examples)
endif()

# 安装
include(GNUInstallDirs)
include(CMakePackageConfigHelpers)

install(TARGETS mylib
    EXPORT MyLibTargets
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)

install(DIRECTORY include/
    DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}
)

configure_package_config_file(
    cmake/MyLibConfig.cmake.in
    ${CMAKE_BINARY_DIR}/MyLibConfig.cmake
    INSTALL_DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)

write_basic_package_version_file(
    ${CMAKE_BINARY_DIR}/MyLibConfigVersion.cmake
    VERSION ${PROJECT_VERSION}
    COMPATIBILITY SameMajorVersion
)

install(FILES
    ${CMAKE_BINARY_DIR}/MyLibConfig.cmake
    ${CMAKE_BINARY_DIR}/MyLibConfigVersion.cmake
    DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)

install(EXPORT MyLibTargets
    FILE MyLibTargets.cmake
    NAMESPACE MyLib::
    DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)
```

---

## 总结

CMake 是现代 C++ 开发的必备技能。关键要点：

1. **使用现代 CMake**：优先使用 `target_*` 命令，避免全局变量
2. **理解目标概念**：可执行文件、库都是目标
3. **掌握包管理**：find_package、FetchContent
4. **跨平台思维**：考虑不同操作系统和编译器的差异
5. **测试集成**：使用 CTest 和 GoogleTest
6. **合理组织项目**：清晰的目录结构和 CMake 文件组织
