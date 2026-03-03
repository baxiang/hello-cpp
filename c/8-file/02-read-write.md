# 8.2 文件读写

## 字符读写

### fgetc 和 fputc

```c
#include <stdio.h>

int main() {
    FILE *src = fopen("source.txt", "r");
    FILE *dest = fopen("dest.txt", "w");

    if (!src || !dest) {
        printf("Failed to open files\n");
        return 1;
    }

    int ch;
    // 逐字符复制
    while ((ch = fgetc(src)) != EOF) {
        fputc(ch, dest);
    }

    fclose(src);
    fclose(dest);
    return 0;
}
```

## 字符串读写

### fgets 和 fputs

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("test.txt", "w+");

    // 写入字符串
    fputs("Line 1\n", fp);
    fputs("Line 2\n", fp);
    fputs("Line 3\n", fp);

    // 回到文件开头
    rewind(fp);

    // 读取字符串
    char buffer[100];
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        printf("%s", buffer);
    }

    fclose(fp);
    return 0;
}
```

## 格式化读写

### fprintf 和 fscanf

```c
#include <stdio.h>

typedef struct {
    char name[50];
    int age;
    float score;
} Student;

int main() {
    Student s1 = {"Alice", 20, 95.5f};
    Student s2 = {"Bob", 21, 87.0f};

    // 写入
    FILE *fp = fopen("students.txt", "w");
    fprintf(fp, "%s %d %.1f\n", s1.name, s1.age, s1.score);
    fprintf(fp, "%s %d %.1f\n", s2.name, s2.age, s2.score);
    fclose(fp);

    // 读取
    fp = fopen("students.txt", "r");
    Student temp;
    while (fscanf(fp, "%s %d %f", temp.name, &temp.age, &temp.score) == 3) {
        printf("%s, %d, %.1f\n", temp.name, temp.age, temp.score);
    }
    fclose(fp);

    return 0;
}
```

## 二进制读写

### fread 和 fwrite

```c
#include <stdio.h>

typedef struct {
    int id;
    char name[20];
    float score;
} Record;

int main() {
    Record records[3] = {
        {1, "Alice", 95.5f},
        {2, "Bob", 87.0f},
        {3, "Charlie", 92.0f}
    };

    // 写入二进制文件
    FILE *fp = fopen("data.bin", "wb");
    fwrite(records, sizeof(Record), 3, fp);
    fclose(fp);

    // 读取二进制文件
    Record buffer[3];
    fp = fopen("data.bin", "rb");
    size_t count = fread(buffer, sizeof(Record), 3, fp);
    fclose(fp);

    printf("Read %zu records:\n", count);
    for (size_t i = 0; i < count; i++) {
        printf("%d: %s, %.1f\n",
               buffer[i].id, buffer[i].name, buffer[i].score);
    }

    return 0;
}
```

## 文件定位

### fseek, ftell, rewind

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("test.txt", "r+");

    // 写入
    fprintf(fp, "Hello, World!");

    // 回到开头
    rewind(fp);

    // 读取前 5 个字符
    char buffer[6] = {0};
    fread(buffer, 1, 5, fp);
    printf("First 5 chars: %s\n", buffer);

    // 获取当前位置
    long pos = ftell(fp);
    printf("Current position: %ld\n", pos);

    // 移动到倒数第 6 个字符
    fseek(fp, -6, SEEK_END);
    pos = ftell(fp);
    printf("Position from end: %ld\n", pos);

    // 读取剩余内容
    fgets(buffer, sizeof(buffer), fp);
    printf("Last part: %s\n", buffer);

    fclose(fp);
    return 0;
}
```

### fseek 偏移量

```c
fseek(fp, offset, SEEK_SET);  // 从文件开头
fseek(fp, offset, SEEK_CUR);  // 从当前位置
fseek(fp, offset, SEEK_END);  // 从文件末尾
```

## 文件状态检测

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("test.txt", "r");

    if (fp == NULL) {
        printf("Cannot open file\n");
        return 1;
    }

    char buffer[100];

    // 读取直到文件尾
    while (!feof(fp)) {
        if (fgets(buffer, sizeof(buffer), fp) != NULL) {
            printf("%s", buffer);
        }
    }

    // 检查错误
    if (ferror(fp)) {
        printf("Error reading file\n");
        clearerr(fp);
    }

    fclose(fp);
    return 0;
}
```

## 完整示例

### 学生成绩管理

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[50];
    float scores[3];
    float average;
} Student;

void calculateAverage(Student *s) {
    s->average = (s->scores[0] + s->scores[1] + s->scores[2]) / 3.0f;
}

int saveStudents(const char *filename, Student *students, int count) {
    FILE *fp = fopen(filename, "wb");
    if (!fp) return -1;

    fwrite(students, sizeof(Student), count, fp);
    fclose(fp);
    return 0;
}

int loadStudents(const char *filename, Student *students, int maxCount) {
    FILE *fp = fopen(filename, "rb");
    if (!fp) return -1;

    int count = fread(students, sizeof(Student), maxCount, fp);
    fclose(fp);
    return count;
}

int main() {
    Student students[3] = {
        {1, "Alice", {90, 85, 95}, 0},
        {2, "Bob", {80, 75, 85}, 0},
        {3, "Charlie", {70, 65, 75}, 0}
    };

    // 计算平均分
    for (int i = 0; i < 3; i++) {
        calculateAverage(&students[i]);
    }

    // 保存
    saveStudents("students.dat", students, 3);

    // 读取
    Student loaded[3];
    int count = loadStudents("students.dat", loaded, 3);

    printf("Loaded %d students:\n", count);
    for (int i = 0; i < count; i++) {
        printf("%s (ID: %d) - Avg: %.2f\n",
               loaded[i].name, loaded[i].id, loaded[i].average);
    }

    return 0;
}
```

### 简单文本编辑器

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE 1024

char* readFile(const char *filename) {
    FILE *fp = fopen(filename, "r");
    if (!fp) return NULL;

    // 获取文件大小
    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    fseek(fp, 0, SEEK_SET);

    // 分配缓冲区
    char *buffer = (char*)malloc(size + 1);
    if (!buffer) {
        fclose(fp);
        return NULL;
    }

    // 读取
    size_t read = fread(buffer, 1, size, fp);
    buffer[read] = '\0';
    fclose(fp);

    return buffer;
}

int writeFile(const char *filename, const char *content) {
    FILE *fp = fopen(filename, "w");
    if (!fp) return -1;

    fputs(content, fp);
    fclose(fp);
    return 0;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <filename>\n", argv[0]);
        return 1;
    }

    char *content = readFile(argv[1]);
    if (content) {
        printf("File content:\n%s\n", content);
        free(content);
    } else {
        printf("File not found or empty\n");
    }

    return 0;
}
```

## 练习

1. 编写程序实现简单的日记本（追加模式）
2. 实现二进制文件的复制功能
3. 编写程序统计文件中单词数量
4. 实现一个简单的数据库（增删改查记录）

---

[上一节：文件基础](01-basics.md) | [下一节：宏定义](../../c/9-preprocessor/01-macro.md)
