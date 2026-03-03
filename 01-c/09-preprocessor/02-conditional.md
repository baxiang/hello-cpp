# 9.2 条件编译

## #ifdef 和 #ifndef

```c
#include <stdio.h>

#define DEBUG

int main() {
#ifdef DEBUG
    printf("Debug mode enabled\n");
#endif

#ifndef RELEASE
    printf("Not a release build\n");
#endif

    return 0;
}
```

## #if 和 #elif

```c
#include <stdio.h>

#define VERSION 2
#define PLATFORM 1  // 1: Windows, 2: Linux, 3: Mac

int main() {
#if VERSION >= 2
    printf("Version 2 or higher\n");
#endif

#if PLATFORM == 1
    printf("Windows\n");
#elif PLATFORM == 2
    printf("Linux\n");
#elif PLATFORM == 3
    printf("Mac\n");
#else
    printf("Unknown platform\n");
#endif

    return 0;
}
```

## #else

```c
#include <stdio.h>

#define USE_FAST_MODE

int main() {
#ifdef USE_FAST_MODE
    printf("Using fast mode\n");
#else
    printf("Using safe mode\n");
#endif

    return 0;
}
```

## 头文件保护

```c
// myheader.h
#ifndef MYHEADER_H
#define MYHEADER_H

// 头文件内容
typedef struct {
    int x;
    int y;
} Point;

#endif // MYHEADER_H
```

## 平台检测

```c
#include <stdio.h>

int main() {
#if defined(_WIN32)
    printf("Windows\n");
#elif defined(__linux__)
    printf("Linux\n");
#elif defined(__APPLE__)
    printf("macOS\n");
#else
    printf("Unknown platform\n");
#endif

    return 0;
}
```

## 编译器检测

```c
#include <stdio.h>

int main() {
#if defined(__GNUC__)
    printf("GCC or compatible: %d.%d\n", __GNUC__, __GNUC_MINOR__);
#elif defined(_MSC_VER)
    printf("MSVC: %d\n", _MSC_VER);
#elif defined(__clang__)
    printf("Clang\n");
#else
    printf("Unknown compiler\n");
#endif

    return 0;
}
```

## 完整示例

### 跨平台代码

```c
// platform.h
#ifndef PLATFORM_H
#define PLATFORM_H

#if defined(_WIN32)
    #define PLATFORM_NAME "Windows"
    #define PATH_SEPARATOR '\\'
    #define LINE_ENDING "\r\n"
#elif defined(__linux__)
    #define PLATFORM_NAME "Linux"
    #define PATH_SEPARATOR '/'
    #define LINE_ENDING "\n"
#elif defined(__APPLE__)
    #define PLATFORM_NAME "macOS"
    #define PATH_SEPARATOR '/'
    #define LINE_ENDING "\n"
#else
    #define PLATFORM_NAME "Unknown"
    #define PATH_SEPARATOR '/'
    #define LINE_ENDING "\n"
#endif

#endif
```

```c
#include <stdio.h>
#include "platform.h"

int main() {
    printf("Platform: %s\n", PLATFORM_NAME);
    printf("Path separator: %c\n", PATH_SEPARATOR);

    return 0;
}
```

### 调试版本控制

```c
// config.h
#ifndef CONFIG_H
#define CONFIG_H

// 调试级别
// 0: 无调试
// 1: 基本调试
// 2: 详细调试
#ifndef DEBUG_LEVEL
    #define DEBUG_LEVEL 0
#endif

#if DEBUG_LEVEL >= 1
    #define LOG_INFO(fmt, ...) printf("[INFO] " fmt, ##__VA_ARGS__)
#else
    #define LOG_INFO(fmt, ...)
#endif

#if DEBUG_LEVEL >= 2
    #define LOG_DEBUG(fmt, ...) printf("[DEBUG] %s:%d: " fmt, __FILE__, __LINE__, ##__VA_ARGS__)
#else
    #define LOG_DEBUG(fmt, ...)
#endif

#define LOG_ERROR(fmt, ...) printf("[ERROR] " fmt, ##__VA_ARGS__)

#endif
```

```c
#include <stdio.h>
#include "config.h"

int divide(int a, int b) {
    LOG_DEBUG("divide(%d, %d)\n", a, b);

    if (b == 0) {
        LOG_ERROR("Division by zero!\n");
        return 0;
    }

    int result = a / b;
    LOG_INFO("Result: %d\n", result);
    LOG_DEBUG("Returning %d\n", result);

    return result;
}

int main() {
    LOG_INFO("Application started\n");

    int result = divide(10, 2);
    printf("10 / 2 = %d\n", result);

    LOG_INFO("Application finished\n");
    return 0;
}
```

### 功能开关

```c
// features.h
#ifndef FEATURES_H
#define FEATURES_H

// 功能开关
#define FEATURE_LOGGING 1
#define FEATURE_NETWORK 0
#define FEATURE_DATABASE 1

#endif
```

```c
#include <stdio.h>
#include "features.h"

void initLogging() {
#if FEATURE_LOGGING
    printf("Initializing logging...\n");
    // 日志初始化代码
#endif
}

void initNetwork() {
#if FEATURE_NETWORK
    printf("Initializing network...\n");
    // 网络初始化代码
#endif
}

void initDatabase() {
#if FEATURE_DATABASE
    printf("Initializing database...\n");
    // 数据库初始化代码
#endif
}

int main() {
    initLogging();
    initNetwork();
    initDatabase();

    printf("Initialization complete\n");
    return 0;
}
```

## 条件编译运算符

| 运算符 | 说明 |
|--------|------|
| `defined(X)` | 检查 X 是否已定义 |
| `defined X` | 同上（无括号） |

```c
#if defined(DEBUG) || defined(TEST)
    printf("Debug or test mode\n");
#endif

#if !defined(PRODUCTION)
    printf("Not production\n");
#endif
```

## 练习

1. 创建头文件保护
2. 编写跨平台的目录分隔符宏
3. 实现可配置的日志系统
4. 使用条件编译支持多种数据结构

---

[上一节：宏定义](01-macro.md) | [下一节：stdio.h](../../c/10-standard-lib/01-stdio.md)
