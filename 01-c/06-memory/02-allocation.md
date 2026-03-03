# 6.2 动态内存分配

## malloc

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 分配内存（不初始化）
    int *ptr = (int*)malloc(5 * sizeof(int));

    if (ptr == NULL) {
        printf("Allocation failed\n");
        return 1;
    }

    // 使用内存
    for (int i = 0; i < 5; i++) {
        ptr[i] = i * 10;
    }

    for (int i = 0; i < 5; i++) {
        printf("%d ", ptr[i]);
    }
    printf("\n");

    // 释放内存
    free(ptr);

    return 0;
}
```

## calloc

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 分配并初始化为 0
    int *ptr = (int*)calloc(5, sizeof(int));

    if (ptr == NULL) {
        printf("Allocation failed\n");
        return 1;
    }

    // 所有元素初始化为 0
    for (int i = 0; i < 5; i++) {
        printf("%d ", ptr[i]);  // 0 0 0 0 0
    }
    printf("\n");

    free(ptr);
    return 0;
}
```

## realloc

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 初始分配
    int *ptr = (int*)malloc(3 * sizeof(int));
    for (int i = 0; i < 3; i++) {
        ptr[i] = i + 1;
    }

    // 重新分配（扩大）
    int *newPtr = (int*)realloc(ptr, 5 * sizeof(int));

    if (newPtr == NULL) {
        free(ptr);
        printf("Reallocation failed\n");
        return 1;
    }

    ptr = newPtr;

    // 添加新元素
    ptr[3] = 4;
    ptr[4] = 5;

    for (int i = 0; i < 5; i++) {
        printf("%d ", ptr[i]);
    }
    printf("\n");

    free(ptr);
    return 0;
}
```

## 对比

| 函数 | 参数 | 初始化 | 返回值 |
|------|------|--------|--------|
| malloc | 字节数 | 不初始化 | NULL 或有效指针 |
| calloc | 元素数，元素大小 | 初始化为 0 | NULL 或有效指针 |
| realloc | 原指针，新大小 | 保留原数据 | NULL 或新指针 |

## 动态数组

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size;
    int capacity;
} DynamicArray;

DynamicArray* createArray(int initialCapacity) {
    DynamicArray *arr = (DynamicArray*)malloc(sizeof(DynamicArray));
    arr->data = (int*)malloc(initialCapacity * sizeof(int));
    arr->size = 0;
    arr->capacity = initialCapacity;
    return arr;
}

void push(DynamicArray *arr, int value) {
    if (arr->size >= arr->capacity) {
        arr->capacity *= 2;
        arr->data = (int*)realloc(arr->data, arr->capacity * sizeof(int));
    }
    arr->data[arr->size++] = value;
}

void freeArray(DynamicArray *arr) {
    free(arr->data);
    free(arr);
}

int main() {
    DynamicArray *arr = createArray(4);

    for (int i = 0; i < 10; i++) {
        push(arr, i * i);
    }

    for (int i = 0; i < arr->size; i++) {
        printf("%d ", arr->data[i]);
    }
    printf("\n");

    freeArray(arr);
    return 0;
}
```

## 动态二维数组

```c
#include <stdio.h>
#include <stdlib.h>

// 创建
int** createMatrix(int rows, int cols) {
    int **matrix = (int**)malloc(rows * sizeof(int*));
    for (int i = 0; i < rows; i++) {
        matrix[i] = (int*)malloc(cols * sizeof(int));
    }
    return matrix;
}

// 释放
void freeMatrix(int **matrix, int rows) {
    for (int i = 0; i < rows; i++) {
        free(matrix[i]);
    }
    free(matrix);
}

// 使用
int main() {
    int **matrix = createMatrix(3, 4);

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            matrix[i][j] = i * 4 + j;
        }
    }

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%2d ", matrix[i][j]);
        }
        printf("\n");
    }

    freeMatrix(matrix, 3);
    return 0;
}
```

## 字符串动态分配

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 复制字符串
char* myStrdup(const char *str) {
    int len = strlen(str) + 1;
    char *dup = (char*)malloc(len);
    if (dup) {
        strcpy(dup, str);
    }
    return dup;
}

// 连接字符串
char* concat(const char *s1, const char *s2) {
    int len1 = strlen(s1);
    int len2 = strlen(s2);
    char *result = (char*)malloc(len1 + len2 + 1);
    if (result) {
        strcpy(result, s1);
        strcat(result, s2);
    }
    return result;
}

int main() {
    char *str1 = myStrdup("Hello");
    char *str2 = myStrdup(" World");
    char *str3 = concat(str1, str2);

    printf("%s%s\n", str1, str2);
    printf("%s\n", str3);

    free(str1);
    free(str2);
    free(str3);
    return 0;
}
```

## 内存池

```c
#include <stdio.h>
#include <stdlib.h>

#define BLOCK_SIZE 64
#define BLOCK_COUNT 10

typedef struct {
    void *memory;
    int used[BLOCK_COUNT];
} MemoryPool;

MemoryPool* createPool() {
    MemoryPool *pool = (MemoryPool*)malloc(sizeof(MemoryPool));
    pool->memory = malloc(BLOCK_SIZE * BLOCK_COUNT);
    for (int i = 0; i < BLOCK_COUNT; i++) {
        pool->used[i] = 0;
    }
    return pool;
}

void* poolAlloc(MemoryPool *pool, int size) {
    if (size > BLOCK_SIZE) return NULL;

    for (int i = 0; i < BLOCK_COUNT; i++) {
        if (!pool->used[i]) {
            pool->used[i] = 1;
            return (char*)pool->memory + i * BLOCK_SIZE;
        }
    }
    return NULL;
}

void poolFree(MemoryPool *pool, void *ptr) {
    int index = ((char*)ptr - (char*)pool->memory) / BLOCK_SIZE;
    if (index >= 0 && index < BLOCK_COUNT) {
        pool->used[index] = 0;
    }
}

void destroyPool(MemoryPool *pool) {
    free(pool->memory);
    free(pool);
}

int main() {
    MemoryPool *pool = createPool();

    void *p1 = poolAlloc(pool, 32);
    void *p2 = poolAlloc(pool, 32);
    void *p3 = poolAlloc(pool, 32);

    printf("Allocated: %p, %p, %p\n", p1, p2, p3);

    poolFree(pool, p2);
    void *p4 = poolAlloc(pool, 32);  // 重用 p2 的块
    printf("Reused: %p\n", p4);

    destroyPool(pool);
    return 0;
}
```

## 练习

1. 实现动态字符串（类似 C++ 的 std::string）
2. 实现简单的内存池
3. 编写程序检测内存泄漏
4. 使用动态分配实现链表

---

[上一节：内存布局](01-layout.md) | [下一节：常见错误](03-common-errors.md)
