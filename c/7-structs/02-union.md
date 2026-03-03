# 7.2 联合体

## 联合体定义

```c
#include <stdio.h>

// 联合体定义
union Data {
    int i;
    float f;
    char str[20];
};

int main() {
    union Data data;

    // 同一时间只能存储一种类型
    data.i = 10;
    printf("data.i = %d\n", data.i);

    data.f = 3.14f;
    printf("data.f = %f\n", data.f);
    // 注意：此时 data.i 的值不再有效

    printf("Size: %zu bytes\n", sizeof(data));  // 20

    return 0;
}
```

## 联合体和结构体的区别

```c
#include <stdio.h>

struct Struct {
    int i;
    float f;
    char c;
};

union Union {
    int i;
    float f;
    char c;
};

int main() {
    printf("Struct size: %zu bytes\n", sizeof(struct Struct));
    // 通常 12 (4 + 4 + 4，可能有 padding)

    printf("Union size: %zu bytes\n", sizeof(union Union));
    // 4 (最大成员的大小)

    return 0;
}
```

**关键区别：**
- 结构体：每个成员有独立内存，总大小是各成员大小之和
- 联合体：所有成员共享内存，大小等于最大成员的大小

## 联合体应用

### 类型识别

```c
#include <stdio.h>

typedef enum {
    TYPE_INT,
    TYPE_FLOAT,
    TYPE_STRING
} DataType;

typedef struct {
    DataType type;
    union {
        int i;
        float f;
        char str[20];
    } data;
} Variant;

void printVariant(Variant *v) {
    switch (v->type) {
        case TYPE_INT:
            printf("int: %d\n", v->data.i);
            break;
        case TYPE_FLOAT:
            printf("float: %f\n", v->data.f);
            break;
        case TYPE_STRING:
            printf("string: %s\n", v->data.str);
            break;
    }
}

int main() {
    Variant v1 = {TYPE_INT, {.i = 42}};
    Variant v2 = {TYPE_FLOAT, {.f = 3.14f}};
    Variant v3 = {TYPE_STRING, {.str = "Hello"}};

    printVariant(&v1);
    printVariant(&v2);
    printVariant(&v3);

    return 0;
}
```

### 访问字节表示

```c
#include <stdio.h>

union ByteView {
    int value;
    unsigned char bytes[4];
};

int main() {
    union ByteView bv;
    bv.value = 0x12345678;

    printf("Value: 0x%08X\n", bv.value);
    printf("Bytes: ");
    for (int i = 0; i < 4; i++) {
        printf("%02X ", bv.bytes[i]);
    }
    printf("\n");

    // 判断端序
    if (bv.bytes[0] == 0x78) {
        printf("Little Endian\n");
    } else {
        printf("Big Endian\n");
    }

    return 0;
}
```

### 网络协议解析

```c
#include <stdio.h>
#include <stdint.h>

// IP 头联合体
union IPHeader {
    struct {
        uint8_t version_ihl;
        uint8_t tos;
        uint16_t total_length;
        uint16_t id;
        uint16_t flags_fragment;
        uint8_t ttl;
        uint8_t protocol;
        uint16_t checksum;
        uint32_t src_ip;
        uint32_t dst_ip;
    } fields;
    uint8_t bytes[20];
};

int main() {
    union IPHeader header;

    // 按字段设置
    header.fields.version_ihl = 0x45;
    header.fields.ttl = 64;
    header.fields.protocol = 6;  // TCP

    // 按字节访问
    printf("First byte: 0x%02X\n", header.bytes[0]);

    return 0;
}
```

## 匿名联合体

```c
#include <stdio.h>

struct Packet {
    int type;
    union {  // 匿名联合体
        struct {
            int x;
            int y;
        } point;
        struct {
            int width;
            int height;
        } rect;
    };
};

int main() {
    struct Packet p;
    p.type = 1;

    // 直接访问匿名联合体成员
    p.x = 10;
    p.y = 20;

    printf("Point: (%d, %d)\n", p.x, p.y);

    return 0;
}
```

## 联合体注意事项

```c
#include <stdio.h>

union Data {
    int i;
    float f;
};

int main() {
    union Data data;

    // 写入一个成员
    data.i = 10;

    // 读取另一个成员 - 未定义行为！
    // printf("%f\n", data.f);

    // 正确做法：始终读取最近写入的成员
    printf("%d\n", data.i);

    return 0;
}
```

## 完整示例

### 通用数据类型

```c
#include <stdio.h>
#include <string.h>

typedef enum {
    T_INT,
    T_FLOAT,
    T_BOOL,
    T_CHAR
} Type;

typedef struct {
    Type type;
    union {
        int i;
        float f;
        int bool_val;
        char c;
    } value;
} GenericValue;

void printValue(GenericValue *v) {
    switch (v->type) {
        case T_INT:
            printf("int: %d\n", v->value.i);
            break;
        case T_FLOAT:
            printf("float: %f\n", v->value.f);
            break;
        case T_BOOL:
            printf("bool: %s\n", v->value.bool_val ? "true" : "false");
            break;
        case T_CHAR:
            printf("char: %c\n", v->value.c);
            break;
    }
}

int main() {
    GenericValue values[4] = {
        {T_INT, {.i = 42}},
        {T_FLOAT, {.f = 3.14f}},
        {T_BOOL, {.bool_val = 1}},
        {T_CHAR, {.c = 'A'}}
    };

    for (int i = 0; i < 4; i++) {
        printValue(&values[i]);
    }

    return 0;
}
```

### 浮点数位操作

```c
#include <stdio.h>

typedef union {
    float f;
    struct {
        unsigned int mantissa : 23;
        unsigned int exponent : 8;
        unsigned int sign : 1;
    } parts;
    unsigned int raw;
} FloatBits;

int main() {
    FloatBits fb;
    fb.f = -3.14f;

    printf("Value: %f\n", fb.f);
    printf("Sign: %u\n", fb.parts.sign);
    printf("Exponent: %u\n", fb.parts.exponent);
    printf("Mantissa: %u\n", fb.parts.mantissa);
    printf("Raw: 0x%08X\n", fb.raw);

    return 0;
}
```

## 练习

1. 使用联合体实现端序检测
2. 实现一个支持多种类型的变量容器
3. 使用联合体解析二进制文件格式
4. 实现定点数和浮点数的转换

---

[上一节：结构体](01-struct.md) | [下一节：枚举](03-enum.md)
