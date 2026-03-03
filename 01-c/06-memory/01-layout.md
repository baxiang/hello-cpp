# 6.1 内存布局

## 程序内存分布

```
高地址
+------------------+
|      栈 (Stack)   |  局部变量、函数参数
|        ↓         |  向下增长
+------------------+
|                  |
|       ...        |
|                  |
+------------------+
|        ↑         |  向上增长
|      堆 (Heap)   |  动态分配
+------------------+
|   未初始化数据   |  BSS 段
|   (bss)          |  初始化为 0
+------------------+
|   已初始化数据   |  数据段
|   (data)         |  全局/静态变量
+------------------+
|      代码段      |  程序代码
|    (text)        |  只读
+------------------+
低地址
```

## 各段详解

### 代码段（Text Segment）

```c
#include <stdio.h>

// 代码段：存放可执行代码
int add(int a, int b) {
    return a + b;
}

int main() {
    printf("%d\n", add(3, 5));
    return 0;
}
```

### 数据段（Data Segment）

```c
#include <stdio.h>

// 已初始化全局变量
int globalVar = 100;
static int staticVar = 200;

int main() {
    // 已初始化静态局部变量
    static int localStatic = 300;

    printf("globalVar = %d\n", globalVar);
    printf("staticVar = %d\n", staticVar);
    printf("localStatic = %d\n", localStatic);

    return 0;
}
```

### BSS 段

```c
#include <stdio.h>

// 未初始化全局变量（自动初始化为 0）
int uninitializedGlobal;

int main() {
    // 未初始化静态变量
    static int uninitializedStatic;

    printf("uninitializedGlobal = %d\n", uninitializedGlobal);
    printf("uninitializedStatic = %d\n", uninitializedStatic);

    return 0;
}
```

### 堆（Heap）

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 动态内存分配 - 堆
    int *ptr = (int*)malloc(sizeof(int) * 10);

    for (int i = 0; i < 10; i++) {
        ptr[i] = i * i;
    }

    for (int i = 0; i < 10; i++) {
        printf("%d ", ptr[i]);
    }
    printf("\n");

    free(ptr);  // 必须手动释放
    return 0;
}
```

### 栈（Stack）

```c
#include <stdio.h>

void func(int param) {
    int localVar = 10;  // 栈变量
    printf("param = %d, localVar = %d\n", param, localVar);
    // 函数返回时自动释放
}

int main() {
    int x = 100;  // 栈变量
    func(x);
    return 0;
}
```

## 各段大小查看

```c
#include <stdio.h>

int initialized = 42;
int uninitialized;

int main() {
    printf("Code segment: [text]\n");
    printf("Data segment (initialized): %p\n", (void*)&initialized);
    printf("BSS segment (uninitialized): %p\n", (void*)&uninitialized);

    int stackVar = 100;
    printf("Stack: %p\n", (void*)&stackVar);

    int *heapVar = malloc(sizeof(int));
    printf("Heap: %p\n", (void*)heapVar);
    free(heapVar);

    return 0;
}
```

运行后使用工具查看：
```bash
gcc -o mem mem.c
size mem          # 查看各段大小
```

## 字符串常量存储

```c
#include <stdio.h>

int main() {
    char *str1 = "Hello";      // 字符串常量（只读数据段）
    char str2[] = "Hello";     // 数组（栈）

    // str1[0] = 'h';  // 错误！常量不可修改
    str2[0] = 'h';      // 可以修改

    printf("str1 = %s\n", str1);
    printf("str2 = %s\n", str2);

    return 0;
}
```

## const 变量存储

```c
#include <stdio.h>

const int constGlobal = 100;  // 通常存储在.rodata（只读数据段）

int main() {
    const int constLocal = 200;
    printf("%d\n", constGlobal);
    printf("%d\n", constLocal);
    return 0;
}
```

## 内存对齐

```c
#include <stdio.h>
#include <stddef.h>

struct Unaligned {
    char a;      // 1 byte
    // 3 bytes padding
    int b;       // 4 bytes
    char c;      // 1 byte
    // 3 bytes padding
};

struct Aligned {
    char a;      // 1 byte
    char c;      // 1 byte
    // 2 bytes padding
    int b;       // 4 bytes
};

int main() {
    printf("Unaligned size: %zu\n", sizeof(struct Unaligned));  // 12
    printf("Aligned size: %zu\n", sizeof(struct Aligned));      // 8

    printf("offsetof b in Unaligned: %zu\n",
           offsetof(struct Unaligned, b));  // 4
    printf("offsetof b in Aligned: %zu\n",
           offsetof(struct Aligned, b));    // 2

    return 0;
}
```

## 完整示例

```c
#include <stdio.h>
#include <stdlib.h>

// 数据段
int globalInit = 100;
// BSS 段
int globalUninit;

void showMemory() {
    // 栈
    int stackVar = 42;
    static int staticVar = 200;  // 数据段

    printf("Stack variable: %p\n", (void*)&stackVar);
    printf("Static variable: %p\n", (void*)&staticVar);

    // 堆
    int *heapVar = malloc(sizeof(int));
    printf("Heap variable: %p\n", (void*)heapVar);
    free(heapVar);
}

int main() {
    printf("Global (init): %p\n", (void*)&globalInit);
    printf("Global (uninit): %p\n", (void*)&globalUninit);

    showMemory();

    // 代码地址
    printf("Code address (main): %p\n", (void*)main);

    return 0;
}
```

## 练习

1. 编写程序打印各个内存段的地址
2. 比较结构体不同成员顺序的大小差异
3. 分析程序的内存使用情况
4. 演示栈溢出（谨慎测试）

---

[上一节：函数指针](../../c/5-pointers/04-function-pointer.md) | [下一节：动态分配](02-allocation.md)
