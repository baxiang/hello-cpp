# 7.1 结构体

## 结构体定义

```c
#include <stdio.h>

// 定义结构体类型
struct Person {
    char name[50];
    int age;
    float height;
};

int main() {
    // 创建结构体变量
    struct Person p1;

    // 访问成员
    strcpy(p1.name, "Alice");
    p1.age = 25;
    p1.height = 1.65f;

    printf("Name: %s, Age: %d, Height: %.2f\n",
           p1.name, p1.age, p1.height);

    return 0;
}
```

## 结构体初始化

```c
#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main() {
    // 完整初始化
    struct Point p1 = {10, 20};

    // 指定成员初始化（C99）
    struct Point p2 = {.y = 20, .x = 10};

    // 部分初始化（其余为 0）
    struct Point p3 = {5};

    printf("p1: (%d, %d)\n", p1.x, p1.y);
    printf("p2: (%d, %d)\n", p2.x, p2.y);
    printf("p3: (%d, %d)\n", p3.x, p3.y);

    return 0;
}
```

## 结构体数组

```c
#include <stdio.h>

struct Student {
    char name[50];
    int id;
    float score;
};

int main() {
    struct Student students[3] = {
        {"Alice", 1, 95.5f},
        {"Bob", 2, 87.0f},
        {"Charlie", 3, 92.0f}
    };

    for (int i = 0; i < 3; i++) {
        printf("%s (ID: %d): %.1f\n",
               students[i].name, students[i].id, students[i].score);
    }

    return 0;
}
```

## 结构体指针

```c
#include <stdio.h>

struct Person {
    char name[50];
    int age;
};

int main() {
    struct Person p1 = {"Alice", 25};

    // 指向结构体的指针
    struct Person *ptr = &p1;

    // 访问成员（两种写法）
    printf("(*ptr).name = %s\n", (*ptr).name);
    printf("ptr->name = %s\n", ptr->name);  // 推荐

    printf("ptr->age = %d\n", ptr->age);

    return 0;
}
```

## 结构体和函数

```c
#include <stdio.h>

struct Point {
    int x;
    int y;
};

// 值传递
void printPoint(struct Point p) {
    printf("(%d, %d)\n", p.x, p.y);
}

// 指针传递（推荐）
void movePoint(struct Point *p, int dx, int dy) {
    p->x += dx;
    p->y += dy;
}

// 返回结构体
struct Point createPoint(int x, int y) {
    struct Point p = {x, y};
    return p;
}

int main() {
    struct Point p = {10, 20};

    printPoint(p);
    movePoint(&p, 5, 5);
    printPoint(p);

    struct Point p2 = createPoint(100, 200);
    printPoint(p2);

    return 0;
}
```

## 嵌套结构体

```c
#include <stdio.h>

struct Date {
    int year;
    int month;
    int day;
};

struct Employee {
    char name[50];
    int id;
    struct Date hireDate;
};

int main() {
    struct Employee emp = {
        "John",
        1001,
        {2020, 6, 15}
    };

    printf("Employee: %s\n", emp.name);
    printf("Hire Date: %d-%02d-%02d\n",
           emp.hireDate.year,
           emp.hireDate.month,
           emp.hireDate.day);

    return 0;
}
```

## 完整示例

### 学生管理系统

```c
#include <stdio.h>
#include <string.h>

#define MAX_STUDENTS 100

struct Student {
    int id;
    char name[50];
    float scores[3];
    float average;
};

void calculateAverage(struct Student *s) {
    s->average = (s->scores[0] + s->scores[1] + s->scores[2]) / 3.0f;
}

void printStudent(struct Student *s) {
    printf("ID: %d, Name: %s, Avg: %.2f\n",
           s->id, s->name, s->average);
}

int main() {
    struct Student students[MAX_STUDENTS] = {
        {1, "Alice", {90, 85, 95}, 0},
        {2, "Bob", {80, 75, 85}, 0},
        {3, "Charlie", {70, 65, 75}, 0}
    };

    for (int i = 0; i < 3; i++) {
        calculateAverage(&students[i]);
        printStudent(&students[i]);
    }

    return 0;
}
```

### 复数运算

```c
#include <stdio.h>

typedef struct {
    double real;
    double imag;
} Complex;

Complex add(Complex a, Complex b) {
    Complex result;
    result.real = a.real + b.real;
    result.imag = a.imag + b.imag;
    return result;
}

Complex multiply(Complex a, Complex b) {
    Complex result;
    result.real = a.real * b.real - a.imag * b.imag;
    result.imag = a.real * b.imag + a.imag * b.real;
    return result;
}

void printComplex(Complex c) {
    printf("%.2f + %.2fi\n", c.real, c.imag);
}

int main() {
    Complex a = {3, 4};
    Complex b = {1, -2};

    printf("a = ");
    printComplex(a);
    printf("b = ");
    printComplex(b);

    printf("a + b = ");
    printComplex(add(a, b));

    printf("a * b = ");
    printComplex(multiply(a, b));

    return 0;
}
```

## typedef 简化

```c
#include <stdio.h>

// 使用 typedef
typedef struct {
    int x;
    int y;
    int width;
    int height;
} Rectangle;

int main() {
    // 不需要写 struct
    Rectangle rect = {0, 0, 100, 50};

    printf("Rectangle: (%d, %d) %dx%d\n",
           rect.x, rect.y, rect.width, rect.height);

    return 0;
}
```

## 练习

1. 定义表示时间的结构体，实现时间相加函数
2. 定义表示向量的结构体，实现向量点积和叉积
3. 实现简单的通讯录程序
4. 使用结构体数组管理图书信息

---

[上一节：常见内存错误](../../c/6-memory/03-common-errors.md) | [下一节：联合体](02-union.md)
