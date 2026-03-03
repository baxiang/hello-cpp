# 2.2 循环语句

## for 循环

### 基本形式

```c
#include <stdio.h>

int main() {
    // for 循环基本语法
    for (初始化; 条件; 更新) {
        // 循环体
    }

    // 示例：打印 1 到 5
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    // 输出：1 2 3 4 5

    return 0;
}
```

### for 循环执行流程

```
1. 执行初始化（只执行一次）
2. 检查条件
3. 如果条件为真，执行循环体
4. 执行更新
5. 回到步骤 2
6. 如果条件为假，退出循环
```

### for 循环变体

```c
#include <stdio.h>

int main() {
    // 多个变量
    for (int i = 0, j = 10; i < j; i++, j--) {
        printf("i = %d, j = %d\n", i, j);
    }

    // 省略初始化
    int i = 0;
    for (; i < 5; i++) {
        printf("%d ", i);
    }

    // 省略更新
    for (int j = 0; j < 5;) {
        printf("%d ", j);
        j++;
    }

    // 无限循环
    for (;;) {
        // 需要 break 退出
        break;
    }

    return 0;
}
```

## while 循环

### 基本形式

```c
#include <stdio.h>

int main() {
    // while 循环
    int i = 1;
    while (i <= 5) {
        printf("%d ", i);
        i++;
    }
    // 输出：1 2 3 4 5

    return 0;
}
```

### while 应用示例

```c
#include <stdio.h>

int main() {
    // 计算 1 到 100 的和
    int sum = 0;
    int i = 1;

    while (i <= 100) {
        sum += i;
        i++;
    }

    printf("Sum = %d\n", sum);  // 5050

    return 0;
}
```

## do-while 循环

### 基本形式

```c
#include <stdio.h>

int main() {
    // do-while 循环 - 至少执行一次
    int i = 1;
    do {
        printf("%d ", i);
        i++;
    } while (i <= 5);
    // 输出：1 2 3 4 5

    // 与 while 的区别
    int x = 10;
    do {
        printf("do-while: %d\n", x);  // 会执行一次
    } while (x < 5);

    while (x < 5) {
        printf("while: %d\n", x);  // 不会执行
    }

    return 0;
}
```

## 循环对比

| 循环类型 | 特点 | 使用场景 |
|---------|------|---------|
| for | 先判断后执行，计数循环 | 已知循环次数 |
| while | 先判断后执行 | 未知循环次数 |
| do-while | 先执行后判断 | 至少执行一次 |

## 嵌套循环

```c
#include <stdio.h>

int main() {
    // 打印九九乘法表
    for (int i = 1; i <= 9; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%d×%d=%2d ", j, i, i * j);
        }
        printf("\n");
    }

    return 0;
}
```

**输出：**
```
1×1= 1
1×2= 2 2×2= 4
1×3= 3 2×3= 6 3×3= 9
...
```

## 循环示例

### 打印图案

```c
#include <stdio.h>

int main() {
    // 打印直角三角形
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\n");
    }

    // 打印等腰三角形
    for (int i = 1; i <= 5; i++) {
        // 打印空格
        for (int j = 1; j <= 5 - i; j++) {
            printf(" ");
        }
        // 打印星号
        for (int k = 1; k <= 2 * i - 1; k++) {
            printf("*");
        }
        printf("\n");
    }

    return 0;
}
```

### 素数判断

```c
#include <stdio.h>
#include <stdbool.h>

bool isPrime(int n) {
    if (n <= 1) return false;

    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
}

int main() {
    printf("Primes under 50:\n");
    for (int i = 2; i < 50; i++) {
        if (isPrime(i)) {
            printf("%d ", i);
        }
    }
    printf("\n");
    return 0;
}
```

### 求最大公约数

```c
#include <stdio.h>

// 辗转相除法
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int main() {
    int a = 48, b = 18;
    printf("GCD of %d and %d is %d\n", a, b, gcd(a, b));
    return 0;
}
```

## 练习

1. 使用 for 循环计算 1 到 100 的偶数和
2. 使用 while 循环实现猜数字游戏
3. 打印菱形图案
4. 找出 1000 以内的所有完数（因子和等于自身的数）
5. 打印斐波那契数列前 20 项

---

[上一节：条件语句](01-conditionals.md) | [下一节：跳转语句](03-jump.md)
