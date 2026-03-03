# 5.4 函数指针

> 注意：本节是 C 语言中的函数指针，与前面章节的函数指针内容相呼应，更加深入。

## 函数指针回顾

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int main() {
    // 声明函数指针
    int (*op)(int, int);

    // 赋值
    op = add;

    // 调用
    printf("%d + %d = %d\n", 3, 5, op(3, 5));
    printf("%d - %d = %d\n", 10, 3, op(10, 3));

    return 0;
}
```

## 复杂函数指针

### 指向返回指针的函数

```c
#include <stdio.h>

// 返回字符串指针的函数
char* getGreeting(const char *name) {
    static char buffer[100];
    sprintf(buffer, "Hello, %s!", name);
    return buffer;
}

int main() {
    // 返回指针的函数指针
    char* (*funcPtr)(const char*) = getGreeting;

    printf("%s\n", funcPtr("Alice"));
    printf("%s\n", funcPtr("Bob"));

    return 0;
}
```

### 参数是函数指针的函数

```c
#include <stdio.h>

// 操作函数
int operate(int a, int b, int (*op)(int, int)) {
    return op(a, b);
}

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int main() {
    printf("3 + 5 = %d\n", operate(3, 5, add));
    printf("3 * 5 = %d\n", operate(3, 5, mul));

    return 0;
}
```

## typedef 简化函数指针

```c
#include <stdio.h>

// 定义函数指针类型
typedef int (*BinaryOp)(int, int);
typedef void (*Callback)(int);

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

void process(int result) {
    printf("Result: %d\n", result);
}

int execute(BinaryOp op, int a, int b, Callback cb) {
    int result = op(a, b);
    cb(result);
    return result;
}

int main() {
    execute(add, 10, 5, process);
    execute(sub, 10, 5, process);

    return 0;
}
```

## 函数指针结构体

```c
#include <stdio.h>
#include <string.h>

typedef struct {
    char name[20];
    int (*func)(int, int);
} Operation;

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }
int div(int a, int b) { return a / b; }

int main() {
    Operation ops[] = {
        {"Add", add},
        {"Sub", sub},
        {"Mul", mul},
        {"Div", div}
    };

    int a = 20, b = 5;

    for (int i = 0; i < 4; i++) {
        printf("%s(%d, %d) = %d\n",
               ops[i].name, a, b, ops[i].func(a, b));
    }

    return 0;
}
```

## 状态机实现

```c
#include <stdio.h>
#include <ctype.h>

typedef void (*State)(char);

// 状态函数
void start(char c);
void inWord(char c);
void inSpace(char c);

State currentState = start;
int wordCount = 0;

void start(char c) {
    if (isspace(c)) {
        currentState = inSpace;
    } else {
        wordCount++;
        currentState = inWord;
    }
}

void inWord(char c) {
    if (isspace(c)) {
        currentState = inSpace;
    }
}

void inSpace(char c) {
    if (!isspace(c)) {
        wordCount++;
        currentState = inWord;
    }
}

void processString(const char *str) {
    currentState = start;
    wordCount = 0;

    while (*str) {
        currentState(*str++);
    }
}

int main() {
    processString("Hello World from C");
    printf("Word count: %d\n", wordCount);

    return 0;
}
```

## 虚函数表模拟

```c
#include <stdio.h>

// 基类
typedef struct {
    void (*speak)(void*);
    void (*move)(void*);
} Animal;

// 派生类 - 狗
typedef struct {
    Animal base;
    int age;
} Dog;

// 派生类 - 猫
typedef struct {
    Animal base;
    int lives;
} Cat;

// 狗的实现
void dogSpeak(void *self) {
    printf("Dog: Woof!\n");
}

void dogMove(void *self) {
    printf("Dog: Running on four legs\n");
}

// 猫的实现
void catSpeak(void *self) {
    printf("Cat: Meow!\n");
}

void catMove(void *self) {
    printf("Cat: Walking silently\n");
}

// 构造函数
Dog* createDog() {
    static Dog dog;
    dog.base.speak = dogSpeak;
    dog.base.move = dogMove;
    dog.age = 3;
    return &dog;
}

Cat* createCat() {
    static Cat cat;
    cat.base.speak = catSpeak;
    cat.base.move = catMove;
    cat.lives = 9;
    return &cat;
}

int main() {
    Animal *animals[] = {(Animal*)createDog(), (Animal*)createCat()};

    for (int i = 0; i < 2; i++) {
        animals[i]->speak(animals[i]);
        animals[i]->move(animals[i]);
    }

    return 0;
}
```

## 回调函数应用

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// 回调类型定义
typedef void (*ProgressCallback)(int percent);

void defaultProgress(int percent) {
    printf("\rProgress: %3d%%", percent);
    fflush(stdout);
}

void verboseProgress(int percent) {
    printf("\rProcessing... %d%% complete", percent);
    fflush(stdout);
}

void longTask(int iterations, ProgressCallback callback) {
    for (int i = 0; i <= iterations; i++) {
        if (callback) {
            callback(100 * i / iterations);
        }
        // 模拟工作
        for (int j = 0; j < 1000000; j++);
    }
    printf("\n");
}

int main() {
    printf("Default progress:\n");
    longTask(100, defaultProgress);

    printf("Verbose progress:\n");
    longTask(100, verboseProgress);

    printf("No progress:\n");
    longTask(100, NULL);

    return 0;
}
```

## 练习

1. 使用函数指针实现插件系统框架
2. 实现通用的排序库，支持多种比较策略
3. 使用函数指针实现事件驱动系统
4. 实现一个简单的解释器，支持多种操作

---

[上一节：多级指针](03-multi-level.md) | [下一节：内存布局](../../c/6-memory/01-layout.md)
