# 5.2 指针和数组

## 数组和指针的关系

```c
#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};

    // 数组名是指向首元素的指针
    int *ptr = arr;

    // arr[i] 等价于 *(arr + i)
    printf("arr[0] = %d\n", arr[0]);
    printf("*arr = %d\n", *arr);
    printf("*(arr + 1) = %d\n", *(arr + 1));

    // ptr[i] 也是合法的
    printf("ptr[2] = %d\n", ptr[2]);  // 30

    return 0;
}
```

## 数组名与指针的区别

```c
#include <stdio.h>

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int *ptr = arr;

    // sizeof 不同
    printf("sizeof(arr) = %zu\n", sizeof(arr));  // 20（整个数组）
    printf("sizeof(ptr) = %zu\n", sizeof(ptr));  // 8（指针大小）

    // 数组名不能修改
    // arr++;  // 错误！arr 是常量

    // 指针可以修改
    ptr++;
    printf("*ptr = %d\n", *ptr);  // 2

    return 0;
}
```

## 指针访问二维数组

```c
#include <stdio.h>

int main() {
    int arr[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    // 行指针
    int (*rowPtr)[3] = arr;

    printf("*(*(arr + 0) + 1) = %d\n", *(*(arr + 0) + 1));  // 2
    printf("arr[0][1] = %d\n", arr[0][1]);  // 2

    // 遍历
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", *(*(arr + i) + j));
        }
        printf("\n");
    }

    return 0;
}
```

## 指针数组

```c
#include <stdio.h>

int main() {
    // 指针数组 - 数组元素是指针
    int a = 1, b = 2, c = 3;
    int *ptrArr[] = {&a, &b, &c};

    for (int i = 0; i < 3; i++) {
        printf("*ptrArr[%d] = %d\n", i, *ptrArr[i]);
    }

    // 字符串指针数组
    char *fruits[] = {"Apple", "Banana", "Cherry"};

    for (int i = 0; i < 3; i++) {
        printf("%s\n", fruits[i]);
    }

    return 0;
}
```

## 数组指针

```c
#include <stdio.h>

int main() {
    int arr[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };

    // 数组指针 - 指向数组的指针
    int (*arrPtr)[4] = arr;

    // 访问
    printf("arrPtr[1][2] = %d\n", arrPtr[1][2]);  // 7

    // 遍历
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%d ", arrPtr[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

## 作为函数参数的数组和指针

```c
#include <stdio.h>

// 数组形式
void printArray1(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// 指针形式
void printArray2(int *arr, int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", *(arr + i));
    }
    printf("\n");
}

// 二维数组
void printMatrix(int arr[][3], int rows) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", arr[i][j]);
        }
        printf("\n");
    }
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    printArray1(arr, 5);
    printArray2(arr, 5);

    int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printMatrix(matrix, 2);

    return 0;
}
```

## 完整示例

### 字符串处理

```c
#include <stdio.h>

// 使用指针实现 strlen
int myStrlen(const char *str) {
    int len = 0;
    while (*str++) {
        len++;
    }
    return len;
}

// 使用指针实现 strcpy
char* myStrcpy(char *dest, const char *src) {
    char *start = dest;
    while ((*dest++ = *src++) != '\0');
    return start;
}

int main() {
    char str[] = "Hello, World!";
    printf("Length: %d\n", myStrlen(str));

    char dest[50];
    myStrcpy(dest, str);
    printf("Copied: %s\n", dest);

    return 0;
}
```

### 动态数组

```c
#include <stdio.h>
#include <stdlib.h>

int* createArray(int size) {
    return (int*)malloc(size * sizeof(int));
}

void fillArray(int *arr, int size) {
    for (int i = 0; i < size; i++) {
        arr[i] = i * i;
    }
}

void printArray(int *arr, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int main() {
    int *arr = createArray(10);
    fillArray(arr, 10);
    printArray(arr, 10);
    free(arr);
    return 0;
}
```

## 练习

1. 使用指针实现数组求和
2. 编写函数使用指针遍历二维数组
3. 使用指针数组存储和排序字符串
4. 实现 memcpy 函数

---

[上一节：指针基础](01-basics.md) | [下一节：多级指针](03-multi-level.md)
