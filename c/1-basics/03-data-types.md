# 1.3 数据类型

## 基本数据类型

| 类型 | 大小（典型） | 范围 | 格式符 |
|------|-------------|------|--------|
| `char` | 1 字节 | -128 ~ 127 | `%c` |
| `int` | 4 字节 | -2³¹ ~ 2³¹-1 | `%d` |
| `float` | 4 字节 | 6-7 位有效数字 | `%f` |
| `double` | 8 字节 | 15-16 位有效数字 | `%lf` |
| `void` | 0 字节 | 无类型 | - |

## 示例代码

```c
#include <stdio.h>

int main() {
    char c = 'A';
    int i = 100;
    float f = 3.14f;
    double d = 3.1415926;

    printf("char: %c\n", c);
    printf("int: %d\n", i);
    printf("float: %f\n", f);
    printf("double: %.2lf\n", d);

    return 0;
}
```

## 类型修饰符

```c
// signed - 有符号（默认）
signed int x = -10;

// unsigned - 无符号，只能表示非负数
unsigned int y = 100;
unsigned int z = 0xFFFFFFFF;  // 4294967295

// short - 短整型（至少 16 位）
short s = 32767;

// long - 长整型（至少 32 位）
long l = 2147483647L;

// long long - 至少 64 位
long long ll = 9223372036854775807LL;
```

## 类型大小查询

```c
#include <stdio.h>

int main() {
    printf("char: %zu bytes\n", sizeof(char));
    printf("short: %zu bytes\n", sizeof(short));
    printf("int: %zu bytes\n", sizeof(int));
    printf("long: %zu bytes\n", sizeof(long));
    printf("long long: %zu bytes\n", sizeof(long long));
    printf("float: %zu bytes\n", sizeof(float));
    printf("double: %zu bytes\n", sizeof(double));

    return 0;
}
```

**典型输出（32/64 位系统）：**
```
char: 1 bytes
short: 2 bytes
int: 4 bytes
long: 8 bytes
long long: 8 bytes
float: 4 bytes
double: 8 bytes
```

## 格式化输出详解

```c
#include <stdio.h>

int main() {
    int x = 42;
    float f = 3.14159f;

    // 整数格式
    printf("%d\n", x);      // 十进制：42
    printf("%o\n", x);      // 八进制：52
    printf("%x\n", x);      // 十六进制：2a
    printf("%X\n", x);      // 十六进制大写：2A

    // 浮点数格式
    printf("%f\n", f);      // 默认：3.141590
    printf("%.2f\n", f);    // 保留 2 位小数：3.14
    printf("%e\n", f);      // 科学计数法：3.141590e+00

    // 宽度和对齐
    printf("%5d\n", x);     // 宽度 5，右对齐
    printf("%-5d\n", x);    // 宽度 5，左对齐
    printf("%05d\n", x);    // 宽度 5，前导零填充

    return 0;
}
```

## 练习

1. 编写程序打印所有基本数据类型的大小
2. 演示 unsigned 和 signed 的区别
3. 使用不同格式符输出同一个数字

---

[上一节：基本语法](02-syntax.md) | [下一节：变量和常量](04-variables.md)
