# 2.1 条件语句

## if 语句

### 基本形式

```c
#include <stdio.h>

int main() {
    int age = 20;

    // 单分支
    if (age >= 18) {
        printf("Adult\n");
    }

    // 双分支
    if (age >= 18) {
        printf("Adult\n");
    } else {
        printf("Minor\n");
    }

    // 多分支
    if (age < 6) {
        printf("Child\n");
    } else if (age < 18) {
        printf("Teenager\n");
    } else if (age < 60) {
        printf("Adult\n");
    } else {
        printf("Senior\n");
    }

    return 0;
}
```

### if 语句注意事项

```c
#include <stdio.h>

int main() {
    int x = 10;

    // if 后面不要加分号
    if (x > 5);  // 错误！空语句
    {
        printf("This always prints\n");  // 这行总是执行
    }

    // 正确写法
    if (x > 5) {
        printf("x is greater than 5\n");
    }

    // 单语句可以省略花括号（但不推荐）
    if (x > 5)
        printf("x > 5\n");
    else
        printf("x <= 5\n");

    return 0;
}
```

### 条件表达式

```c
#include <stdio.h>

int main() {
    int a = 10, b = 5, c = 0;

    // 关系运算
    if (a > b) {
        printf("a > b\n");
    }

    // 逻辑与
    if (a > b && b > 0) {
        printf("a > b and b > 0\n");
    }

    // 逻辑或
    if (a > 0 || b > 0) {
        printf("at least one is positive\n");
    }

    // 判断 0
    if (c) {        // c != 0 时为真
        printf("c is non-zero\n");
    }

    if (!c) {       // c == 0 时为真
        printf("c is zero\n");
    }

    return 0;
}
```

## switch 语句

### 基本形式

```c
#include <stdio.h>

int main() {
    int day = 3;

    switch (day) {
        case 1:
            printf("Monday\n");
            break;
        case 2:
            printf("Tuesday\n");
            break;
        case 3:
            printf("Wednesday\n");
            break;
        case 4:
            printf("Thursday\n");
            break;
        case 5:
            printf("Friday\n");
            break;
        case 6:
            printf("Saturday\n");
            break;
        case 7:
            printf("Sunday\n");
            break;
        default:
            printf("Invalid day\n");
            break;
    }

    return 0;
}
```

### break 的作用

```c
#include <stdio.h>

int main() {
    // 有 break - 每个 case 独立执行
    int x = 1;
    switch (x) {
        case 1:
            printf("One\n");
            break;
        case 2:
            printf("Two\n");
            break;
        default:
            printf("Other\n");
    }

    // 无 break - case 穿透
    printf("\nWithout break:\n");
    switch (x) {
        case 1:
            printf("One\n");     // 会执行
        case 2:
            printf("Two\n");     // 也会执行（穿透）
        default:
            printf("Other\n");   // 也会执行（穿透）
    }

    return 0;
}
```

**输出：**
```
One

Without break:
One
Two
Other
```

### case 穿透的应用

```c
#include <stdio.h>

int main() {
    char grade = 'B';

    // 多个 case 共享同一段代码
    switch (grade) {
        case 'A':
        case 'B':
        case 'C':
            printf("Pass\n");
            break;
        case 'D':
        case 'E':
            printf("Fail\n");
            break;
        default:
            printf("Invalid grade\n");
    }

    return 0;
}
```

### switch 的限制

```c
// switch 只能用于整数类型（int, char, enum）
switch (3.14) {      // 错误！不能用于 float/double
    case 1: break;
}

switch ('A') {       // 正确，char 是整数类型
    case 'A': break;
}

// case 后面必须是常量表达式
int x = 5;
switch (10) {
    case x: break;   // 错误！x 不是常量
    case 5: break;   // 正确
    case 3 + 2: break;  // 正确，编译时计算
}
```

## if 和 switch 的选择

| if | switch |
|----|--------|
| 范围判断 | 等值判断 |
| 复杂条件 | 单一变量多值 |
| 浮点数 | 整数/字符/枚举 |

```c
// 用 if - 范围判断
if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
}

// 用 switch - 等值判断
switch (grade) {
    case 'A': printf("Excellent\n"); break;
    case 'B': printf("Good\n"); break;
}
```

## 完整示例

```c
#include <stdio.h>

int main() {
    // if 示例 - 判断闰年
    int year = 2024;

    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        printf("%d is a leap year\n", year);
    } else {
        printf("%d is not a leap year\n", year);
    }

    // switch 示例 - 简单计算器
    char op = '+';
    int a = 10, b = 5;

    switch (op) {
        case '+':
            printf("%d + %d = %d\n", a, b, a + b);
            break;
        case '-':
            printf("%d - %d = %d\n", a, b, a - b);
            break;
        case '*':
            printf("%d * %d = %d\n", a, b, a * b);
            break;
        case '/':
            if (b != 0) {
                printf("%d / %d = %d\n", a, b, a / b);
            }
            break;
        default:
            printf("Invalid operator\n");
    }

    return 0;
}
```

## 练习

1. 编写程序判断一个数是正数、负数还是零
2. 使用 switch 实现成绩等级转换（90+ 为 A，80-89 为 B，等）
3. 编写程序判断闰年
4. 实现简单计算器程序

---

[上一节：运算符](../../c/1-basics/05-operators.md) | [下一节：循环语句](02-loops.md)
