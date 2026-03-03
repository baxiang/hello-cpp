# 5.1 指针基础

## 什么是指针

指针是存储内存地址的变量。

```c
#include <stdio.h>

int main() {
    int x = 10;
    int *ptr = &x;  // ptr 存储 x 的地址

    printf("x = %d\n", x);           // 10
    printf("&x = %p\n", &x);         // x 的地址
    printf("ptr = %p\n", ptr);       // 同 &x
    printf("*ptr = %d\n", *ptr);     // 10（解引用）
    printf("&ptr = %p\n", &ptr);     // ptr 自己的地址

    return 0;
}
```

## 指针声明和初始化

```c
#include <stdio.h>

int main() {
    int *ptr1;          // 指向 int 的指针
    float *ptr2;        // 指向 float 的指针
    char *ptr3;         // 指向 char 的指针

    int x = 10;
    int *ptr = &x;      // 声明时初始化

    // 注意：* 属于类型，不属于变量名
    int* a, b;          // a 是指针，b 是 int
    int *c, *d;         // c 和 d 都是指针

    return 0;
}
```

## 取地址和解引用

```c
#include <stdio.h>

int main() {
    int x = 10;

    // & 取地址运算符
    int *ptr = &x;

    // * 解引用运算符
    printf("*ptr = %d\n", *ptr);  // 10

    // 通过指针修改值
    *ptr = 20;
    printf("x = %d\n", x);  // 20

    return 0;
}
```

## 指针和 const

```c
#include <stdio.h>

int main() {
    int x = 10, y = 20;

    // 指向常量的指针（值不能改）
    const int *ptr1 = &x;
    // *ptr1 = 30;  // 错误！
    ptr1 = &y;       // 可以改指向

    // 常量指针（指向不能改）
    int *const ptr2 = &x;
    *ptr2 = 30;      // 可以改值
    // ptr2 = &y;    // 错误！

    // 指向常量的常量指针
    const int *const ptr3 = &x;
    // *ptr3 = 30;   // 错误！
    // ptr3 = &y;    // 错误！

    return 0;
}
```

## 指针运算

```c
#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = arr;  // 指向数组首元素

    // 指针算术
    printf("*ptr = %d\n", *ptr);      // 10
    printf("*(ptr+1) = %d\n", *(ptr+1));  // 20
    printf("*(ptr+2) = %d\n", *(ptr+2));  // 30

    // 自增自减
    ptr++;
    printf("*ptr = %d\n", *ptr);      // 20

    // 指针相减（元素个数）
    int *p1 = &arr[4];
    int *p2 = &arr[1];
    printf("p1 - p2 = %ld\n", p1 - p2);  // 3

    return 0;
}
```

## void 指针

```c
#include <stdio.h>

int main() {
    int x = 10;
    float f = 3.14f;
    char c = 'A';

    // void 指针可以指向任何类型
    void *ptr;

    ptr = &x;
    printf("int: %d\n", *(int*)ptr);

    ptr = &f;
    printf("float: %f\n", *(float*)ptr);

    ptr = &c;
    printf("char: %c\n", *(char*)ptr);

    return 0;
}
```

## 空指针

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = NULL;  // 空指针

    // 使用前检查
    if (ptr != NULL) {
        printf("%d\n", *ptr);
    } else {
        printf("ptr is NULL\n");
    }

    return 0;
}
```

## 指针示例

### 交换两个数

```c
#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    swap(&x, &y);
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
```

### 指针遍历数组

```c
#include <stdio.h>

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    int *ptr = arr;

    // 方法 1
    for (int i = 0; i < n; i++) {
        printf("%d ", *(ptr + i));
    }
    printf("\n");

    // 方法 2
    for (int *p = arr; p < arr + n; p++) {
        printf("%d ", *p);
    }
    printf("\n");

    return 0;
}
```

## 练习

1. 编写程序演示各种指针运算
2. 使用指针实现数组反转
3. 使用 void 指针实现通用打印函数
4. 编写程序比较不同指针类型的区别

---

[上一节：函数指针](../../c/4-functions/04-function-pointer.md) | [下一节：指针和数组](02-array.md)
