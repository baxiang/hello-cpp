# 5.3 多级指针

## 二级指针

```c
#include <stdio.h>

int main() {
    int x = 10;
    int *ptr = &x;
    int **pptr = &ptr;  // 指向指针的指针

    printf("x = %d\n", x);
    printf("*ptr = %d\n", *ptr);
    printf("**pptr = %d\n", **pptr);

    printf("&x = %p\n", &x);
    printf("ptr = %p\n", ptr);
    printf("*pptr = %p\n", *pptr);

    return 0;
}
```

## 二级指针应用

### 修改指针本身

```c
#include <stdio.h>
#include <stdlib.h>

// 使用二级指针分配内存
void allocate(int **ptr, int size) {
    *ptr = (int*)malloc(size * sizeof(int));
}

// 使用二级指针修改指针指向
void redirect(int **ptr1, int **ptr2) {
    int *temp = *ptr1;
    *ptr1 = *ptr2;
    *ptr2 = temp;
}

int main() {
    int *arr = NULL;
    allocate(&arr, 5);  // 传入 &arr

    for (int i = 0; i < 5; i++) {
        arr[i] = i * 10;
    }

    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    free(arr);
    return 0;
}
```

### 字符串数组

```c
#include <stdio.h>

int main() {
    // 字符串数组本质是二级指针
    char *fruits[] = {"Apple", "Banana", "Cherry"};
    char **ptr = fruits;

    // 遍历
    for (int i = 0; i < 3; i++) {
        printf("%s\n", ptr[i]);
        printf("%s\n", *(ptr + i));
    }

    return 0;
}
```

## main 函数参数

```c
#include <stdio.h>

// argc: 参数个数
// argv: 参数数组（二级指针）
int main(int argc, char *argv[]) {
    printf("Program: %s\n", argv[0]);
    printf("Argument count: %d\n", argc);

    printf("Arguments:\n");
    for (int i = 1; i < argc; i++) {
        printf("  [%d] %s\n", i, argv[i]);
    }

    return 0;
}
```

运行示例：
```bash
./program arg1 arg2 arg3
```

输出：
```
Program: ./program
Argument count: 4
Arguments:
  [1] arg1
  [2] arg2
  [3] arg3
```

## 三级指针

```c
#include <stdio.h>

int main() {
    int x = 10;
    int *p1 = &x;
    int **p2 = &p1;
    int ***p3 = &p2;  // 三级指针

    printf("x = %d\n", x);
    printf("*p1 = %d\n", *p1);
    printf("**p2 = %d\n", **p2);
    printf("***p3 = %d\n", ***p3);

    return 0;
}
```

## 指针数组的数组

```c
#include <stdio.h>

int main() {
    char *row1[] = {"A", "B", "C"};
    char *row2[] = {"D", "E", "F"};

    char **matrix[] = {row1, row2};

    printf("%s %s %s\n", matrix[0][0], matrix[0][1], matrix[0][2]);
    printf("%s %s %s\n", matrix[1][0], matrix[1][1], matrix[1][2]);

    return 0;
}
```

## 完整示例

### 动态二维数组

```c
#include <stdio.h>
#include <stdlib.h>

// 创建动态二维数组
int** createMatrix(int rows, int cols) {
    int **matrix = (int**)malloc(rows * sizeof(int*));
    for (int i = 0; i < rows; i++) {
        matrix[i] = (int*)malloc(cols * sizeof(int));
    }
    return matrix;
}

// 释放二维数组
void freeMatrix(int **matrix, int rows) {
    for (int i = 0; i < rows; i++) {
        free(matrix[i]);
    }
    free(matrix);
}

// 打印二维数组
void printMatrix(int **matrix, int rows, int cols) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%4d", matrix[i][j]);
        }
        printf("\n");
    }
}

int main() {
    int **matrix = createMatrix(3, 4);

    // 填充
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            matrix[i][j] = i * 4 + j + 1;
        }
    }

    printMatrix(matrix, 3, 4);
    freeMatrix(matrix, 3);

    return 0;
}
```

### 字符串分割

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char** split(char *str, char delim, int *count) {
    *count = 0;

    // 计算 token 数量
    char *temp = strdup(str);
    char *token = strtok(temp, &delim);
    while (token) {
        (*count)++;
        token = strtok(NULL, &delim);
    }
    free(temp);

    // 分配指针数组
    char **result = (char**)malloc(*count * sizeof(char*));

    // 分割
    temp = strdup(str);
    token = strtok(temp, &delim);
    int i = 0;
    while (token && i < *count) {
        result[i++] = strdup(token);
        token = strtok(NULL, &delim);
    }
    free(temp);

    return result;
}

void freeSplit(char **arr, int count) {
    for (int i = 0; i < count; i++) {
        free(arr[i]);
    }
    free(arr);
}

int main() {
    char str[] = "apple,banana,cherry,date";
    int count;
    char **tokens = split(str, ',', &count);

    for (int i = 0; i < count; i++) {
        printf("%s\n", tokens[i]);
    }

    freeSplit(tokens, count);
    return 0;
}
```

## 练习

1. 编写程序演示二级指针修改指针指向
2. 实现动态三维数组的创建和释放
3. 使用多级指针实现树形结构
4. 编写程序解析命令行参数

---

[上一节：指针和数组](02-array.md) | [下一节：函数指针](04-function-pointer.md)
