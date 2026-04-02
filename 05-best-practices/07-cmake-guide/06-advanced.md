# 6. 高级主题

本章介绍 CMake 的高级特性，包括安装打包、性能优化和实用技巧。

## 6.1 安装和打包

### 基本安装

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

# 安装文档
install(FILES README.md LICENSE
    DESTINATION ${CMAKE_INSTALL_DOCDIR}
)
```

### 安装目录变量

```cmake
include(GNUInstallDirs)

# 标准安装路径
CMAKE_INSTALL_PREFIX          # 安装前缀 (/usr/local)
CMAKE_INSTALL_BINDIR          # 可执行文件 (bin)
CMAKE_INSTALL_LIBDIR          # 库文件 (lib 或 lib64)
CMAKE_INSTALL_INCLUDEDIR      # 头文件 (include)
CMAKE_INSTALL_DATADIR         # 数据文件 (share)
CMAKE_INSTALL_SYSCONFDIR      # 配置文件 (etc)
CMAKE_INSTALL_DOCDIR          # 文档 (share/doc)
```

### 导出目标

```cmake
# 导出目标供其他项目使用
install(EXPORT MyLibTargets
    FILE MyLibTargets.cmake
    NAMESPACE MyLib::
    DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)
```

### CMake 配置文件

```cmake
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
    VERSION ${PROJECT_VERSION}
    COMPATIBILITY SameMajorVersion
)

# 安装配置文件
install(FILES
    ${CMAKE_BINARY_DIR}/MyLibConfig.cmake
    ${CMAKE_BINARY_DIR}/MyLibConfigVersion.cmake
    DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)
```

### 配置文件模板

```cmake
# cmake/MyLibConfig.cmake.in
@PACKAGE_INIT@

include("${CMAKE_CURRENT_LIST_DIR}/MyLibTargets.cmake")

check_required_components(MyLib)
```

### 使用安装的库

```cmake
# 其他项目使用
find_package(MyLib 1.0 REQUIRED)
target_link_libraries(myapp PRIVATE MyLib::mylib)
```

## 6.2 性能优化

### 预编译头文件（PCH）

```cmake
add_executable(myapp main.cpp utils.cpp)

# 启用预编译头文件
target_precompile_headers(myapp PRIVATE
    <iostream>
    <vector>
    <string>
    <map>
    "include/common.h"
)

# 重用预编译头文件
add_executable(myapp2 main2.cpp)
target_precompile_headers(myapp2 REUSE_FROM myapp)
```

### 链接时优化（LTO）

```cmake
include(CheckIPOSupported)
check_ipo_supported(RESULT lto_supported OUTPUT error)

if(lto_supported)
    set(CMAKE_INTERPROCEDURAL_OPTIMIZATION TRUE)
    message(STATUS "LTO enabled")
else()
    message(STATUS "LTO not supported: ${error}")
endif()

# 或针对特定目标
set_target_properties(myapp PROPERTIES
    INTERPROCEDURAL_OPTIMIZATION TRUE
)
```

### Unity 构建

```cmake
# Unity 构建减少编译时间
set_target_properties(myapp PROPERTIES
    UNITY_BUILD ON
    UNITY_BUILD_BATCH_SIZE 8
)

# 排除特定文件
set_source_files_properties(special.cpp PROPERTIES
    SKIP_UNITY_BUILD_INCLUSION TRUE
)
```

### 并行编译

```cmake
# 设置并行编译数
if(NOT CMAKE_BUILD_PARALLEL_LEVEL)
    include(ProcessorCount)
    ProcessorCount(N)
    if(N GREATER 0)
        set(CMAKE_BUILD_PARALLEL_LEVEL ${N} CACHE STRING "" FORCE)
    endif()
endif()
```

## 6.3 现代 CMake 最佳实践

### 使用 target_* 命令

```cmake
# 好的做法：使用 target_* 命令
target_include_directories(myapp PRIVATE include/)
target_compile_definitions(myapp PRIVATE DEBUG_MODE)
target_compile_options(myapp PRIVATE -Wall -Wextra)
target_link_libraries(myapp PRIVATE mylib)

# 避免：使用全局命令
include_directories(include/)      # 不推荐
add_definitions(-DDEBUG_MODE)      # 不推荐
link_directories(/usr/local/lib)   # 不推荐
aux_source_directory(src SOURCES)  # 不推荐
```

### 别名目标

```cmake
# 为库创建别名
add_library(mylib STATIC lib.cpp)
add_library(MyLib::mylib ALIAS mylib)

# 使用别名（更清晰的命名）
target_link_libraries(app PRIVATE MyLib::mylib)
```

### 生成器表达式

```cmake
# 条件编译选项
target_compile_options(myapp PRIVATE
    $<$<CONFIG:Debug>:-g -O0>
    $<$<CONFIG:Release>:-O2 -DNDEBUG>
)

# 条件定义
target_compile_definitions(myapp PRIVATE
    $<$<PLATFORM_ID:Windows>:WINDOWS_BUILD>
    $<$<PLATFORM_ID:Linux>:LINUX_BUILD>
)

# 条件源文件
target_sources(myapp PRIVATE
    $<$<PLATFORM_ID:Windows>:src/windows.cpp>
    $<$<PLATFORM_ID:Linux>:src/linux.cpp>
)
```

## 6.4 实用技巧

### 条件编译

```cmake
# 选项
option(ENABLE_LOGGING "Enable logging" ON)
option(ENABLE_TESTING "Enable testing" ON)

if(ENABLE_LOGGING)
    target_compile_definitions(myapp PRIVATE LOGGING_ENABLED)
    target_sources(myapp PRIVATE src/logger.cpp)
endif()
```

### 版本信息

```cmake
project(MyApp VERSION 1.2.3)

# 生成版本头文件
configure_file(
    ${CMAKE_SOURCE_DIR}/version.h.in
    ${CMAKE_BINARY_DIR}/version.h
)

target_include_directories(myapp PRIVATE ${CMAKE_BINARY_DIR})
```

```cpp
// version.h.in
#ifndef VERSION_H
#define VERSION_H

#define APP_VERSION "@PROJECT_VERSION@"
#define APP_VERSION_MAJOR @PROJECT_VERSION_MAJOR@
#define APP_VERSION_MINOR @PROJECT_VERSION_MINOR@
#define APP_VERSION_PATCH @PROJECT_VERSION_PATCH@
#define APP_NAME "@PROJECT_NAME@"

#endif
```

### 自定义命令

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

### 自定义目标

```cmake
# 创建自定义目标
add_custom_target(generate_docs
    COMMAND doxygen ${CMAKE_SOURCE_DIR}/Doxyfile
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Generating documentation"
)

# 添加依赖
add_dependencies(myapp generate_docs)
```

### 文件查找

```cmake
# 收集源文件
# 方式一：明确列出（推荐）
set(SOURCES
    src/main.cpp
    src/utils.cpp
)

# 方式二：使用 file GLOB（不推荐，CMake 不自动更新）
file(GLOB SOURCES "src/*.cpp")

# 方式三：递归查找
file(GLOB_RECURSE SOURCES "src/*.cpp")

# 排除文件
list(FILTER SOURCES EXCLUDE REGEX ".*_test\\.cpp")
```

### 配置文件复制

```cmake
# 复制文件
configure_file(
    ${CMAKE_SOURCE_DIR}/data/config.json
    ${CMAKE_BINARY_DIR}/config.json
    COPYONLY
)

# 或使用 file
file(COPY ${CMAKE_SOURCE_DIR}/data/
    DESTINATION ${CMAKE_BINARY_DIR}/data/
)
```

## 6.5 CMakePresets.json

CMake 3.19+ 支持预设文件，简化构建配置。

```json
{
  "version": 3,
  "configurePresets": [
    {
      "name": "default",
      "displayName": "Default Config",
      "binaryDir": "${sourceDir}/build",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release",
        "CMAKE_CXX_STANDARD": "17"
      }
    },
    {
      "name": "debug",
      "displayName": "Debug Config",
      "inherits": "default",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug"
      }
    },
    {
      "name": "windows",
      "displayName": "Windows Config",
      "inherits": "default",
      "generator": "Visual Studio 17 2022",
      "condition": {
        "type": "equals",
        "lhs": "${hostSystemName}",
        "rhs": "Windows"
      }
    }
  ],
  "buildPresets": [
    {
      "name": "default",
      "configurePreset": "default"
    },
    {
      "name": "debug",
      "configurePreset": "debug"
    }
  ],
  "testPresets": [
    {
      "name": "default",
      "configurePreset": "default",
      "output": {
        "outputOnFailure": true
      }
    }
  ]
}
```

### 使用预设

```bash
# 配置
cmake --preset default
cmake --preset debug

# 构建
cmake --build --preset default

# 测试
ctest --preset default
```

## 6.6 完整项目示例

```
complete-project/
├── CMakeLists.txt
├── CMakePresets.json
├── src/
│   ├── CMakeLists.txt
│   ├── main.cpp
│   └── app.cpp
├── lib/
│   ├── CMakeLists.txt
│   ├── utils.cpp
│   └── utils.h
├── include/
│   └── mylib/
│       ├── api.h
│       └── types.h
├── tests/
│   ├── CMakeLists.txt
│   └── test_main.cpp
├── cmake/
│   ├── MyLibConfig.cmake.in
│   └── modules/
│       └── FindCustomLib.cmake
├── docs/
│   └── Doxyfile
└── build/
```

### 根目录 CMakeLists.txt

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
option(ENABLE_LTO "Enable link-time optimization" OFF)

# 添加模块路径
list(APPEND CMAKE_MODULE_PATH ${CMAKE_SOURCE_DIR}/cmake/modules)

# 添加子目录
add_subdirectory(lib)
add_subdirectory(src)

# 测试
if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()

# 示例
if(BUILD_EXAMPLES)
    add_subdirectory(examples)
endif()

# LTO
if(ENABLE_LTO)
    include(CheckIPOSupported)
    check_ipo_supported(RESULT lto_supported)
    if(lto_supported)
        set(CMAKE_INTERPROCEDURAL_OPTIMIZATION TRUE)
    endif()
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

## 6.7 总结

### CMake 关键要点

1. **使用现代 CMake**
   - 优先使用 `target_*` 命令
   - 避免全局变量
   - 使用生成器表达式

2. **理解目标概念**
   - 可执行文件、库都是目标
   - 使用 PRIVATE/PUBLIC/INTERFACE 控制依赖传递

3. **掌握包管理**
   - find_package 查找系统包
   - FetchContent 下载依赖
   - Conan/vcpkg 管理复杂依赖

4. **跨平台思维**
   - 使用平台检测变量
   - 使用生成器表达式
   - 避免硬编码路径

5. **测试集成**
   - 使用 CTest 管理测试
   - 集成 GoogleTest/Catch2

6. **合理组织项目**
   - 清晰的目录结构
   - 分离的 CMakeLists.txt
   - 使用 CMakePresets.json

### 推荐学习资源

- [CMake 官方文档](https://cmake.org/documentation/)
- [Modern CMake](https://cliutils.gitlab.io/modern-cmake/)
- [It's Time To Do CMake Right](https://pabloariasal.github.io/2018/02/19/its-time-to-do-cmake-right/)

## 6.8 实践练习

### 练习 1：安装配置

创建可安装的库项目：

- 生成 CMake 配置文件
- 导出目标
- 测试 find_package

### 练习 2：性能优化

应用性能优化技术：

- 启用预编译头文件
- 启用 LTO
- 测试编译时间差异

### 练习 3：完整项目

创建完整的跨平台项目：

- 多目录结构
- 测试集成
- 安装配置
- CMakePresets.json