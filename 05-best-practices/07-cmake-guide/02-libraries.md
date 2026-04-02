# 2. 库的构建与使用

本章介绍如何在 CMake 中构建和使用各种类型的库。

## 2.1 库的类型

CMake 支持四种库类型：

| 类型 | 关键字 | 说明 |
|------|--------|------|
| 静态库 | STATIC | 编译时链接，嵌入可执行文件 |
| 共享库 | SHARED | 运行时链接，独立文件 |
| 头文件库 | INTERFACE | 仅头文件，无编译产物 |
| 对象库 | OBJECT | 中间编译结果，可共享 |

## 2.2 静态库

静态库在编译时被嵌入可执行文件，扩展名为 `.a` (Linux/macOS) 或 `.lib` (Windows)。

### 创建静态库

```cmake
# 创建静态库
add_library(mylib STATIC
    src/utils.cpp
    src/math.cpp
)

# 设置头文件路径
target_include_directories(mylib PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

# 编译选项
target_compile_options(mylib PRIVATE
    -Wall -Wextra
)
```

### 使用静态库

```cmake
# 创建可执行文件
add_executable(myapp src/main.cpp)

# 链接静态库
target_link_libraries(myapp PRIVATE mylib)

# 头文件路径会自动传递（因为 mylib 使用了 PUBLIC）
```

### 静态库特点

- **优点**：部署简单，无运行时依赖
- **缺点**：文件体积大，更新需重新编译

## 2.3 共享库

共享库在运行时动态加载，扩展名为 `.so` (Linux)、`.dylib` (macOS) 或 `.dll` (Windows)。

### 创建共享库

```cmake
# 创建共享库
add_library(mylib SHARED
    src/utils.cpp
)

# 设置库版本
set_target_properties(mylib PROPERTIES
    VERSION 1.0.0       # 完整版本
    SOVERSION 1         # ABI 版本
)

# 设置头文件路径
target_include_directories(mylib PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)
```

### 版本号说明

共享库版本号格式：`libmylib.so.1.0.0`

- `SOVERSION` (1)：主版本号，ABI 不兼容时更新
- `VERSION` (1.0.0)：完整版本号

生成的文件：
```
libmylib.so -> libmylib.so.1     # 符号链接
libmylib.so.1 -> libmylib.so.1.0.0  # 符号链接
libmylib.so.1.0.0                # 实际文件
```

### Windows DLL 特殊处理

```cmake
if(WIN32)
    # 定义导出宏
    target_compile_definitions(mylib PRIVATE MYLIB_EXPORTS)

    # 导出符号
    set_target_properties(mylib PROPERTIES
        WINDOWS_EXPORT_ALL_SYMBOLS ON
    )
endif()
```

### 共享库特点

- **优点**：文件小，可独立更新，多程序共享
- **缺点**：部署需确保库文件存在，版本兼容问题

## 2.4 头文件库（Header-only）

头文件库只有头文件，无需编译，如 Catch2、stb 库。

### 创建头文件库

```cmake
# 创建头文件库
add_library(myheaderlib INTERFACE)

# 设置头文件路径（INTERFACE 表示仅传递给使用者）
target_include_directories(myheaderlib INTERFACE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)
```

### 使用头文件库

```cmake
# 链接头文件库
target_link_libraries(myapp PRIVATE myheaderlib)

# 头文件路径会自动添加
```

### INTERFACE 关键字说明

| 关键字 | 含义 |
|--------|------|
| PRIVATE | 仅用于当前目标 |
| PUBLIC | 用于当前目标和依赖者 |
| INTERFACE | 仅传递给依赖者 |

对于头文件库：
- 使用 `INTERFACE` 因为库本身不需要编译
- 依赖者需要头文件路径

## 2.5 对象库（Object Library）

对象库是编译后的中间文件，可被多个目标共享，避免重复编译。

### 创建对象库

```cmake
# 创建对象库
add_library(common_objs OBJECT
    utils.cpp
    helpers.cpp
)

# 设置编译选项
target_compile_options(common_objs PRIVATE
    -Wall -Wextra
)
```

### 使用对象库

```cmake
# 方式一：使用生成器表达式
add_executable(app1 main1.cpp $<TARGET_OBJECTS:common_objs>)
add_executable(app2 main2.cpp $<TARGET_OBJECTS:common_objs>)

# 方式二：链接对象库（CMake 3.12+）
add_executable(app1 main1.cpp)
target_link_libraries(app1 PRIVATE common_objs)
```

### 对象库应用场景

- 多个可执行文件共享相同源码
- 需要不同编译选项的同一源码
- 减少重复编译时间

## 2.6 库的依赖传递

理解 PRIVATE/PUBLIC/INTERFACE 的依赖传递：

```cmake
# 库 A
add_library(A STATIC a.cpp)
target_include_directories(A PUBLIC include/A)

# 库 B 依赖 A
add_library(B STATIC b.cpp)
target_link_libraries(B PUBLIC A)  # PUBLIC: A 的依赖传递给 B 的使用者

# 可执行文件依赖 B
add_executable(app main.cpp)
target_link_libraries(app PRIVATE B)
# app 自动获得 A 和 B 的头文件路径
```

### 依赖传递规则

| 目标 B 链接 A | B 获得 A 的 | app 链接 B 后获得 |
|---------------|-------------|-------------------|
| PRIVATE A | PRIVATE + PUBLIC | 无 |
| PUBLIC A | PRIVATE + PUBLIC | PUBLIC |
| INTERFACE A | INTERFACE | INTERFACE |

### 最佳实践

```cmake
# 实现细节依赖 → PRIVATE
target_link_libraries(mylib PRIVATE internal_lib)

# API 依赖 → PUBLIC
target_link_libraries(mylib PUBLIC api_lib)

# 仅头文件依赖 → INTERFACE
target_link_libraries(myheaderlib INTERFACE other_headerlib)
```

## 2.7 库属性设置

### 常用属性

```cmake
# 设置输出名称
set_target_properties(mylib PROPERTIES
    OUTPUT_NAME "my_library"  # 输出为 libmy_library.so
)

# 设置输出目录
set_target_properties(mylib PROPERTIES
    LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
    ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
)

# 设置 C++ 标准
set_target_properties(mylib PROPERTIES
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED ON
)

# 设置位置无关代码（共享库需要）
set_target_properties(mylib SHARED PROPERTIES
    POSITION_INDEPENDENT_CODE ON
)
```

### 获取属性

```cmake
# 获取目标属性
get_target_property(output_name mylib OUTPUT_NAME)
message(STATUS "Output name: ${output_name}")
```

## 2.8 条件构建库

```cmake
# 根据选项选择库类型
option(BUILD_SHARED_LIBS "Build shared libraries" ON)

# 自动选择（ON 时为 SHARED，OFF 时为 STATIC）
add_library(mylib lib.cpp)

# 或手动控制
if(BUILD_SHARED_LIBS)
    add_library(mylib SHARED lib.cpp)
else()
    add_library(mylib STATIC lib.cpp)
endif()
```

## 2.9 完整示例

### 项目结构

```
lib-project/
├── CMakeLists.txt
├── include/
│   └── mylib/
│       ├── utils.h
│       └── math.h
├── src/
│   ├── utils.cpp
│   └── math.cpp
└── examples/
    ├── CMakeLists.txt
    └── main.cpp
```

### 根目录 CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.15)
project(MyLib VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 选项
option(BUILD_SHARED_LIBS "Build shared library" ON)
option(BUILD_EXAMPLES "Build examples" ON)

# 创建库
add_library(mylib
    src/utils.cpp
    src/math.cpp
)

target_include_directories(mylib PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)

target_compile_options(mylib PRIVATE
    -Wall -Wextra -Wpedantic
)

# 设置版本
set_target_properties(mylib PROPERTIES
    VERSION ${PROJECT_VERSION}
    SOVERSION 1
)

# 别名目标（方便使用）
add_library(MyLib::mylib ALIAS mylib)

# 示例
if(BUILD_EXAMPLES)
    add_subdirectory(examples)
endif()
```

### examples/CMakeLists.txt

```cmake
add_executable(example main.cpp)
target_link_libraries(example PRIVATE MyLib::mylib)
```

## 2.10 实践练习

### 练习 1：创建静态库

创建一个数学运算静态库：

- 包含 `add()`、`subtract()`、`multiply()` 函数
- 创建测试程序调用这些函数
- 使用 `PUBLIC` 导出头文件路径

### 练习 2：创建共享库

将练习 1 的静态库改为共享库：

- 设置版本号 1.0.0
- 添加 SOVERSION
- 测试运行时加载

### 练习 3：对象库

创建一个对象库，被两个可执行文件使用：

- 验证只编译一次
- 比较编译时间差异

## 下一步

掌握库的构建后，继续阅读 [03-dependencies.md](03-dependencies.md) 学习依赖管理。