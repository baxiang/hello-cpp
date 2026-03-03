# 1.5 运算符

## 算术运算符

```c
#include <stdio.h>

int main() {
    int a = 10, b = 3;

    printf("a + b = %d\n", a + b);   // 加：13
    printf("a - b = %d\n", a - b);   // 减：7
    printf("a * b = %d\n", a * b);   // 乘：30
    printf("a / b = %d\n", a / b);   // 除：3（整数除法）
    printf("a %% b = %d\n", a % b);  // 取余：1

    // 自增自减
    int x = 5;
    printf("++x = %d\n", ++x);  // 前缀：先增后用，6
    printf("x++ = %d\n", x++);  // 后缀：先用后增，6
    printf("x = %d\n", x);      // 7

    return 0;
}
```

## 关系运算符

```c
#include <stdio.h>

int main() {
    int a = 10, b = 5;

    printf("a == b: %d\n", a == b);  // 等于：0
    printf("a != b: %d\n", a != b);  // 不等于：1
    printf("a > b: %d\n", a > b);    // 大于：1
    printf("a < b: %d\n", a < b);    // 小于：0
    printf("a >= b: %d\n", a >= b);  // 大于等于：1
    printf("a <= b: %d\n", a <= b);  // 小于等于：0

    // 结果为 1 (真) 或 0 (假)
    return 0;
}
```

## 逻辑运算符

```c
#include <stdio.h>

int main() {
    int a = 1, b = 0;

    printf("a && b: %d\n", a && b);  // 逻辑与：0
    printf("a || b: %d\n", a || b);  // 逻辑或：1
    printf("!a: %d\n", !a);          // 逻辑非：0

    // 短路求值
    int x = 5;
    if (x > 0 || ++x > 10) {
        // ++x 不会执行，因为 x > 0 已为真
    }
    printf("x = %d\n", x);  // 5

    return 0;
}
```

## 位运算符

```c
#include <stdio.h>

int main() {
    unsigned char a = 0x55;  // 0101 0101
    unsigned char b = 0x33;  // 0011 0011

    printf("a & b = 0x%02X\n", a & b);   // 按位与：0x11
    printf("a | b = 0x%02X\n", a | b);   // 按位或：0x77
    printf("a ^ b = 0x%02X\n", a ^ b);   // 按位异或：0x66
    printf("~a = 0x%02X\n", ~a);         // 按位取反：0xAA
    printf("a << 1 = 0x%02X\n", a << 1); // 左移：0xAA
    printf("a >> 1 = 0x%02X\n", a >> 1); // 右移：0x2A

    return 0;
}
```

## 赋值运算符

```c
int x = 10;

x += 5;   // x = x + 5 → 15
x -= 3;   // x = x - 3 → 12
x *= 2;   // x = x * 2 → 24
x /= 4;   // x = x / 4 → 6
x %= 3;   // x = x % 3 → 0

x = 10;
x <<= 1;  // x = x << 1 → 20
x >>= 1;  // x = x >> 1 → 10
x &= 0xF; // x = x & 0xF → 10
x |= 0x1; // x = x | 0x1 → 11
x ^= 0x1; // x = x ^ 0x1 → 10
```

## 其他运算符

### 条件运算符（三元运算符）

```c
int a = 10, b = 20;
int max = (a > b) ? a : b;  // max = 20

// 等价于 if-else
if (a > b) {
    max = a;
} else {
    max = b;
}
```

### 逗号运算符

```c
int x, y, result;
result = (x = 5, y = 10, x + y);  // result = 15

// 常用于 for 循环
for (int i = 0, j = 10; i < j; i++, j--) {
    printf("%d %d\n", i, j);
}
```

### sizeof 运算符

```c
printf("int: %zu bytes\n", sizeof(int));
printf("double: %zu bytes\n", sizeof(double));

int arr[10];
printf("arr: %zu bytes\n", sizeof(arr));  // 40
printf("count: %zu\n", sizeof(arr)/sizeof(arr[0]));  // 10
```

### 取地址&和解引用*

```c
int x = 10;
int *ptr = &x;   // & 取地址
int value = *ptr; // * 解引用，value = 10
```

## 运算符优先级（从高到低）

| 优先级 | 运算符 |
|--------|--------|
| 1 | `()` `[]` `->` `.` |
| 2 | `!` `~` `++` `--` `+` `-` `*` `&` `(type)` `sizeof` |
| 3 | `*` `/` `%` |
| 4 | `+` `-` |
| 5 | `<<` `>>` |
| 6 | `<` `<=` `>` `>=` |
| 7 | `==` `!=` |
| 8 | `&` |
| 9 | `^` |
| 10 | `\|` |
| 11 | `&&` |
| 12 | `\|\|` |
| 13 | `?:` |
| 14 | `=` `+=` `-=` ... |
| 15 | `,` |

## 练习

1. 编写程序演示所有算术运算符
2. 使用位运算实现两个数交换（不使用临时变量）
3. 编写程序判断闰年（使用逻辑运算符）

---

[上一节：变量和常量](04-variables.md) | [下一节：条件语句](../../c/2-control/01-conditionals.md)
