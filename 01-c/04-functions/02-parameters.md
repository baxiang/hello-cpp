# 4.2 参数传递

## 值传递

```c
#include <stdio.h>

// 值传递 - 修改不影响原值
void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("In swap: a = %d, b = %d\n", a, b);
}

int main() {
    int x = 10, y = 20;
    printf("Before: x = %d, y = %d\n", x, y);

    swap(x, y);

    printf("After: x = %d, y = %d\n", x, y);  // 不变
    return 0;
}
```

**输出：**
```
Before: x = 10, y = 20
In swap: a = 20, b = 10
After: x = 10, y = 20
```

## 地址传递（指针）

```c
#include <stdio.h>

// 地址传递 - 修改影响原值
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    printf("Before: x = %d, y = %d\n", x, y);

    swap(&x, &y);

    printf("After: x = %d, y = %d\n", x, y);  // 已交换
    return 0;
}
```

## 数组作为参数

```c
#include <stdio.h>

// 数组作为参数（实际传递的是指针）
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// 修改数组元素
void doubleArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        arr[i] *= 2;
    }
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int size = sizeof(arr) / sizeof(arr[0]);

    printArray(arr, size);
    doubleArray(arr, size);
    printArray(arr, size);  // 2 4 6 8 10

    return 0;
}
```

## 指针作为参数

```c
#include <stdio.h>

// 使用指针返回多个值
void calc(int a, int b, int *sum, int *diff) {
    *sum = a + b;
    *diff = a - b;
}

int main() {
    int x = 10, y = 3;
    int sum, diff;

    calc(x, y, &sum, &diff);

    printf("Sum: %d, Diff: %d\n", sum, diff);

    return 0;
}
```

## const 参数

```c
#include <stdio.h>

// const 指针参数 - 函数内不能修改
void printArray(const int *arr, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
        // arr[i] = 0;  // 错误！不能修改
    }
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    printArray(arr, 5);
    return 0;
}
```

## 完整示例

### 排序函数

```c
#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);

    bubbleSort(arr, n);

    printf("Sorted: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    return 0;
}
```

### 统计字符

```c
#include <stdio.h>
#include <ctype.h>

void countChars(const char *str, int *letters, int *digits, int *spaces) {
    *letters = 0;
    *digits = 0;
    *spaces = 0;

    while (*str) {
        if (isalpha(*str)) {
            (*letters)++;
        } else if (isdigit(*str)) {
            (*digits)++;
        } else if (isspace(*str)) {
            (*spaces)++;
        }
        str++;
    }
}

int main() {
    char str[] = "Hello 123 World";
    int letters, digits, spaces;

    countChars(str, &letters, &digits, &spaces);

    printf("Letters: %d, Digits: %d, Spaces: %d\n",
           letters, digits, spaces);

    return 0;
}
```

## 练习

1. 编写函数交换两个浮点数（使用指针）
2. 编写函数将数组元素全部置为 0
3. 编写函数计算字符串中各类型字符的数量
4. 编写函数实现数组的循环左移

---

[上一节：函数基础](01-basics.md) | [下一节：递归](03-recursion.md)
