# 1.4 变量和常量

## 变量声明和定义

```c
// 声明（不分配内存）
extern int x;

// 定义（分配内存）
int x = 10;

// 多个变量
int a, b, c;
int x = 1, y = 2, z = 3;
```

## 变量初始化

```c
// 声明时初始化
int x = 10;

// 先声明后赋值
int x;
x = 10;

// 注意：未初始化的局部变量值是未定义的
int y;  // y 的值不确定，使用前必须赋值
```

## 作用域

### 全局变量

```c
#include <stdio.h>

int global_var = 100;  // 全局变量，整个文件可见

void func() {
    printf("global_var = %d\n", global_var);
}

int main() {
    printf("global_var = %d\n", global_var);
    func();
    return 0;
}
```

### 局部变量

```c
#include <stdio.h>

void func() {
    int local_var = 10;  // 局部变量，只在函数内可见
    printf("local_var = %d\n", local_var);
}

int main() {
    // printf("%d\n", local_var);  // 错误！local_var 不可见
    return 0;
}
```

### 块级作用域

```c
#include <stdio.h>

int main() {
    int x = 10;
    printf("x = %d\n", x);  // 10

    {
        int x = 20;  // 新的 x，遮蔽外层 x
        printf("inner x = %d\n", x);  // 20
    }

    printf("x = %d\n", x);  // 10
    return 0;
}
```

## 存储类

### static 静态变量

```c
#include <stdio.h>

void counter() {
    static int count = 0;  // 静态变量，只初始化一次
    count++;
    printf("count = %d\n", count);
}

int main() {
    counter();  // count = 1
    counter();  // count = 2
    counter();  // count = 3
    return 0;
}
```

### extern 外部变量

```c
// file1.c
int shared_var = 100;

// file2.c
extern int shared_var;  // 引用 file1.c 中的变量
```

### register 寄存器变量

```c
register int counter = 0;  // 建议存储在寄存器中，访问更快
```

## const 限定符

```c
const int MAX_SIZE = 100;  // 常量，不可修改
int const LIMIT = 50;      // 同上，两种写法等价

// const 指针
const int *ptr1;           // 指向常量的指针（值不可改）
int *const ptr2 = &x;      // 常量指针（指向不可改）
const int *const ptr3 = &x; // 指向常量的常量指针
```

## #define 宏常量

```c
#include <stdio.h>

#define PI 3.14159
#define MAX_SIZE 100
#define SQUARE(x) ((x) * (x))

int main() {
    printf("PI = %f\n", PI);
    printf("SQUARE(5) = %d\n", SQUARE(5));
    return 0;
}
```

## 完整示例

```c
#include <stdio.h>

#define TAX_RATE 0.1

int global_counter = 0;

void process() {
    static int call_count = 0;
    call_count++;

    int local_var = 10;
    const int FIXED = 100;

    global_counter++;

    printf("call_count = %d\n", call_count);
    printf("global_counter = %d\n", global_counter);
    printf("local_var = %d\n", local_var);
    printf("FIXED = %d\n", FIXED);
}

int main() {
    process();
    process();
    process();
    return 0;
}
```

## 练习

1. 编写程序演示全局变量和局部变量的区别
2. 使用 static 实现一个函数调用计数器
3. 演示 const 指针的各种用法

---

[上一节：数据类型](03-data-types.md) | [下一节：运算符](05-operators.md)
