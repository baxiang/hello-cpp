# 6.3 常见内存错误

## 内存泄漏

```c
#include <stdio.h>
#include <stdlib.h>

// 错误：分配后未释放
void leak() {
    int *ptr = (int*)malloc(sizeof(int) * 100);
    // 使用 ptr...
    // 忘记 free(ptr) - 内存泄漏！
}

// 正确
void noLeak() {
    int *ptr = (int*)malloc(sizeof(int) * 100);
    // 使用 ptr...
    free(ptr);  // 及时释放
}

int main() {
    for (int i = 0; i < 1000; i++) {
        leak();  // 每次调用都泄漏内存
    }
    return 0;
}
```

### 避免内存泄漏

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size;
} Array;

Array* createArray(int size) {
    Array *arr = (Array*)malloc(sizeof(Array));
    arr->data = (int*)malloc(size * sizeof(int));
    arr->size = size;
    return arr;
}

// 提供释放函数
void freeArray(Array *arr) {
    if (arr) {
        free(arr->data);
        free(arr);
    }
}

int main() {
    Array *arr = createArray(10);
    // 使用...
    freeArray(arr);  // 完整释放
    return 0;
}
```

## 野指针

```c
#include <stdio.h>
#include <stdlib.h>

// 错误：使用未初始化的指针
void uninitializedPointer() {
    int *ptr;  // 未初始化
    // *ptr = 10;  // 危险！
}

// 错误：释放后继续使用
void danglingPointer() {
    int *ptr = (int*)malloc(sizeof(int));
    *ptr = 10;
    free(ptr);
    // *ptr = 20;  // 危险！野指针
}

// 错误：返回局部变量地址
int* badReturn() {
    int x = 10;
    return &x;  // 危险！x 在栈上，函数返回后失效
}

// 正确做法
void safePointer() {
    int *ptr = NULL;  // 初始化为 NULL
    ptr = (int*)malloc(sizeof(int));

    if (ptr != NULL) {
        *ptr = 10;
    }

    free(ptr);
    ptr = NULL;  // 释放后置为 NULL
}

int main() {
    safePointer();
    return 0;
}
```

## 缓冲区溢出

```c
#include <stdio.h>
#include <string.h>

// 错误： strcpy 溢出
void overflow1() {
    char buf[10] = "Hello";
    // strcpy(buf, "This is a very long string");  // 溢出！
}

// 错误： scanf 溢出
void overflow2() {
    char buf[10];
    // scanf("%s", buf);  // 输入过长会溢出
}

// 正确：使用安全函数
void safe1() {
    char buf[20] = "Hello";
    strncpy(buf, "Short", sizeof(buf) - 1);
    buf[sizeof(buf) - 1] = '\0';
}

void safe2() {
    char buf[10];
    scanf("%9s", buf);  // 限制输入长度
}

int main() {
    safe1();
    return 0;
}
```

## 数组越界

```c
#include <stdio.h>
#include <stdlib.h>

// 错误：访问越界
void outOfBounds() {
    int arr[5] = {1, 2, 3, 4, 5};

    // 访问 arr[5] 到 arr[9] - 越界！
    // for (int i = 0; i < 10; i++) {
    //     printf("%d\n", arr[i]);
    // }
}

// 错误：写入越界
void writeOutOfBounds() {
    int *ptr = (int*)malloc(5 * sizeof(int));

    // 写入超过分配的大小
    // for (int i = 0; i < 10; i++) {
    //     ptr[i] = i;
    // }

    free(ptr);
}

// 正确
void safeAccess() {
    int arr[5] = {1, 2, 3, 4, 5};
    int n = sizeof(arr) / sizeof(arr[0]);

    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int main() {
    safeAccess();
    return 0;
}
```

## 重复释放

```c
#include <stdio.h>
#include <stdlib.h>

// 错误：重复释放
void doubleFree() {
    int *ptr = (int*)malloc(sizeof(int));
    free(ptr);
    // free(ptr);  // 错误！重复释放
}

// 正确
void safeFree() {
    int *ptr = (int*)malloc(sizeof(int));
    free(ptr);
    ptr = NULL;  // 置为 NULL，防止重复释放
}

int main() {
    safeFree();
    return 0;
}
```

## 错误匹配分配/释放

```c
#include <stdio.h>
#include <stdlib.h>

// 错误：malloc/free 与 new/delete 混用（C++）
// 错误：malloc 与 free[] 混用

// 正确：配对使用
void correctUsage() {
    // 单个对象
    int *p1 = (int*)malloc(sizeof(int));
    free(p1);

    // 数组
    int *p2 = (int*)malloc(10 * sizeof(int));
    free(p2);
}

int main() {
    correctUsage();
    return 0;
}
```

## 完整示例 - 安全内存管理

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SAFE_FREE(ptr) do { \
    if (ptr != NULL) { \
        free(ptr); \
        ptr = NULL; \
    } \
} while(0)

typedef struct {
    char *name;
    int *data;
    size_t size;
} DataStruct;

DataStruct* createData(const char *name, size_t size) {
    DataStruct *ds = (DataStruct*)malloc(sizeof(DataStruct));
    if (!ds) return NULL;

    ds->name = (char*)malloc(strlen(name) + 1);
    if (!ds->name) {
        free(ds);
        return NULL;
    }
    strcpy(ds->name, name);

    ds->data = (int*)calloc(size, sizeof(int));
    if (!ds->data) {
        free(ds->name);
        free(ds);
        return NULL;
    }

    ds->size = size;
    return ds;
}

void freeData(DataStruct *ds) {
    if (ds) {
        SAFE_FREE(ds->name);
        SAFE_FREE(ds->data);
        SAFE_FREE(ds);
    }
}

int main() {
    DataStruct *ds = createData("test", 100);
    if (!ds) {
        printf("Creation failed\n");
        return 1;
    }

    // 使用...

    freeData(ds);
    return 0;
}
```

## 检测工具

### Valgrind 使用

```bash
# 编译（带调试信息）
gcc -g -o program program.c

# 运行 valgrind
valgrind --leak-check=full ./program

# 输出示例：
# ==12345== LEAK SUMMARY:
# ==12345==    definitely lost: 100 bytes in 1 blocks
# ==12345==    possibly lost: 0 bytes in 0 blocks
```

### AddressSanitizer

```bash
# 使用 ASan 编译
gcc -fsanitize=address -g -o program program.c

# 运行（自动检测内存错误）
./program
```

## 最佳实践

1. **谁分配，谁释放**
2. **释放后置为 NULL**
3. **检查分配返回值**
4. **使用安全函数（strncpy, snprintf）**
5. **始终检查边界**
6. **使用工具检测（Valgrind, ASan）**

## 练习

1. 找出并修复给定代码中的内存错误
2. 使用 Valgrind 检测程序的内存泄漏
3. 实现安全的字符串复制函数
4. 编写内存安全的动态数组实现

---

[上一节：动态分配](02-allocation.md) | [下一节：结构体](../../c/7-structs/01-struct.md)
