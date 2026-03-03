# 4.1 函数基础

## 函数定义

```c
#include <stdio.h>

// 函数声明
int add(int a, int b);

int main() {
    int result = add(3, 5);
    printf("3 + 5 = %d\n", result);
    return 0;
}

// 函数定义
int add(int a, int b) {
    return a + b;
}
```

## 函数声明

```c
#include <stdio.h>

// 函数原型（声明）
int multiply(int, int);  // 参数名可省略

int main() {
    printf("%d\n", multiply(3, 4));
    return 0;
}

int multiply(int a, int b) {
    return a * b;
}
```

## 函数参数

```c
#include <stdio.h>

// 无参数
void sayHello() {
    printf("Hello!\n");
}

// 一个参数
void printNum(int n) {
    printf("Number: %d\n", n);
}

// 多个参数
int add(int a, int b, int c) {
    return a + b + c;
}

int main() {
    sayHello();
    printNum(10);
    printf("%d\n", add(1, 2, 3));
    return 0;
}
```

## 返回值

```c
#include <stdio.h>

// 有返回值
int square(int x) {
    return x * x;
}

// 多个 return
int max(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}

// 无返回值
void printStar() {
    printf("*****\n");
    return;  // 可省略
}

int main() {
    printf("%d\n", square(5));
    printf("%d\n", max(3, 7));
    printStar();
    return 0;
}
```

## 函数示例

### 判断素数

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
    for (int i = 1; i <= 20; i++) {
        if (isPrime(i)) {
            printf("%d ", i);
        }
    }
    printf("\n");
    return 0;
}
```

### 计算阶乘

```c
#include <stdio.h>

long long factorial(int n) {
    if (n < 0) return -1;
    if (n == 0) return 1;

    long long result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

int main() {
    for (int i = 0; i <= 10; i++) {
        printf("%d! = %lld\n", i, factorial(i));
    }
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

// 最小公倍数
int lcm(int a, int b) {
    return (a / gcd(a, b)) * b;
}

int main() {
    int a = 12, b = 18;
    printf("GCD(%d, %d) = %d\n", a, b, gcd(a, b));
    printf("LCM(%d, %d) = %d\n", a, b, lcm(a, b));
    return 0;
}
```

## 函数作用域

```c
#include <stdio.h>

int global_var = 100;  // 全局变量

void func() {
    int local_var = 10;  // 局部变量
    global_var = 200;    // 可访问全局变量
    printf("local_var = %d\n", local_var);
}

int main() {
    // printf("%d\n", local_var);  // 错误！局部变量不可见
    printf("global_var = %d\n", global_var);
    func();
    printf("global_var = %d\n", global_var);
    return 0;
}
```

## 练习

1. 编写函数判断闰年
2. 编写函数计算圆的面积和周长
3. 编写函数实现摄氏度转华氏度
4. 编写函数打印九九乘法表

---

[上一节：字符串](../../c/3-array-string/02-strings.md) | [下一节：参数传递](02-parameters.md)
