# 1.1 C 语言简介

## C 语言历史

C 语言诞生于 1972 年，由 **Dennis Ritchie** 在贝尔实验室开发。

| 年份 | 事件 |
|------|------|
| 1969 | Ken Thompson 开发 B 语言 |
| 1972 | Dennis Ritchie 开发 C 语言 |
| 1978 | K&R C 出版（第一本 C 语言书籍） |
| 1989 | ANSI C 标准（C89/C90） |
| 1999 | C99 标准 |
| 2011 | C11 标准 |
| 2017 | C17/C18 标准 |

## C 语言特点

- **简洁高效** - 只有 32 个关键字
- **接近硬件** - 可直接操作内存
- **可移植性强** - 代码可在不同平台编译
- **应用广泛** - 操作系统、嵌入式、系统软件

## 编译过程

```
源代码 (.c) → 预处理 → 编译 → 汇编 → 链接 → 可执行文件
```

## 编译命令

```bash
# 基本编译
gcc -o hello hello.c
./hello

# 显示警告
gcc -Wall -Wextra -o hello hello.c

# 添加调试信息
gcc -g -o hello hello.c

# 优化编译
gcc -O2 -o hello hello.c
```

## 第一个 C 程序

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

**程序解析：**

| 代码 | 说明 |
|------|------|
| `#include <stdio.h>` | 包含标准输入输出头文件 |
| `int main()` | 主函数，程序入口点 |
| `printf()` | 标准库输出函数 |
| `return 0` | 返回 0 表示程序正常结束 |

## 编译运行示例

```bash
# 1. 创建文件 hello.c
# 2. 编译
gcc -o hello hello.c

# 3. 运行
./hello

# 输出：Hello, World!
```

## 练习

1. 编写程序输出你的姓名
2. 尝试使用不同的编译选项编译程序

---

[下一节：基本语法](02-syntax.md)
