# 10.2 stdlib.h - 标准库函数

## 内存分配

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // malloc - 分配内存
    int *ptr1 = (int*)malloc(10 * sizeof(int));

    // calloc - 分配并初始化为 0
    int *ptr2 = (int*)calloc(10, sizeof(int));

    // realloc - 重新分配
    ptr1 = (int*)realloc(ptr1, 20 * sizeof(int));

    // free - 释放内存
    free(ptr1);
    free(ptr2);

    return 0;
}
```

## 数值转换

### 字符串转数字

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    char *str;

    // atoi - 字符串转整数
    int num1 = atoi("123");
    printf("%d\n", num1);  // 123

    // strtol - 字符串转长整数（更安全）
    long num2 = strtol("456", &str, 10);
    printf("%ld\n", num2);  // 456

    // atof - 字符串转浮点数
    double num3 = atof("3.14");
    printf("%f\n", num3);  // 3.140000

    // strtod - 字符串转双精度
    double num4 = strtod("2.718", &str);
    printf("%f\n", num4);  // 2.718000

    // 不同进制
    printf("%ld\n", strtol("FF", &str, 16));   // 255
    printf("%ld\n", strtol("1010", &str, 2));  // 10
    printf("%ld\n", strtol("77", &str, 8));    // 63

    return 0;
}
```

### 数字转字符串

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    char buffer[100];

    // sprintf（常用）
    sprintf(buffer, "%d", 123);

    // itoa（非标准，某些编译器支持）
    // itoa(123, buffer, 10);

    return 0;
}
```

## 随机数

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    // 设置随机数种子
    srand(time(NULL));

    // 生成随机数
    int r1 = rand();
    printf("Random: %d\n", r1);

    // 范围随机数
    int r2 = rand() % 100;       // 0-99
    int r3 = rand() % 100 + 1;   // 1-100
    int r4 = rand() % 10 + 5;    // 5-14

    // 生成多个随机数
    printf("5 random numbers: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", rand() % 100);
    }
    printf("\n");

    return 0;
}
```

## 绝对值

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int a = abs(-10);
    printf("abs(-10) = %d\n", a);  // 10

    long b = labs(-100L);
    printf("labs(-100) = %ld\n", b);  // 100

    return 0;
}
```

## 排序和查找

```c
#include <stdio.h>
#include <stdlib.h>

// 比较函数
int compareInt(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}

int compareDesc(const void *a, const void *b) {
    return (*(int*)b - *(int*)a);
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);

    // qsort - 快速排序
    qsort(arr, n, sizeof(int), compareInt);

    printf("Sorted: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    // bsearch - 二分查找
    int key = 25;
    int *result = (int*)bsearch(&key, arr, n, sizeof(int), compareInt);

    if (result) {
        printf("Found %d at index %ld\n",
               key, result - arr);
    } else {
        printf("%d not found\n", key);
    }

    return 0;
}
```

## 程序控制

### exit 和 atexit

```c
#include <stdio.h>
#include <stdlib.h>

void cleanup() {
    printf("Cleaning up...\n");
}

int main() {
    // 注册退出时调用的函数
    atexit(cleanup);

    printf("Program running...\n");

    // 正常退出
    exit(0);

    // 或者返回
    // return 0;
}
```

### system

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 执行系统命令
    system("ls -la");  // Linux/Mac
    // system("dir");  // Windows

    system("echo Hello");

    return 0;
}
```

## 环境变量

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 获取环境变量
    char *path = getenv("PATH");
    if (path) {
        printf("PATH: %s\n", path);
    }

    // 设置环境变量
    setenv("MY_VAR", "Hello", 1);

    char *myVar = getenv("MY_VAR");
    if (myVar) {
        printf("MY_VAR: %s\n", myVar);
    }

    return 0;
}
```

## 完整示例

### 动态数组

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size;
    int capacity;
} IntArray;

void initArray(IntArray *arr, int capacity) {
    arr->data = (int*)malloc(capacity * sizeof(int));
    arr->size = 0;
    arr->capacity = capacity;
}

void push(IntArray *arr, int value) {
    if (arr->size >= arr->capacity) {
        arr->capacity *= 2;
        arr->data = (int*)realloc(arr->data, arr->capacity * sizeof(int));
    }
    arr->data[arr->size++] = value;
}

void freeArray(IntArray *arr) {
    free(arr->data);
    arr->size = arr->capacity = 0;
}

int main() {
    IntArray arr;
    initArray(&arr, 4);

    for (int i = 0; i < 10; i++) {
        push(&arr, i * i);
    }

    for (int i = 0; i < arr.size; i++) {
        printf("%d ", arr.data[i]);
    }
    printf("\n");

    freeArray(&arr);
    return 0;
}
```

### 猜数字游戏

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    srand(time(NULL));

    int target = rand() % 100 + 1;
    int guess;
    int attempts = 0;

    printf("Guess the number (1-100):\n");

    while (1) {
        printf("Your guess: ");
        scanf("%d", &guess);
        attempts++;

        if (guess == target) {
            printf("Correct! Attempts: %d\n", attempts);
            break;
        } else if (guess < target) {
            printf("Too low!\n");
        } else {
            printf("Too high!\n");
        }
    }

    return 0;
}
```

## 练习

1. 使用 qsort 排序字符串数组
2. 实现简单的内存池
3. 编写程序生成指定范围的随机密码
4. 使用 strtol 实现表达式计算器

---

[上一节：stdio.h](01-stdio.md) | [下一节：string.h](03-string.md)
