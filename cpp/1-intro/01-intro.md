# 1.1 C++ 简介

## C++ 发展历史

| 年份 | 版本 | 主要特性 |
|------|------|---------|
| 1979 | C with Classes | 类、继承 |
| 1983 | C++ | 虚函数、重载 |
| 1998 | C++98 | STL、模板、异常 |
| 2003 | C++03 | 技术修正 |
| 2011 | C++11 | auto、Lambda、智能指针 |
| 2014 | C++14 | 泛型 Lambda |
| 2017 | C++17 | 结构化绑定、optional |
| 2020 | C++20 | Concepts、Ranges、Modules |

## C++ 与 C 的区别

```cpp
#include <iostream>
using namespace std;

int main() {
    // C++ 使用 iostream 而不是 stdio.h
    cout << "Hello, C++!" << endl;

    // C++ 支持 bool 类型
    bool flag = true;

    // C++ 支持引用
    int x = 10;
    int &ref = x;

    // C++ 支持函数重载
    // C++ 支持面向对象
    // C++ 支持模板
    // C++ 支持异常处理

    return 0;
}
```

## 第一个 C++ 程序

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

### 编译运行

```bash
# 编译
g++ -o hello hello.cpp

# C++11
g++ -std=c++11 -o hello hello.cpp

# C++17
g++ -std=c++17 -o hello hello.cpp

# 运行
./hello
```

## C++ 特点

1. **兼容 C** - 大部分 C 代码可在 C++ 中编译
2. **面向对象** - 类、继承、多态
3. **泛型编程** - 模板
4. **高性能** - 零成本抽象
5. **丰富标准库** - STL、算法、容器

## 基本语法对比

```cpp
// C 风格
#include <stdio.h>
void print_c() {
    printf("Hello from C\n");
}

// C++ 风格
#include <iostream>
void print_cpp() {
    std::cout << "Hello from C++" << std::endl;
}
```

## 练习

1. 安装 C++ 编译器
2. 编写第一个 C++ 程序
3. 尝试不同的编译选项

---

[上一节：string.h](../../c/10-standard-lib/03-string.md) | [下一节：命名空间](02-namespace.md)
