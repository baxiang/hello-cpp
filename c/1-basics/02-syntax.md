# 1.2 基本语法

## 标识符命名规则

标识符用于命名变量、函数、类型等。

**规则：**
- 由字母、数字、下划线组成
- 不能以数字开头
- 区分大小写
- 不能使用关键字

```c
int name;           // 合法
int _age;           // 合法
int student_count;  // 合法
int 2nd_place;      // 非法 - 以数字开头
int my-var;         // 非法 - 包含减号
```

## C 语言 32 个关键字

| 类别 | 关键字 |
|------|--------|
| **数据类型** | `int`, `float`, `double`, `char`, `void` |
| **类型修饰** | `signed`, `unsigned`, `short`, `long` |
| **存储类** | `auto`, `register`, `static`, `extern`, `typedef` |
| **控制结构** | `if`, `else`, `switch`, `case`, `default` |
| | `for`, `while`, `do`, `break`, `continue`, `goto`, `return` |
| **其他** | `const`, `sizeof`, `volatile`, `enum`, `struct`, `union` |

## 语句和表达式

**表达式** - 产生值的代码

```c
a + b           // 算术表达式
x = 5           // 赋值表达式
i++             // 自增表达式
a > b           // 关系表达式
```

**语句** - 完整的执行单位

```c
int x = 5;              // 声明语句
x = x + 1;              // 赋值语句

if (x > 0) {            // 控制语句
    printf("positive\n");
}

for (int i = 0; i < 10; i++) {  // 循环语句
    printf("%d\n", i);
}
```

## 注释

```c
// 单行注释（C99 起支持）

/*
 * 多行注释（C89 就支持）
 * 可以跨越多行
 */

/* 也可以这样写单行注释 */
```

## 代码示例

```c
#include <stdio.h>

// 关键字演示
int main() {
    // 变量声明
    int age = 25;
    float height = 1.75f;
    char grade = 'A';

    // 条件语句
    if (age >= 18) {
        printf("Adult\n");
    } else {
        printf("Minor\n");
    }

    // 循环语句
    for (int i = 0; i < 5; i++) {
        printf("i = %d\n", i);
    }

    return 0;
}
```

## 练习

1. 列举所有 32 个关键字
2. 编写程序演示各种语句类型

---

[上一节：C 语言简介](01-intro.md) | [下一节：数据类型](03-data-types.md)
