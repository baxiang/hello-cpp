# 7.3 枚举

## 枚举定义

```c
#include <stdio.h>

// 定义枚举类型
enum Color {
    RED,
    GREEN,
    BLUE
};

int main() {
    enum Color c1 = RED;
    enum Color c2 = GREEN;

    printf("RED = %d\n", RED);       // 0
    printf("GREEN = %d\n", GREEN);   // 1
    printf("BLUE = %d\n", BLUE);     // 2

    return 0;
}
```

## 指定枚举值

```c
#include <stdio.h>

enum Status {
    OK = 0,
    ERROR = -1,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
};

enum Flags {
    READ = 1,
    WRITE = 2,
    EXECUTE = 4,
    ALL = READ | WRITE | EXECUTE  // 7
};

int main() {
    printf("OK = %d\n", OK);
    printf("ERROR = %d\n", ERROR);
    printf("ALL = %d\n", ALL);

    return 0;
}
```

## typedef 简化

```c
#include <stdio.h>

typedef enum {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
} Weekday;

int main() {
    Weekday today = MONDAY;

    if (today == MONDAY || today == FRIDAY) {
        printf("Meeting day!\n");
    }

    return 0;
}
```

## 枚举应用

### 状态机

```c
#include <stdio.h>

typedef enum {
    STATE_IDLE,
    STATE_RUNNING,
    STATE_PAUSED,
    STATE_STOPPED
} GameState;

GameState currentState = STATE_IDLE;

void start() {
    if (currentState == STATE_IDLE || currentState == STATE_STOPPED) {
        currentState = STATE_RUNNING;
        printf("Game started\n");
    }
}

void pause() {
    if (currentState == STATE_RUNNING) {
        currentState = STATE_PAUSED;
        printf("Game paused\n");
    }
}

void resume() {
    if (currentState == STATE_PAUSED) {
        currentState = STATE_RUNNING;
        printf("Game resumed\n");
    }
}

void stop() {
    currentState = STATE_STOPPED;
    printf("Game stopped\n");
}

const char* getStateName(GameState state) {
    switch (state) {
        case STATE_IDLE: return "Idle";
        case STATE_RUNNING: return "Running";
        case STATE_PAUSED: return "Paused";
        case STATE_STOPPED: return "Stopped";
        default: return "Unknown";
    }
}

int main() {
    printf("Current state: %s\n", getStateName(currentState));

    start();
    printf("Current state: %s\n", getStateName(currentState));

    pause();
    printf("Current state: %s\n", getStateName(currentState));

    resume();
    stop();
    printf("Current state: %s\n", getStateName(currentState));

    return 0;
}
```

### 错误码

```c
#include <stdio.h>

typedef enum {
    SUCCESS = 0,
    ERR_INVALID_PARAM = -1,
    ERR_OUT_OF_MEMORY = -2,
    ERR_FILE_NOT_FOUND = -3,
    ERR_PERMISSION_DENIED = -4
} ErrorCode;

const char* getErrorMessage(ErrorCode code) {
    switch (code) {
        case SUCCESS:
            return "Success";
        case ERR_INVALID_PARAM:
            return "Invalid parameter";
        case ERR_OUT_OF_MEMORY:
            return "Out of memory";
        case ERR_FILE_NOT_FOUND:
            return "File not found";
        case ERR_PERMISSION_DENIED:
            return "Permission denied";
        default:
            return "Unknown error";
    }
}

ErrorCode readFile(const char *filename) {
    // 模拟文件读取
    return ERR_FILE_NOT_FOUND;
}

int main() {
    ErrorCode result = readFile("test.txt");

    if (result != SUCCESS) {
        printf("Error: %s\n", getErrorMessage(result));
    }

    return 0;
}
```

### 位掩码

```c
#include <stdio.h>

typedef enum {
    PERMISSION_NONE = 0,
    PERMISSION_READ = (1 << 0),   // 1
    PERMISSION_WRITE = (1 << 1),  // 2
    PERMISSION_EXEC = (1 << 2),   // 4
    PERMISSION_ALL = PERMISSION_READ | PERMISSION_WRITE | PERMISSION_EXEC
} Permission;

void checkPermission(int perms) {
    printf("Permissions: ");
    if (perms & PERMISSION_READ) printf("R");
    if (perms & PERMISSION_WRITE) printf("W");
    if (perms & PERMISSION_EXEC) printf("X");
    printf("\n");
}

int main() {
    int userPerms = PERMISSION_READ | PERMISSION_WRITE;

    checkPermission(userPerms);

    if (userPerms & PERMISSION_READ) {
        printf("Can read\n");
    }

    if (!(userPerms & PERMISSION_EXEC)) {
        printf("Cannot execute\n");
    }

    return 0;
}
```

## 枚举和 switch

```c
#include <stdio.h>

typedef enum {
    CIRCLE,
    RECTANGLE,
    TRIANGLE
} Shape;

typedef struct {
    Shape type;
    union {
        struct {
            float radius;
        } circle;
        struct {
            float width;
            float height;
        } rect;
        struct {
            float base;
            float height;
        } triangle;
    } data;
} ShapeData;

float calculateArea(ShapeData *s) {
    switch (s->type) {
        case CIRCLE:
            return 3.14159f * s->data.circle.radius * s->data.circle.radius;
        case RECTANGLE:
            return s->data.rect.width * s->data.rect.height;
        case TRIANGLE:
            return 0.5f * s->data.triangle.base * s->data.triangle.height;
        default:
            return 0;
    }
}

int main() {
    ShapeData circle = {CIRCLE, {.circle = {.radius = 5}}};
    ShapeData rect = {RECTANGLE, {.rect = {.width = 4, .height = 6}}};

    printf("Circle area: %.2f\n", calculateArea(&circle));
    printf("Rectangle area: %.2f\n", calculateArea(&rect));

    return 0;
}
```

## 强类型枚举（C23）

```c
// C23 新特性（如果编译器支持）
// enum class Color {
//     RED,
//     GREEN,
//     BLUE
// };
//
// Color c = Color.RED;  // 需要限定作用域

```

## 练习

1. 定义表示扑克牌花色和点数的枚举
2. 实现计算器的操作枚举
3. 使用枚举和联合体实现类型安全的变量
4. 设计一个简单的协议，使用枚举表示消息类型

---

[上一节：联合体](02-union.md) | [下一节：文件基础](../../c/8-file/01-basics.md)
