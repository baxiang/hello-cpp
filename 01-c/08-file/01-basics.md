# 8.1 文件基础

## 文件指针

```c
#include <stdio.h>

int main() {
    // 文件指针
    FILE *fp;

    // 打开文件
    fp = fopen("test.txt", "r");

    if (fp == NULL) {
        printf("Failed to open file\n");
        return 1;
    }

    // 使用文件...

    // 关闭文件
    fclose(fp);

    return 0;
}
```

## 打开模式

| 模式 | 说明 | 文件存在 | 文件不存在 |
|------|------|---------|-----------|
| "r" | 只读读取 | 成功 | 失败 |
| "w" | 只写创建 | 清空内容 | 创建 |
| "a" | 追加写入 | 追加到末尾 | 创建 |
| "r+" | 读写 | 成功 | 失败 |
| "w+" | 读写创建 | 清空内容 | 创建 |
| "a+" | 读写追加 | 追加到末尾 | 创建 |
| "rb", "wb" | 二进制模式 | - | - |

## 创建和写入文件

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("test.txt", "w");

    if (fp == NULL) {
        printf("Failed to open file\n");
        return 1;
    }

    // 写入字符串
    fprintf(fp, "Hello, File!\n");

    // 写入变量
    int num = 42;
    fprintf(fp, "Number: %d\n", num);

    fclose(fp);
    printf("File written successfully\n");

    return 0;
}
```

## 读取文件

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("test.txt", "r");

    if (fp == NULL) {
        printf("Failed to open file\n");
        return 1;
    }

    char buffer[256];

    // 逐行读取
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        printf("%s", buffer);
    }

    fclose(fp);
    return 0;
}
```

## 文件检查

```c
#include <stdio.h>

int main() {
    FILE *fp;

    // 检查文件是否存在
    fp = fopen("test.txt", "r");
    if (fp == NULL) {
        printf("File does not exist\n");
    } else {
        printf("File exists\n");
        fclose(fp);
    }

    return 0;
}
```

## 完整示例

### 复制文件

```c
#include <stdio.h>

int copyFile(const char *src, const char *dest) {
    FILE *srcFp = fopen(src, "r");
    if (srcFp == NULL) {
        printf("Cannot open source file\n");
        return -1;
    }

    FILE *destFp = fopen(dest, "w");
    if (destFp == NULL) {
        printf("Cannot open destination file\n");
        fclose(srcFp);
        return -1;
    }

    char buffer[256];
    while (fgets(buffer, sizeof(buffer), srcFp) != NULL) {
        fputs(buffer, destFp);
    }

    fclose(srcFp);
    fclose(destFp);

    printf("File copied successfully\n");
    return 0;
}

int main() {
    copyFile("source.txt", "destination.txt");
    return 0;
}
```

### 统计文件行数

```c
#include <stdio.h>

int countLines(const char *filename) {
    FILE *fp = fopen(filename, "r");
    if (fp == NULL) {
        return -1;
    }

    int count = 0;
    char buffer[256];

    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        count++;
    }

    fclose(fp);
    return count;
}

int main() {
    int lines = countLines("test.txt");
    printf("Total lines: %d\n", lines);
    return 0;
}
```

### 追加内容

```c
#include <stdio.h>
#include <time.h>

void appendLog(const char *filename, const char *message) {
    FILE *fp = fopen(filename, "a");
    if (fp == NULL) {
        printf("Cannot open file\n");
        return;
    }

    // 获取时间
    time_t now = time(NULL);
    char *timestamp = ctime(&now);
    timestamp[24] = '\0';  // 去掉换行

    fprintf(fp, "[%s] %s\n", timestamp, message);
    fclose(fp);
}

int main() {
    appendLog("app.log", "Application started");
    appendLog("app.log", "Processing data...");
    appendLog("app.log", "Application finished");
    return 0;
}
```

## 练习

1. 编写程序创建并写入个人信息到文件
2. 编写程序读取文件并显示内容
3. 实现文件内容搜索功能
4. 编写程序合并两个文件

---

[上一节：枚举](../../c/7-structs/03-enum.md) | [下一节：文件读写](02-read-write.md)
