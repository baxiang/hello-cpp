# 1. 代码规范

## 命名规范

```cpp
// 类名 - 大驼峰
class StudentRecord { };

// 函数名 - 小驼峰
void calculateAverage() { }

// 变量名 - 小写，下划线分隔
int student_count;
double average_score;

// 常量 - 全大写
const int MAX_SIZE = 100;

// 私有成员 - 下划线前缀
class MyClass {
private:
    int _value;
};

// 模板参数 - 大写字母
template <typename T, typename U>
class Pair { };
```

## 代码格式化

```cpp
// 括号风格（选择一种保持一致）
// K&R 风格
if (condition) {
    // ...
}

// 函数定义
void function(int a, int b) {
    // ...
}

// 缩进使用 4 个空格或 Tab
class MyClass {
public:
    void method() {
        if (true) {
            // 4 空格缩进
        }
    }
};
```

## 注释规范

```cpp
// 单行注释 - 简洁说明

/*
 * 多行注释
 * 用于较长的说明
 */

// 函数注释 - 说明参数和返回值
/**
 * 计算两个数的和
 * @param a 第一个数
 * @param b 第二个数
 * @return 两数之和
 */
int add(int a, int b);

// TODO 注释 - 标记待办
// TODO: 优化这个算法
```

## 头文件规范

```cpp
// myclass.h
#ifndef MYCLASS_H
#define MYCLASS_H

// 只包含必要的头文件
#include <iostream>

// 前向声明优先
class OtherClass;

class MyClass {
    OtherClass* ptr;  // 只需要指针时用前向声明
};

#endif // MYCLASS_H
```

## 练习

1. 按照规范重构现有代码
2. 为你的代码添加注释
3. 统一代码格式化风格

---

[上一节：目录](README.md) | [下一节：RAII](02-raii.md)
