# 1.4 C++ 开发环境搭建

本章介绍如何在本地搭建 C++ 开发环境，包括编译器安装、IDE 配置和现代 C++ 开发工具。

## 1. 编译器安装

### macOS

```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 验证 Clang 版本
clang++ --version

# 使用 Homebrew 安装 GCC（可选）
brew install gcc

# 验证 GCC
g++-13 --version
```

**安装最新版 Clang：**

```bash
# 使用 Homebrew 安装 LLVM
brew install llvm

# 设置路径（添加到 ~/.zshrc 或 ~/.bash_profile）
export PATH="/usr/local/opt/llvm/bin:$PATH"
```

### Windows

**方式一：MinGW-w64（推荐）**

```bash
# 使用 MSYS2 安装
# 1. 下载安装 MSYS2: https://www.msys2.org/
# 2. 打开 MSYS2 终端

# 更新并安装 GCC
pacman -Syu
pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-gdb

# 添加到 PATH: C:\msys64\mingw64\bin
```

**方式二：Microsoft Visual C++（MSVC）**

1. 下载 Visual Studio Community：https://visualstudio.microsoft.com/
2. 安装时选择 "使用 C++ 的桌面开发"
3. 包含 MSVC 编译器和 Windows SDK

**方式三：Clang on Windows**

```bash
# 下载 LLVM 安装包
# https://releases.llvm.org/download.html

# 或使用 Chocolatey
choco install llvm
```

### Linux

**Ubuntu/Debian：**

```bash
# 安装完整开发工具链
sudo apt update
sudo apt install build-essential gdb

# 安装特定版本 GCC
sudo apt install gcc-12 g++-12

# 设置默认版本
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-12 100

# 验证
g++ --version
```

**Fedora：**

```bash
sudo dnf group install "Development Tools"
sudo dnf install gcc-c++ gdb
```

**Arch Linux：**

```bash
sudo pacman -S base-devel gdb
```

## 2. C++ 标准支持

### 编译器版本与标准支持

| 标准 | GCC 版本 | Clang 版本 | MSVC 版本 |
|------|----------|------------|-----------|
| C++11 | 4.8+ | 3.3+ | 2015+ |
| C++14 | 5.1+ | 3.4+ | 2015+ |
| C++17 | 7.0+ | 5.0+ | 2017 15.7+ |
| C++20 | 10.0+ | 10.0+ | 2019 16.10+ |
| C++23 | 13.0+ | 14.0+ | 2022 17.2+ |

### 指定 C++ 标准

```bash
# GCC/Clang
g++ -std=c++17 -o hello hello.cpp
g++ -std=c++20 -o hello hello.cpp
g++ -std=c++23 -o hello hello.cpp

# 查看支持的版本
g++ --help=warnings | grep std=
```

## 3. IDE/编辑器配置

### VSCode（推荐）

**安装扩展：**

```bash
# 必装扩展
code --install-extension ms-vscode.cpptools
code --install-extension ms-vscode.cmake-tools

# 推荐扩展
code --install-extension ms-vscode.cpptools-extension-pack
```

**tasks.json 配置：**

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "C++ Build",
      "type": "shell",
      "command": "g++",
      "args": [
        "-std=c++17",
        "-Wall",
        "-Wextra",
        "-g",
        "${file}",
        "-o",
        "${fileDirname}/${fileBasenameNoExtension}"
      ],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

**launch.json 配置：**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "C++ Debug",
      "type": "cppdbg",
      "request": "launch",
      "program": "${fileDirname}/${fileBasenameNoExtension}",
      "args": [],
      "stopAtEntry": false,
      "cwd": "${workspaceFolder}",
      "environment": [],
      "externalConsole": false,
      "MIMode": "lldb",
      "preLaunchTask": "C++ Build"
    }
  ]
}
```

### CLion

JetBrains 出品的跨平台 C++ IDE：

**特点：**
- 智能代码补全
- 强大的重构功能
- 内置 CMake 支持
- 调试器集成

**配置步骤：**
1. 下载安装 CLion
2. 配置 Toolchain（Settings → Build → Toolchains）
3. 选择编译器（GCC/Clang/MSVC）

### Visual Studio（Windows）

**配置步骤：**
1. 安装 Visual Studio Community
2. 选择 "使用 C++ 的桌面开发" 工作负载
3. 创建新项目选择 "控制台应用"

**项目配置：**
- 右键项目 → 属性 → C/C++ → 语言 → C++ 语言标准

### Xcode（macOS）

**配置步骤：**
1. 从 App Store 安装 Xcode
2. 创建新项目选择 "Command Line Tool"
3. 语言选择 C++

## 4. 构建工具

### CMake（推荐）

```bash
# 安装 CMake
# macOS
brew install cmake

# Ubuntu
sudo apt install cmake

# Windows
choco install cmake

# 验证
cmake --version
```

**基本使用：**

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.15)
project(MyProject)

set(CMAKE_CXX_STANDARD 17)

add_executable(myapp main.cpp)
```

```bash
# 构建流程
mkdir build && cd build
cmake ..
cmake --build .
```

### Make

```makefile
# Makefile
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -g

TARGET = myapp
SRCS = main.cpp utils.cpp
OBJS = $(SRCS:.cpp=.o)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)
```

## 5. 包管理工具

### vcpkg

```bash
# 安装 vcpkg
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg && ./bootstrap-vcpkg.sh

# 安装库
./vcpkg install fmt nlohmann-json

# CMake 集成
cmake -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake ..
```

### Conan

```bash
# 安装 Conan
pip install conan

# 配置
conan profile detect

# 安装依赖
conan install . --output-folder=build --build=missing
```

## 6. 调试工具

### GDB

```bash
# 编译时添加调试信息
g++ -g -std=c++17 -o myapp main.cpp

# 启动调试
gdb ./myapp

# 常用命令
(gdb) break main
(gdb) run
(gdb) next
(gdb) step
(gdb) print variable
(gdb) backtrace
(gdb) quit
```

### LLDB（macOS）

```bash
# 启动调试
lldb ./myapp

# 常用命令
(lldb) b main
(lldb) r
(lldb) n
(lldb) s
(lldb) p variable
(lldb) bt
(lldb) q
```

### VSCode 调试

配置 `launch.json` 后：
- F5：开始调试
- F9：设置断点
- F10：单步跳过
- F11：单步进入
- Shift+F11：单步跳出

## 7. 代码格式化

### clang-format

```bash
# 安装
brew install clang-format  # macOS
sudo apt install clang-format  # Ubuntu

# 格式化文件
clang-format -i main.cpp

# 生成配置文件
clang-format -style=Google -dump-config > .clang-format
```

**.clang-format 示例：**

```yaml
---
BasedOnStyle: Google
IndentWidth: 4
ColumnLimit: 100
Language: Cpp
Standard: c++17
```

## 8. 静态分析工具

### clang-tidy

```bash
# 安装
brew install llvm  # macOS (包含 clang-tidy)

# 运行检查
clang-tidy main.cpp -- -std=c++17

# 常用检查
clang-tidy -checks='modernize-*,performance-*' main.cpp --
```

### cppcheck

```bash
# 安装
brew install cppcheck  # macOS
sudo apt install cppcheck  # Ubuntu

# 运行检查
cppcheck --enable=all main.cpp
```

## 9. 项目结构建议

### 简单项目

```
hello/
├── main.cpp
└── CMakeLists.txt
```

### 中型项目

```
myproject/
├── CMakeLists.txt
├── src/
│   ├── main.cpp
│   ├── app.cpp
│   └── utils.cpp
├── include/
│   ├── app.hpp
│   └── utils.hpp
├── tests/
│   └── test_main.cpp
├── build/
└── README.md
```

### 大型项目

```
large-project/
├── CMakeLists.txt
├── cmake/
│   └── CompilerOptions.cmake
├── src/
│   ├── CMakeLists.txt
│   ├── core/
│   │   ├── CMakeLists.txt
│   │   └── ...
│   └── utils/
│       ├── CMakeLists.txt
│       └── ...
├── include/
├── tests/
├── docs/
├── third_party/
└── scripts/
```

## 10. 验证环境

创建测试文件验证开发环境：

**main.cpp：**
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

int main() {
    std::cout << "Hello, Modern C++!\n";

    // C++11 特性
    auto message = "C++11 auto";
    std::vector<int> nums = {1, 2, 3, 4, 5};  // 初始化列表

    // C++11 lambda
    std::for_each(nums.begin(), nums.end(), [](int n) {
        std::cout << n << " ";
    });
    std::cout << "\n";

    // C++17 特性
    if (auto it = std::find(nums.begin(), nums.end(), 3); it != nums.end()) {
        std::cout << "Found: " << *it << "\n";
    }

    // 打印编译器信息
    #ifdef __GNUC__
    std::cout << "GCC " << __GNUC__ << "." << __GNUC_MINOR__ << "\n";
    #elif defined(__clang__)
    std::cout << "Clang " << __clang_major__ << "." << __clang_minor__ << "\n";
    #elif defined(_MSC_VER)
    std::cout << "MSVC " << _MSC_VER << "\n";
    #endif

    // 打印 C++ 标准
    std::cout << "C++ Standard: " << __cplusplus << "\n";
    // 201103 = C++11, 201402 = C++14, 201703 = C++17, 202002 = C++20

    return 0;
}
```

```bash
# 编译运行
g++ -std=c++17 -Wall -o main main.cpp
./main
```

## 11. 常见问题

### 链接错误：undefined reference

```bash
# 确保链接顺序正确
g++ main.cpp -lmylib -o main

# 或使用 CMake 自动处理
```

### 找不到头文件

```bash
# 指定头文件路径
g++ -I./include -std=c++17 main.cpp -o main
```

### C++ 标准不支持

```bash
# 检查编译器版本
g++ --version

# 升级 GCC
brew upgrade gcc  # macOS
```

### Windows 中文乱码

```cpp
// 源文件开头添加
#include <windows.h>
SetConsoleOutputCP(65001);
```

## 下一步

环境搭建完成后，继续学习 [2.1 类基础](../02-classes/01-basics.md)。