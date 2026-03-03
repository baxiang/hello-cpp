# 3.1 数组

## 一维数组

### 数组声明

```c
#include <stdio.h>

int main() {
    // 声明数组
    int arr[5];          // 5 个整数的数组

    // 声明并初始化
    int nums[5] = {1, 2, 3, 4, 5};

    // 部分初始化（其余为 0）
    int partial[5] = {1, 2};  // {1, 2, 0, 0, 0}

    // 自动推断大小
    int auto_arr[] = {1, 2, 3, 4, 5};  // 大小为 5

    return 0;
}
```

### 数组访问

```c
#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};

    // 访问元素（下标从 0 开始）
    printf("arr[0] = %d\n", arr[0]);  // 10
    printf("arr[2] = %d\n", arr[2]);  // 30

    // 修改元素
    arr[0] = 100;
    printf("arr[0] = %d\n", arr[0]);  // 100

    // 遍历数组
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }

    return 0;
}
```

### 数组大小

```c
#include <stdio.h>

int main() {
    int arr[] = {1, 2, 3, 4, 5};

    // 计算数组元素个数
    int size = sizeof(arr) / sizeof(arr[0]);
    printf("Array size: %d\n", size);  // 5

    // sizeof(arr) = 20 (5 * 4)
    // sizeof(arr[0]) = 4
    printf("sizeof(arr) = %zu\n", sizeof(arr));
    printf("sizeof(arr[0]) = %zu\n", sizeof(arr[0]));

    return 0;
}
```

## 多维数组

### 二维数组

```c
#include <stdio.h>

int main() {
    // 声明二维数组
    int matrix[3][3];

    // 初始化
    int arr[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    // 访问元素
    printf("arr[0][1] = %d\n", arr[0][1]);  // 2
    printf("arr[1][2] = %d\n", arr[1][2]);  // 6

    // 遍历二维数组
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", arr[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

### 二维数组应用 - 矩阵运算

```c
#include <stdio.h>

int main() {
    int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int b[2][3] = {{7, 8, 9}, {10, 11, 12}};
    int c[2][3];

    // 矩阵加法
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            c[i][j] = a[i][j] + b[i][j];
        }
    }

    // 输出结果
    printf("Result:\n");
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", c[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

## 数组示例

### 查找最大值

```c
#include <stdio.h>

int findMax(int arr[], int size) {
    int max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

int main() {
    int arr[] = {3, 7, 2, 9, 1, 5};
    int size = sizeof(arr) / sizeof(arr[0]);
    printf("Max: %d\n", findMax(arr, size));
    return 0;
}
```

### 冒泡排序

```c
#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换
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

### 数组反转

```c
#include <stdio.h>

void reverse(int arr[], int n) {
    for (int i = 0; i < n / 2; i++) {
        int temp = arr[i];
        arr[i] = arr[n - 1 - i];
        arr[n - 1 - i] = temp;
    }
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int n = sizeof(arr) / sizeof(arr[0]);

    reverse(arr, n);

    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    return 0;
}
```

## 注意事项

```c
#include <stdio.h>

int main() {
    int arr[5] = {1, 2, 3, 4, 5};

    // 数组越界 - 危险！
    // printf("%d\n", arr[10]);  // 未定义行为

    // 数组不能整体赋值
    int arr2[5];
    // arr2 = arr;  // 错误！

    // 必须逐个元素复制
    for (int i = 0; i < 5; i++) {
        arr2[i] = arr[i];
    }

    return 0;
}
```

## 练习

1. 编写程序计算数组元素的平均值
2. 实现选择排序算法
3. 实现二分查找算法
4. 打印杨辉三角前 10 行

---

[上一节：跳转语句](../../c/2-control/03-jump.md) | [下一节：字符串](02-strings.md)
