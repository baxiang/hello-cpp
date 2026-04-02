# 1.6 C 语言开发环境搭建

本章介绍如何在本地搭建 C 语言开发环境，包括编译器安装、编辑器配置和基本开发工具。

## 1. 编译器安装

### macOS

macOS 默认带有 Clang 编译器，可通过 Xcode Command Line Tools 安装：

```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 验证安装
gcc --version
# 输出: Apple clang version 14.x.x

# 或使用 Homebrew 安装 GCC
brew install gcc

# 验证 GCC
gcc-13 --version
```

**使用 Homebrew 安装 GCC：**

```bash
# 安装最新版 GCC
brew install gcc

# 查看安装的版本
ls /usr/local/bin/gcc*
```

### Windows

**方式一：MinGW-w64（推荐）**

1. 下载 MSYS2：https://www.msys2.org/
2. 安装后打开 MSYS2 终端，运行：

```bash
# 更新包数据库
pacman -Syu

# 安装 MinGW-w64 GCC
pacman -S mingw-w64-x86_64-gcc

# 安装调试器
pacman -S mingw-w64-x86_64-gdb
```

3. 添加到系统 PATH：
   - 将 `C:\msys64\mingw64\bin` 添加到环境变量

**方式二：TDM-GCC**

1. 下载 TDM-GCC：https://jmeubank.github.io/tdm-gcc/
2. 运行安装程序，选择 "Create"
3. 验证安装：

```cmd
gcc --version
g++ --version
```

**方式三：Microsoft Visual C（MSVC）**

1. 安装 Visual Studio Community（免费）
2. 选择 "使用 C++ 的桌面开发"
3. 使用 Developer Command Prompt 编译

### Linux

**Ubuntu/Debian：**

```bash
# 更新包列表
sudo apt update

# 安装 GCC 和相关工具
sudo apt install build-essential

# 安装调试器
sudo apt install gdb

# 验证安装
gcc --version
g++ --version
make --version
```

**Fedora/RHEL：**

```bash
# 安装开发工具组
sudo dnf group install "Development Tools"

# 验证
gcc --version
```

**Arch Linux：**

```bash
# 安装 base-devel 包组
sudo pacman -S base-devel

# 验证
gcc --version
```

## 2. 编译器对比

| 编译器 | 平台 | 特点 |
|--------|------|------|
| GCC | 全平台 | 开源免费，标准支持好 |
| Clang | 全平台 | 编译快，错误信息友好 |
| MSVC | Windows | Visual Studio 集成好 |

### GCC vs Clang

```bash
# GCC 编译
gcc -o hello hello.c

# Clang 编译
clang -o hello hello.c

# 查看版本
gcc --version
clang --version
```

## 3. 编辑器/IDE 选择

### VSCode（推荐新手）

**优点：**
- 免费开源
- 插件丰富
- 跨平台

**安装步骤：**

1. 下载 VSCode：https://code.visualstudio.com/
2. 安装 C/C++ 扩展：

```bash
# 命令行安装
code --install-extension ms-vscode.cpptools
```

**推荐扩展：**
- C/C++ (ms-vscode.cpptools)
- C/C++ Extension Pack
- Code Runner (formulahendry.code-runner)

### CLion（推荐专业开发）

JetBrains 出品的 C/C++ IDE：

- 强大的代码分析
- 内置调试器
- CMake 支持

下载：https://www.jetbrains.com/clion/

### Visual Studio（Windows 推荐）

微软官方 IDE：

- 调试功能强大
- IntelliSense 智能提示
- Windows 开发首选

下载：https://visualstudio.microsoft.com/

### 其他选择

| IDE/编辑器 | 平台 | 特点 |
|------------|------|------|
| Code::Blocks | 全平台 | 轻量级，适合学习 |
| Dev-C++ | Windows | 简单易用，适合初学者 |
| Vim/Neovim | 全平台 | 高效，学习曲线陡 |
| Sublime Text | 全平台 | 快速，需要配置 |

## 4. 命令行编译

### 基本编译

```bash
# 编译单个文件
gcc -o hello hello.c

# 运行程序
./hello          # macOS/Linux
hello.exe        # Windows
```

### 常用编译选项

```bash
# 显示所有警告
gcc -Wall -Wextra -o hello hello.c

# 添加调试信息
gcc -g -o hello hello.c

# 指定 C 标准
gcc -std=c11 -o hello hello.c

# 优化级别
gcc -O0 -o hello hello.c    # 无优化（调试用）
gcc -O1 -o hello hello.c    # 基本优化
gcc -O2 -o hello hello.c    # 标准优化
gcc -O3 -o hello hello.c    # 激进优化

# 预处理
gcc -E hello.c -o hello.i

# 只编译不链接
gcc -c hello.c -o hello.o

# 链接目标文件
gcc hello.o -o hello
```

### 多文件编译

```bash
# 方式一：一次编译
gcc -o myapp main.c utils.c math.c

# 方式二：分别编译后链接
gcc -c main.c -o main.o
gcc -c utils.c -o utils.o
gcc -c math.c -o math.o
gcc main.o utils.o math.o -o myapp
```

### 使用 Makefile

```makefile
# Makefile
CC = gcc
CFLAGS = -Wall -Wextra -g
TARGET = myapp
SRCS = main.c utils.c math.c
OBJS = $(SRCS:.c=.o)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)
```

```bash
# 使用 make 构建
make

# 清理
make clean
```

## 5. 调试工具

### GDB 基本使用

```bash
# 编译时添加调试信息
gcc -g -o hello hello.c

# 启动 GDB
gdb ./hello

# GDB 命令
(gdb) break main      # 在 main 函数设置断点
(gdb) run             # 运行程序
(gdb) next            # 单步执行（不进入函数）
(gdb) step            # 单步执行（进入函数）
(gdb) print var       # 打印变量值
(gdb) continue        # 继续执行
(gdb) quit            # 退出 GDB
```

### LLDB（macOS）

```bash
# 启动 LLDB
lldb ./hello

# LLDB 命令
(lldb) breakpoint set --name main
(lldb) run
(lldb) n              # next
(lldb) s              # step
(lldb) p var          # print
(lldb) c              # continue
(lldb) q              # quit
```

## 6. 项目结构建议

### 简单项目

```
hello/
├── hello.c
└── Makefile
```

### 中型项目

```
myproject/
├── src/
│   ├── main.c
│   ├── utils.c
│   └── math.c
├── include/
│   ├── utils.h
│   └── math.h
├── build/
├── Makefile
└── README.md
```

## 7. 验证环境

创建测试文件验证开发环境：

**hello.c：**
```c
#include <stdio.h>

int main() {
    printf("Hello, C!\n");
    printf("Compiler: ");
    
    #ifdef __GNUC__
    printf("GCC %d.%d.%d\n", __GNUC__, __GNUC_MINOR__, __GNUC_PATCHLEVEL__);
    #elif defined(__clang__)
    printf("Clang %d.%d.%d\n", __clang_major__, __clang_minor__, __clang_patchlevel__);
    #elif defined(_MSC_VER)
    printf("MSVC %d\n", _MSC_VER);
    #else
    printf("Unknown\n");
    #endif
    
    return 0;
}
```

```bash
# 编译运行
gcc -o hello hello.c
./hello
```

## 8. 常见问题

### 找不到 gcc 命令

```bash
# 检查是否安装
which gcc
which clang

# 检查 PATH
echo $PATH
```

### 头文件找不到

```bash
# 指定头文件路径
gcc -I./include -o hello hello.c
```

### 链接错误

```bash
# 指定库路径和库名
gcc -L./lib -lmylib -o hello hello.c
```

### Windows 中文乱码

```cmd
# 切换代码页为 UTF-8
chcp 65001

# 或使用 UTF-8 编译选项
gcc -fexec-charset=GBK -o hello hello.c
```

## 下一步

环境搭建完成后，继续学习 [2.1 条件语句](../02-control/01-conditionals.md)。