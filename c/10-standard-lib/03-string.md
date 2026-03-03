# 10.3 string.h - 字符串处理

## 字符串长度

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "Hello, World!";

    size_t len = strlen(str);
    printf("Length: %zu\n", len);  // 13

    return 0;
}
```

## 字符串复制

```c
#include <stdio.h>
#include <string.h>

int main() {
    char src[] = "Hello, World!";
    char dest[50];

    // strcpy - 复制字符串
    strcpy(dest, src);
    printf("dest: %s\n", dest);

    // strncpy - 安全版本（指定最大长度）
    char dest2[10];
    strncpy(dest2, src, sizeof(dest2) - 1);
    dest2[sizeof(dest2) - 1] = '\0';  // 确保以\0结尾
    printf("dest2: %s\n", dest2);

    return 0;
}
```

## 字符串连接

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str1[50] = "Hello";
    char str2[] = " World";

    // strcat - 连接字符串
    strcat(str1, str2);
    printf("str1: %s\n", str1);  // Hello World

    // strncat - 安全版本
    char str3[20] = "Hello";
    strncat(str3, "123456789", 5);
    printf("str3: %s\n", str3);  // Hello12345

    return 0;
}
```

## 字符串比较

```c
#include <stdio.h>
#include <string.h>

int main() {
    char *s1 = "Hello";
    char *s2 = "Hello";
    char *s3 = "World";

    // strcmp - 比较字符串
    printf("s1 vs s2: %d\n", strcmp(s1, s2));  // 0 (相等)
    printf("s1 vs s3: %d\n", strcmp(s1, s3));  // 负数 (s1 < s3)
    printf("s3 vs s1: %d\n", strcmp(s3, s1));  // 正数 (s3 > s1)

    // strncmp - 比较前 n 个字符
    printf("strncmp: %d\n", strncmp("Hello123", "Hello456", 5));  // 0

    // 不区分大小写（非标准，但常用）
    // printf("%d\n", strcasecmp("Hello", "hello"));  // 0

    return 0;
}
```

## 字符串查找

### strchr 和 strrchr

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "Hello, World!";

    // strchr - 查找第一次出现
    char *p1 = strchr(str, 'o');
    if (p1) {
        printf("First 'o': %s\n", p1);  // o, World!
    }

    // strrchr - 查找最后一次出现
    char *p2 = strrchr(str, 'o');
    if (p2) {
        printf("Last 'o': %s\n", p2);  // orld!
    }

    return 0;
}
```

### strstr

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "Hello, World!";

    // strstr - 查找子串
    char *p = strstr(str, "World");
    if (p) {
        printf("Found: %s\n", p);  // World!
    }

    return 0;
}
```

## 字符串分割

### strtok

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "apple,banana,cherry,date";
    char *token;

    // strtok - 分割字符串
    token = strtok(str, ",");
    while (token != NULL) {
        printf("%s\n", token);
        token = strtok(NULL, ",");
    }

    return 0;
}
```

## 内存操作

### memset

```c
#include <stdio.h>
#include <string.h>

int main() {
    char buffer[20];

    // memset - 填充内存
    memset(buffer, 'A', 10);
    buffer[10] = '\0';
    printf("%s\n", buffer);  // AAAAAAAAAA

    // 清零
    int arr[5] = {1, 2, 3, 4, 5};
    memset(arr, 0, sizeof(arr));
    printf("%d %d %d %d %d\n", arr[0], arr[1], arr[2], arr[3], arr[4]);

    return 0;
}
```

### memcpy

```c
#include <stdio.h>
#include <string.h>

int main() {
    char src[] = "Hello, World!";
    char dest[20];

    // memcpy - 复制内存
    memcpy(dest, src, strlen(src) + 1);
    printf("%s\n", dest);

    // 复制结构体
    struct Point { int x; int y; };
    struct Point p1 = {10, 20};
    struct Point p2;
    memcpy(&p2, &p1, sizeof(struct Point));
    printf("p2: (%d, %d)\n", p2.x, p2.y);

    return 0;
}
```

### memmove

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "Hello, World!";

    // memmove - 安全复制（可处理重叠内存）
    memmove(str + 7, str, 5);  // 前 5 个字符移到后面
    printf("%s\n", str);  // Hello, Hello!

    return 0;
}
```

### memcmp

```c
#include <stdio.h>
#include <string.h>

int main() {
    char s1[] = "Hello";
    char s2[] = "Hello";
    char s3[] = "World";

    // memcmp - 比较内存
    printf("%d\n", memcmp(s1, s2, 5));  // 0
    printf("%d\n", memcmp(s1, s3, 5));  // 负数

    return 0;
}
```

## 完整示例

### 字符串反转

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
    char str[] = "Hello, World!";
    reverseString(str);
    printf("Reversed: %s\n", str);
    return 0;
}
```

### 字符串转大写

```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>

void toUpperCase(char *str) {
    while (*str) {
        *str = toupper(*str);
        str++;
    }
}

int main() {
    char str[] = "Hello, World!";
    toUpperCase(str);
    printf("%s\n", str);  // HELLO, WORLD!
    return 0;
}
```

### 统计单词

```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>

int countWords(const char *str) {
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

### 实现 trim 函数

```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>

char* trim(char *str) {
    // 修剪前导空格
    while (isspace(*str)) str++;

    if (*str == '\0') {
        return str;
    }

    // 修剪末尾空格
    char *end = str + strlen(str) - 1;
    while (end > str && isspace(*end)) end--;

    *(end + 1) = '\0';
    return str;
}

int main() {
    char str[] = "   Hello, World!   ";
    printf("Trimmed: '%s'\n", trim(str));
    return 0;
}
```

## 练习

1. 实现 strcpy 函数
2. 实现 strcmp 函数
3. 编写程序移除字符串中的所有空格
4. 实现简单的 CSV 解析器

---

[上一节：stdlib.h](02-stdlib.md) | [下一节：C++ 简介](../../cpp/1-intro/01-intro.md)
