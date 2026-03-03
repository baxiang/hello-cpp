# 4.4 函数指针

## 函数指针基础

```c
#include <stdio.h>

// 普通函数
int add(int a, int b) {
    return a + b;
}

int sub(int a, int b) {
    return a - b;
}

int main() {
    // 函数指针声明
    int (*funcPtr)(int, int);

    // 指向 add 函数
    funcPtr = add;

    // 通过函数指针调用
    printf("3 + 5 = %d\n", funcPtr(3, 5));
    printf("3 + 5 = %d\n", (*funcPtr)(3, 5));  // 两种写法等价

    // 指向 sub 函数
    funcPtr = sub;
    printf("10 - 3 = %d\n", funcPtr(10, 3));

    return 0;
}
```

## 函数指针数组

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }
int div(int a, int b) { return a / b; }

int main() {
    // 函数指针数组
    int (*ops[])(int, int) = {add, sub, mul, div};
    char *opNames[] = {"+", "-", "*", "/"};

    int a = 10, b = 5;

    for (int i = 0; i < 4; i++) {
        printf("%d %s %d = %d\n", a, opNames[i], b, ops[i](a, b));
    }

    return 0;
}
```

## 回调函数

```c
#include <stdio.h>

// 比较函数类型
typedef int (*CompareFunc)(int, int);

int ascending(int a, int b) {
    return a - b;  // 升序
}

int descending(int a, int b) {
    return b - a;  // 降序
}

// 使用回调函数排序
void sort(int arr[], int n, CompareFunc cmp) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (cmp(arr[j], arr[j + 1]) > 0) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int main() {
    int arr[] = {5, 2, 8, 1, 9};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original: ");
    printArray(arr, n);

    sort(arr, n, ascending);
    printf("Ascending: ");
    printArray(arr, n);

    sort(arr, n, descending);
    printf("Descending: ");
    printArray(arr, n);

    return 0;
}
```

## qsort 使用示例

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 比较整数
int compareInt(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}

// 比较字符串
int compareStr(const void *a, const void *b) {
    return strcmp(*(const char**)a, *(const char**)b);
}

int main() {
    // 排序整数
    int nums[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(nums) / sizeof(nums[0]);

    qsort(nums, n, sizeof(int), compareInt);

    printf("Sorted nums: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", nums[i]);
    }
    printf("\n");

    // 排序字符串
    char *strs[] = {"banana", "apple", "cherry", "date"};
    int m = 4;

    qsort(strs, m, sizeof(char*), compareStr);

    printf("Sorted strings: ");
    for (int i = 0; i < m; i++) {
        printf("%s ", strs[i]);
    }
    printf("\n");

    return 0;
}
```

## 函数指针作为返回值

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

// 返回函数指针
int (*getOperation(char op))(int, int) {
    switch (op) {
        case '+': return add;
        case '-': return sub;
        default: return NULL;
    }
}

// 使用 typedef 简化
typedef int (*OpFunc)(int, int);

OpFunc getOp(char op) {
    switch (op) {
        case '+': return add;
        case '-': return sub;
        default: return NULL;
    }
}

int main() {
    OpFunc op = getOp('+');
    if (op) {
        printf("3 + 5 = %d\n", op(3, 5));
    }

    op = getOp('-');
    if (op) {
        printf("10 - 3 = %d\n", op(10, 3));
    }

    return 0;
}
```

## 完整示例 - 简单解释器

```c
#include <stdio.h>
#include <stdlib.h>

typedef double (*BinaryOp)(double, double);
typedef double (*UnaryOp)(double);

double add(double a, double b) { return a + b; }
double sub(double a, double b) { return a - b; }
double mul(double a, double b) { return a * b; }
double div(double a, double b) { return a / b; }

double square(double x) { return x * x; }
double sqrt_op(double x) { return sqrt(x); }

int main() {
    BinaryOp binOps[] = {add, sub, mul, div};
    char binChars[] = {'+', '-', '*', '/'};

    double a = 10.0, b = 5.0;

    printf("Binary operations on %.1f and %.1f:\n", a, b);
    for (int i = 0; i < 4; i++) {
        printf("%.1f %c %.1f = %.1f\n",
               a, binChars[i], b, binOps[i](a, b));
    }

    return 0;
}
```

## 练习

1. 使用函数指针实现简单计算器
2. 使用 qsort 排序结构体数组
3. 实现一个函数，接受回调函数处理数组每个元素
4. 使用函数指针实现状态机

---

[上一节：递归](03-recursion.md) | [下一节：指针基础](../../c/5-pointers/01-basics.md)
