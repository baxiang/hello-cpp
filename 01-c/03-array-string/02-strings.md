# 3.2 字符串

## 字符串基础

```c
#include <stdio.h>

int main() {
    // 字符串字面量
    char *str = "Hello, World!";

    // 字符数组
    char arr[] = "Hello";

    // 等价于
    char arr2[] = {'H', 'e', 'l', 'l', 'o', '\0'};

    printf("%s\n", str);
    printf("%s\n", arr);

    return 0;
}
```

**注意：** C 语言字符串以 `\0`（空字符）结尾

## 字符串输入输出

```c
#include <stdio.h>

int main() {
    char name[50];

    // 输入（不能包含空格）
    printf("Enter name: ");
    scanf("%s", name);

    // 输出
    printf("Hello, %s!\n", name);

    // 输入包含空格的字符串
    char sentence[100];
    printf("Enter sentence: ");

    // 方法 1: 使用 fgets（推荐）
    fgets(sentence, sizeof(sentence), stdin);

    // 方法 2: 使用 scanset
    // scanf("%[^\n]", sentence);

    printf("You said: %s", sentence);

    return 0;
}
```

## 常用字符串函数

### strlen - 字符串长度

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "Hello";
    size_t len = strlen(str);  // 5（不包括\0）

    printf("Length: %zu\n", len);

    return 0;
}
```

### strcpy - 字符串复制

```c
#include <stdio.h>
#include <string.h>

int main() {
    char src[] = "Hello";
    char dest[20];

    // 复制字符串
    strcpy(dest, src);

    printf("dest: %s\n", dest);  // Hello

    return 0;
}
```

### strcat - 字符串连接

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str1[50] = "Hello";
    char str2[] = " World";

    // 连接字符串
    strcat(str1, str2);

    printf("Result: %s\n", str1);  // Hello World

    return 0;
}
```

### strcmp - 字符串比较

```c
#include <stdio.h>
#include <string.h>

int main() {
    char *s1 = "Hello";
    char *s2 = "Hello";
    char *s3 = "World";

    // 比较字符串
    printf("s1 vs s2: %d\n", strcmp(s1, s2));  // 0（相等）
    printf("s1 vs s3: %d\n", strcmp(s1, s3));  // 负数（s1 < s3）
    printf("s3 vs s1: %d\n", strcmp(s3, s1));  // 正数（s3 > s1）

    // 返回值说明：
    // 0  - 相等
    // <0 - s1 小于 s2
    // >0 - s1 大于 s2

    return 0;
}
```

## 字符串函数完整示例

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str1[100] = "Hello";
    char str2[] = "World";

    // 长度
    printf("strlen(str1) = %zu\n", strlen(str1));

    // 复制
    strcpy(str1, str2);
    printf("After strcpy: %s\n", str1);

    // 连接
    strcat(str1, "!");
    printf("After strcat: %s\n", str1);

    // 比较
    if (strcmp(str1, "World!") == 0) {
        printf("Equal!\n");
    }

    // 查找字符
    char *ptr = strchr(str1, 'o');
    if (ptr) {
        printf("Found 'o' at position: %ld\n", ptr - str1);
    }

    // 查找子串
    ptr = strstr(str1, "orl");
    if (ptr) {
        printf("Found 'orl' in string\n");
    }

    return 0;
}
```

## 字符串数组

```c
#include <stdio.h>

int main() {
    // 字符串数组
    char *names[] = {"Alice", "Bob", "Charlie"};

    for (int i = 0; i < 3; i++) {
        printf("Name %d: %s\n", i, names[i]);
    }

    // 二维字符数组
    char colors[3][20] = {"Red", "Green", "Blue"};

    for (int i = 0; i < 3; i++) {
        printf("Color %d: %s\n", i, colors[i]);
    }

    return 0;
}
```

## 字符串练习

### 反转字符串

```c
#include <stdio.h>
#include <string.h>

void reverseString(char *str) {
    int len = strlen(str);
    for (int i = 0; i < len / 2; i++) {
        char temp = str[i];
        str[i] = str[len - 1 - i];
        str[len - 1 - i] = temp;
    }
}

int main() {
    char str[] = "Hello";
    reverseString(str);
    printf("Reversed: %s\n", str);  // olleH
    return 0;
}
```

### 统计单词数

```c
#include <stdio.h>
#include <ctype.h>

int countWords(char *str) {
    int count = 0;
    int inWord = 0;

    while (*str) {
        if (isspace(*str)) {
            inWord = 0;
        } else if (!inWord) {
            inWord = 1;
            count++;
        }
        str++;
    }

    return count;
}

int main() {
    char str[] = "Hello World from C";
    printf("Word count: %d\n", countWords(str));  // 4
    return 0;
}
```

## 练习

1. 实现字符串转大写函数
2. 实现字符串转小写函数
3. 判断字符串是否为回文
4. 实现 strstr 函数

---

[上一节：数组](01-arrays.md) | [下一节：函数基础](../../c/4-functions/01-basics.md)
