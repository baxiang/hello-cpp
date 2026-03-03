# 10.1 stdio.h - 输入输出

## printf 格式化输出

```c
#include <stdio.h>

int main() {
    int num = 42;
    float f = 3.14159f;
    double d = 3.1415926535;
    char c = 'A';
    char *str = "Hello";

    // 整数
    printf("%d\n", num);      // 十进制：42
    printf("%o\n", num);      // 八进制：52
    printf("%x\n", num);      // 十六进制：2a
    printf("%X\n", num);      // 十六进制大写：2A

    // 浮点数
    printf("%f\n", f);        // 默认：3.141590
    printf("%.2f\n", f);      // 2 位小数：3.14
    printf("%e\n", d);        // 科学计数法

    // 字符和字符串
    printf("%c\n", c);        // 字符：A
    printf("%s\n", str);      // 字符串：Hello

    // 指针
    printf("%p\n", &num);     // 地址

    // 无符号
    printf("%u\n", num);      // 无符号整数

    // 宽度控制
    printf("%10d\n", num);    // 宽度 10，右对齐
    printf("%-10d\n", num);   // 宽度 10，左对齐
    printf("%010d\n", num);   // 宽度 10，前导零

    return 0;
}
```

## scanf 格式化输入

```c
#include <stdio.h>

int main() {
    int num;
    float f;
    double d;
    char c;
    char str[100];

    // 基本输入
    printf("Enter integer: ");
    scanf("%d", &num);

    printf("Enter float: ");
    scanf("%f", &f);

    printf("Enter char: ");
    scanf(" %c", &c);  // 注意空格，跳过空白

    printf("Enter string: ");
    scanf("%s", str);  // 不能含空格

    // 读取整行
    printf("Enter line: ");
    scanf(" %[^\n]", str);  // 读取到换行

    // 读取多个值
    int a, b;
    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);

    // 限制输入长度
    char name[20];
    scanf("%19s", name);  // 最多 19 字符 + \0

    return 0;
}
```

## getchar 和 putchar

```c
#include <stdio.h>

int main() {
    // 逐字符读取并输出
    int ch;

    printf("Enter text (Ctrl+D to end):\n");

    while ((ch = getchar()) != EOF) {
        // 转换为大写
        if (ch >= 'a' && ch <= 'z') {
            ch = ch - 'a' + 'A';
        }
        putchar(ch);
    }

    return 0;
}
```

## gets 和 puts（已废弃）

```c
#include <stdio.h>

int main() {
    char str[100];

    // gets 不安全，已废弃，使用 fgets
    // gets(str);

    // 安全的方式
    fgets(str, sizeof(str), stdin);

    puts(str);  // 输出字符串并换行

    return 0;
}
```

## sprintf 和 snprintf

```c
#include <stdio.h>

int main() {
    char buffer[100];

    // sprintf - 格式化到字符串
    sprintf(buffer, "Value: %d", 42);
    printf("%s\n", buffer);

    // snprintf - 安全版本（限制长度）
    char name[] = "Alice";
    int age = 25;
    snprintf(buffer, sizeof(buffer), "%s is %d years old", name, age);
    printf("%s\n", buffer);

    return 0;
}
```

## sscanf

```c
#include <stdio.h>

int main() {
    char str[] = "John 25 85.5";
    char name[50];
    int age;
    float score;

    // 从字符串解析
    sscanf(str, "%s %d %f", name, &age, &score);

    printf("Name: %s, Age: %d, Score: %.1f\n", name, age, score);

    return 0;
}
```

## 文件操作函数

```c
#include <stdio.h>

int main() {
    // 打开文件
    FILE *fp = fopen("test.txt", "r");

    if (fp == NULL) {
        perror("fopen");  // 打印错误信息
        return 1;
    }

    // 检查文件结尾
    if (feof(fp)) {
        printf("At end of file\n");
    }

    // 检查错误
    if (ferror(fp)) {
        printf("File error\n");
        clearerr(fp);  // 清除错误标志
    }

    fclose(fp);

    return 0;
}
```

## 完整示例

### 格式化表格

```c
#include <stdio.h>

int main() {
    printf("+----+----------+--------+\n");
    printf("| ID | Name     | Score  |\n");
    printf("+----+----------+--------+\n");
    printf("| %2d | %-8s | %6.1f |\n", 1, "Alice", 95.5);
    printf("| %2d | %-8s | %6.1f |\n", 2, "Bob", 87.0);
    printf("| %2d | %-8s | %6.1f |\n", 3, "Charlie", 92.5);
    printf("+----+----------+--------+\n");

    return 0;
}
```

### 简单计算器

```c
#include <stdio.h>

int main() {
    double a, b;
    char op;

    printf("Enter expression (e.g., 3 + 4): ");
    scanf("%lf %c %lf", &a, &op, &b);

    printf("%.2f %c %.2f = ", a, op, b);

    switch (op) {
        case '+':
            printf("%.2f\n", a + b);
            break;
        case '-':
            printf("%.2f\n", a - b);
            break;
        case '*':
            printf("%.2f\n", a * b);
            break;
        case '/':
            if (b != 0) {
                printf("%.2f\n", a / b);
            } else {
                printf("Error: Division by zero\n");
            }
            break;
        default:
            printf("Error: Unknown operator\n");
    }

    return 0;
}
```

### 数据导出

```c
#include <stdio.h>

typedef struct {
    char name[50];
    int age;
    float score;
} Student;

int main() {
    Student students[] = {
        {"Alice", 20, 95.5},
        {"Bob", 21, 87.0},
        {"Charlie", 19, 92.5}
    };

    int count = sizeof(students) / sizeof(students[0]);

    // CSV 格式导出
    FILE *fp = fopen("students.csv", "w");
    if (fp) {
        // 表头
        fprintf(fp, "name,age,score\n");

        // 数据
        for (int i = 0; i < count; i++) {
            fprintf(fp, "%s,%d,%.1f\n",
                    students[i].name,
                    students[i].age,
                    students[i].score);
        }

        fclose(fp);
        printf("Exported to students.csv\n");
    }

    return 0;
}
```

## 练习

1. 编写程序格式化输出乘法表
2. 实现简单的用户信息录入系统
3. 编写程序解析 CSV 文件
4. 实现带格式的报告生成

---

[上一节：条件编译](../../c/9-preprocessor/02-conditional.md) | [下一节：stdlib.h](02-stdlib.md)
