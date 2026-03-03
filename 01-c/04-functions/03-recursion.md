# 4.3 递归

## 递归基础

```c
#include <stdio.h>

// 递归函数示例 - 计算阶乘
int factorial(int n) {
    // 基本情况
    if (n == 0) {
        return 1;
    }
    // 递归情况
    return n * factorial(n - 1);
}

int main() {
    printf("5! = %d\n", factorial(5));  // 120
    return 0;
}
```

## 递归三要素

1. **基本情况（Base Case）** - 递归终止条件
2. **递归情况（Recursive Case）** - 函数调用自身
3. **进展** - 每次递归向基本情况靠近

## 经典递归示例

### 斐波那契数列

```c
#include <stdio.h>

// 递归实现
int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("Fibonacci sequence:\n");
    for (int i = 0; i < 10; i++) {
        printf("%d ", fibonacci(i));
    }
    printf("\n");
    return 0;
}
```

### 计算幂

```c
#include <stdio.h>

// 计算 n 的 k 次方
int power(int n, int k) {
    if (k == 0) return 1;
    return n * power(n, k - 1);
}

// 快速幂（优化）
int fastPower(int n, int k) {
    if (k == 0) return 1;

    int half = fastPower(n, k / 2);

    if (k % 2 == 0) {
        return half * half;
    } else {
        return n * half * half;
    }
}

int main() {
    printf("2^10 = %d\n", power(2, 10));      // 1024
    printf("2^10 = %d\n", fastPower(2, 10));  // 1024
    return 0;
}
```

### 汉诺塔

```c
#include <stdio.h>

void hanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        printf("Move disk 1 from %c to %c\n", from, to);
        return;
    }

    // 将 n-1 个盘子从 from 移到 aux
    hanoi(n - 1, from, aux, to);

    // 将第 n 个盘子从 from 移到 to
    printf("Move disk %d from %c to %c\n", n, from, to);

    // 将 n-1 个盘子从 aux 移到 to
    hanoi(n - 1, aux, to, from);
}

int main() {
    printf("Hanoi with 3 disks:\n");
    hanoi(3, 'A', 'C', 'B');
    return 0;
}
```

### 数字反转

```c
#include <stdio.h>

int reverse(int n, int rev) {
    if (n == 0) {
        return rev;
    }
    return reverse(n / 10, rev * 10 + n % 10);
}

int main() {
    int num = 12345;
    printf("Reverse of %d = %d\n", num, reverse(num, 0));
    return 0;
}
```

### 求和

```c
#include <stdio.h>

// 递归求 1 到 n 的和
int sum(int n) {
    if (n == 0) return 0;
    return n + sum(n - 1);
}

// 递归求数组和
int arraySum(int arr[], int n) {
    if (n == 0) return 0;
    return arr[n - 1] + arraySum(arr, n - 1);
}

int main() {
    printf("Sum 1 to 10: %d\n", sum(10));  // 55

    int arr[] = {1, 2, 3, 4, 5};
    printf("Array sum: %d\n", arraySum(arr, 5));  // 15

    return 0;
}
```

## 递归与迭代对比

### 阶乘

```c
#include <stdio.h>

// 递归版本
int factorialRecursive(int n) {
    if (n == 0) return 1;
    return n * factorialRecursive(n - 1);
}

// 迭代版本
int factorialIterative(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

int main() {
    printf("5! = %d\n", factorialRecursive(5));
    printf("5! = %d\n", factorialIterative(5));
    return 0;
}
```

| 特性 | 递归 | 迭代 |
|------|------|------|
| 代码简洁性 | 简洁 | 较长 |
| 性能 | 较慢（函数调用开销） | 较快 |
| 空间 | O(n) 栈空间 | O(1) |
| 可读性 | 对某些问题更直观 | 有时更清晰 |

## 递归注意事项

```c
#include <stdio.h>

// 错误：没有终止条件
// void infinite() {
//     infinite();  // 栈溢出！
// }

// 正确：确保有终止条件
void countdown(int n) {
    if (n < 0) return;  // 终止条件
    printf("%d ", n);
    countdown(n - 1);
}

int main() {
    countdown(5);  // 5 4 3 2 1 0
    return 0;
}
```

## 练习

1. 递归实现二分查找
2. 递归计算数字各位之和
3. 递归判断字符串是否为回文
4. 使用递归遍历二叉树（选做）

---

[上一节：参数传递](02-parameters.md) | [下一节：函数指针](04-function-pointer.md)
