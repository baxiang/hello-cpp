# 9.1 宏定义

## 对象宏

```c
#include <stdio.h>

// 简单宏定义
#define PI 3.14159
#define MAX_SIZE 100
#define APP_NAME "MyApp"

int main() {
    double area = PI * 5 * 5;
    int buffer[MAX_SIZE];

    printf("App: %s\n", APP_NAME);
    printf("Area: %.2f\n", area);

    return 0;
}
```

## 函数宏

```c
#include <stdio.h>

// 简单函数宏
#define SQUARE(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define MIN(a, b) ((a) < (b) ? (a) : (b))

int main() {
    printf("SQUARE(5) = %d\n", SQUARE(5));
    printf("MAX(3, 7) = %d\n", MAX(3, 7));
    printf("MIN(3, 7) = %d\n", MIN(3, 7));

    // 注意括号的重要性
    printf("SQUARE(2+3) = %d\n", SQUARE(2+3));  // 25

    return 0;
}
```

## 宏的注意事项

```c
#include <stdio.h>

// 错误：缺少括号
#define BAD_SQUARE(x) x * x

// 正确：加括号
#define GOOD_SQUARE(x) ((x) * (x))

// 错误：副作用
#define INC(x) ((x)++)

int main() {
    int a = 5;

    // BAD_SQUARE(a + 1) = a + 1 * a + 1 = 5 + 5 + 1 = 11 (错误!)
    printf("BAD_SQUARE(5+1) = %d\n", BAD_SQUARE(a + 1));

    // GOOD_SQUARE(a + 1) = (a + 1) * (a + 1) = 36
    printf("GOOD_SQUARE(5+1) = %d\n", GOOD_SQUARE(a + 1));

    // 副作用问题
    int b = 5;
    INC(b);  // b = 6
    INC(b);  // b = 7

    return 0;
}
```

## 字符串化运算符

```c
#include <stdio.h>

// # 将宏参数转换为字符串
#define STRINGIFY(x) #x
#define PRINT_VAR(var) printf(#var " = %d\n", var)

int main() {
    int x = 42;

    printf("STRINGIFY(hello) = %s\n", STRINGIFY(hello));

    PRINT_VAR(x);  // 输出：x = 42

    return 0;
}
```

## 连接运算符

```c
#include <stdio.h>

// ## 连接两个标记
#define CONCAT(a, b) a##b
#define MAKE_VAR(name, num) name##num

int main() {
    int var1 = 10;
    int var2 = 20;

    printf("var1 = %d\n", MAKE_VAR(var, 1));
    printf("var2 = %d\n", MAKE_VAR(var, 2));

    // 生成函数名
    #define DECLARE_FUNC(name) void name##_init() { printf("Init " #name "\n"); }

    DECLARE_FUNC(module);
    module_init();

    return 0;
}
```

## 可变参数宏

```c
#include <stdio.h>

// C99 可变参数
#define LOG(...) printf(__VA_ARGS__)
#define DEBUG(fmt, ...) printf("[DEBUG] " fmt, ##__VA_ARGS__)

int main() {
    LOG("Hello, World!\n");
    LOG("Value: %d\n", 42);

    DEBUG("x = %d, y = %d\n", 10, 20);
    DEBUG("Simple message\n");  // 无额外参数

    return 0;
}
```

## 预定义宏

```c
#include <stdio.h>

int main() {
    printf("File: %s\n", __FILE__);
    printf("Line: %d\n", __LINE__);
    printf("Date: %s\n", __DATE__);
    printf("Time: %s\n", __TIME__);

    #ifdef __GNUC__
    printf("Compiler: GCC\n");
    #endif

    return 0;
}
```

## 完整示例

### 调试宏

```c
#include <stdio.h>

#define DEBUG_MODE 1

#if DEBUG_MODE
    #define DEBUG_PRINT(fmt, ...) \
        printf("[DEBUG] %s:%d: " fmt, __FILE__, __LINE__, ##__VA_ARGS__)
    #define ASSERT(expr) \
        do { \
            if (!(expr)) { \
                printf("[ASSERT FAILED] %s:%d: %s\n", \
                       __FILE__, __LINE__, #expr); \
            } \
        } while(0)
#else
    #define DEBUG_PRINT(fmt, ...)
    #define ASSERT(expr)
#endif

int divide(int a, int b) {
    ASSERT(b != 0);
    return a / b;
}

int main() {
    int x = 10, y = 2;

    DEBUG_PRINT("x = %d, y = %d\n", x, y);

    int result = divide(x, y);
    DEBUG_PRINT("result = %d\n", result);

    return 0;
}
```

### 通用容器宏

```c
#include <stdio.h>

// 声明数组类型
#define DECLARE_ARRAY(type, name) \
    typedef struct { \
        type *data; \
        int size; \
        int capacity; \
    } name

// 实现数组函数
#define IMPLEMENT_ARRAY(type, name) \
    void name##_init(name *arr, int cap) { \
        arr->data = (type*)malloc(cap * sizeof(type)); \
        arr->size = 0; \
        arr->capacity = cap; \
    } \
    void name##_push(name *arr, type val) { \
        if (arr->size >= arr->capacity) { \
            arr->capacity *= 2; \
            arr->data = (type*)realloc(arr->data, arr->capacity * sizeof(type)); \
        } \
        arr->data[arr->size++] = val; \
    } \
    type name##_get(name *arr, int idx) { \
        return arr->data[idx]; \
    } \
    void name##_free(name *arr) { \
        free(arr->data); \
        arr->size = arr->capacity = 0; \
    }

DECLARE_ARRAY(int, IntArray);
IMPLEMENT_ARRAY(int, IntArray)

int main() {
    IntArray arr;
    IntArray_init(&arr, 4);

    IntArray_push(&arr, 10);
    IntArray_push(&arr, 20);
    IntArray_push(&arr, 30);

    for (int i = 0; i < arr.size; i++) {
        printf("%d ", IntArray_get(&arr, i));
    }
    printf("\n");

    IntArray_free(&arr);
    return 0;
}
```

## 练习

1. 编写宏实现两个数的交换
2. 编写宏计算数组元素个数
3. 实现日志宏，支持不同级别（INFO, WARN, ERROR）
4. 使用宏实现简单的断言系统

---

[上一节：文件读写](../../c/8-file/02-read-write.md) | [下一节：条件编译](02-conditional.md)
