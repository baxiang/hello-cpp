# 附录 3. 调试技巧

## GDB 基础

```bash
# 编译带调试信息
g++ -g -o program main.cpp

# 启动 GDB
gdb ./program

# 常用命令
(gdb) break main          # 在 main 函数设断点
(gdb) break file.cpp:10   # 在指定行设断点
(gdb) run                 # 运行程序
(gdb) next                # 单步执行
(gdb) step                # 单步进入函数
(gdb) continue            # 继续执行
(gdb) print variable      # 打印变量
(gdb) backtrace           # 显示调用栈
(gdb) quit                # 退出
```

## 内存检测

### Valgrind

```bash
# 检测内存泄漏
valgrind --leak-check=full ./program

# 检测所有错误
valgrind --leak-check=full --show-leak-kinds=all ./program
```

### AddressSanitizer

```bash
# 编译时启用 ASan
g++ -fsanitize=address -g -o program main.cpp

# 运行（自动检测）
./program
```

## 常见调试场景

### 段错误调试

```bash
# 启用 core dump
ulimit -c unlimited

# 分析 core 文件
gdb ./program core
(gdb) backtrace
```

### 死锁检测

```bash
# 使用 GDB 查看线程
gdb ./program
(gdb) info threads
(gdb) thread apply all backtrace
```

## 日志调试

```cpp
#include <iostream>
#include <fstream>

#define DEBUG_LOG(msg) \
    std::cerr << "[DEBUG] " << __FILE__ \
              << ":" << __LINE__ << " " \
              << msg << std::endl

void process(int value) {
    DEBUG_LOG("value = " << value);
    // ...
}
```

## 练习

1. 使用 GDB 调试程序
2. 使用 Valgrind 检测内存泄漏
3. 添加日志帮助调试

---

[上一节：编译工具链](a2-toolchain.md)
