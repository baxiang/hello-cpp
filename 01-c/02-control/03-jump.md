# 2.3 跳转语句

## break 语句

### 在 switch 中

```c
#include <stdio.h>

int main() {
    int day = 3;

    switch (day) {
        case 1:
            printf("Monday\n");
            break;  // 跳出 switch
        case 2:
            printf("Tuesday\n");
            break;
        case 3:
            printf("Wednesday\n");
            break;  // 执行后跳出
        default:
            printf("Invalid\n");
    }

    printf("After switch\n");  // 会继续执行到这里
    return 0;
}
```

### 在循环中

```c
#include <stdio.h>

int main() {
    // 找到第一个能被 7 整除的数
    for (int i = 1; i <= 100; i++) {
        if (i % 7 == 0) {
            printf("Found: %d\n", i);  // Found: 7
            break;  // 找到后退出循环
        }
    }

    // 查找元素
    int arr[] = {1, 3, 5, 7, 9};
    int target = 5;
    int found = 0;

    for (int i = 0; i < 5; i++) {
        if (arr[i] == target) {
            printf("Found at index %d\n", i);
            found = 1;
            break;  // 找到后退出
        }
    }

    if (!found) {
        printf("Not found\n");
    }

    return 0;
}
```

### break 只能跳出一层循环

```c
#include <stdio.h>

int main() {
    for (int i = 1; i <= 3; i++) {
        printf("Outer: %d\n", i);

        for (int j = 1; j <= 3; j++) {
            if (j == 2) {
                break;  // 只跳出内层循环
            }
            printf("  Inner: %d\n", j);
        }
    }

    return 0;
}
```

**输出：**
```
Outer: 1
  Inner: 1
Outer: 2
  Inner: 1
Outer: 3
  Inner: 1
```

## continue 语句

### 基本用法

```c
#include <stdio.h>

int main() {
    // 跳过偶数
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) {
            continue;  // 跳过本次循环剩余语句
        }
        printf("%d ", i);  // 1 3 5 7 9
    }

    return 0;
}
```

### continue 和 break 的区别

```c
#include <stdio.h>

int main() {
    // break - 终止整个循环
    printf("break 示例:\n");
    for (int i = 1; i <= 5; i++) {
        if (i == 3) {
            break;
        }
        printf("%d ", i);  // 1 2
    }
    printf("\n");

    // continue - 跳过本次循环
    printf("continue 示例:\n");
    for (int i = 1; i <= 5; i++) {
        if (i == 3) {
            continue;
        }
        printf("%d ", i);  // 1 2 4 5
    }
    printf("\n");

    return 0;
}
```

### 在 while 中使用 continue

```c
#include <stdio.h>

int main() {
    int i = 0;
    while (i < 10) {
        i++;
        if (i % 2 == 0) {
            continue;  // 跳过偶数
        }
        printf("%d ", i);  // 1 3 5 7 9
    }

    return 0;
}
```

## goto 语句

### 基本用法

```c
#include <stdio.h>

int main() {
    int x = 1;

    label:  // 标签
    printf("%d ", x);
    x++;

    if (x <= 5) {
        goto label;  // 跳转到标签处
    }
    // 输出：1 2 3 4 5

    return 0;
}
```

### 跳出多层循环

```c
#include <stdio.h>

int main() {
    // goto 跳出多层循环
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            for (int k = 1; k <= 3; k++) {
                if (i == 2 && j == 2 && k == 2) {
                    printf("Found!\n");
                    goto end;  // 直接跳出所有循环
                }
                printf("%d %d %d\n", i, j, k);
            }
        }
    }

    end:
    printf("After loops\n");

    return 0;
}
```

### 错误处理示例

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr1 = NULL, *arr2 = NULL, *arr3 = NULL;

    arr1 = malloc(100 * sizeof(int));
    if (arr1 == NULL) goto error;

    arr2 = malloc(200 * sizeof(int));
    if (arr2 == NULL) goto error;

    arr3 = malloc(300 * sizeof(int));
    if (arr3 == NULL) goto error;

    // 正常处理逻辑
    printf("Success!\n");

    // 清理资源
    free(arr1);
    free(arr2);
    free(arr3);
    return 0;

    error:
    printf("Memory allocation failed\n");
    if (arr1) free(arr1);
    if (arr2) free(arr2);
    if (arr3) free(arr3);
    return -1;
}
```

## return 语句

### 从函数返回

```c
#include <stdio.h>

// 有返回值
int add(int a, int b) {
    return a + b;
}

// 无返回值
void printHello() {
    printf("Hello\n");
    return;  // 可以省略
}

// 提前返回
int findFirstNegative(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        if (arr[i] < 0) {
            return arr[i];  // 找到负数立即返回
        }
    }
    return 0;  // 没找到返回 0
}

int main() {
    printf("add(3, 5) = %d\n", add(3, 5));

    int arr[] = {1, 2, -3, 4, -5};
    printf("First negative: %d\n", findFirstNegative(arr, 5));

    return 0;
}
```

## 跳转语句对比

| 语句 | 作用 | 使用场景 |
|------|------|---------|
| break | 跳出 switch 或循环 | 找到目标提前退出 |
| continue | 跳过本次循环 | 跳过特定条件 |
| goto | 跳转到标签 | 错误处理、跳出多层循环 |
| return | 从函数返回 | 返回结果、提前结束函数 |

## 完整示例

```c
#include <stdio.h>

// 判断素数
int isPrime(int n) {
    if (n <= 1) return 0;

    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            return 0;  // 提前返回
        }
    }
    return 1;
}

int main() {
    // 打印 100 以内的素数，跳过能被 3 整除的
    for (int i = 2; i < 100; i++) {
        if (i % 3 == 0) {
            continue;  // 跳过能被 3 整除的
        }

        if (!isPrime(i)) {
            continue;  // 跳过非素数
        }

        if (i > 50) {
            break;  // 大于 50 就停止
        }

        printf("%d ", i);
    }
    printf("\n");

    return 0;
}
```

## 练习

1. 使用 break 实现：找到第一个能被 13 整除的数
2. 使用 continue 实现：打印 1-100 中个位不是 3 的数
3. 使用 goto 实现一个多文件输入处理程序
4. 编写程序：输入若干数字，遇到负数停止，计算正数的和

---

[上一节：循环语句](02-loops.md) | [下一节：数组](../../c/3-array-string/01-arrays.md)
