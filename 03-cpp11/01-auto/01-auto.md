# 1.1 auto 类型推导

## auto 基础

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // 基本用法
    auto i = 42;          // int
    auto d = 3.14;        // double
    auto s = "hello";     // const char*
    auto c = 'A';         // char

    // 与引用
    int x = 10;
    auto& ref = x;        // int&
    ref = 20;             // x 现在是 20

    // const
    const auto ci = 100;  // const int
    // ci = 200;          // 错误

    // 指针
    auto ptr = &x;        // int*

    cout << "i = " << i << endl;
    cout << "x = " << x << endl;

    return 0;
}
```

## 在循环中使用

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};

    // 值拷贝
    for (auto n : nums) {
        n *= 2;  // 不影响原值
    }

    // 引用
    for (auto& n : nums) {
        n *= 2;  // 修改原值
    }

    // const 引用（只读）
    for (const auto& n : nums) {
        cout << n << " ";
    }
    cout << endl;

    return 0;
}
```

## 函数返回类型

```cpp
#include <iostream>
using namespace std;

// 尾置返回类型（C++11）
auto add(int a, int b) -> int {
    return a + b;
}

// C++14 可以省略尾置返回
auto multiply(int a, int b) {
    return a * b;
}

int main() {
    cout << add(3, 5) << endl;
    cout << multiply(3, 5) << endl;

    return 0;
}
```

## Lambda 表达式中的 auto

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};

    // C++14 起 Lambda 参数可用 auto
    auto print = [](const auto& n) {
        cout << n << " ";
    };

    for_each(nums.begin(), nums.end(), print);
    cout << endl;

    return 0;
}
```

## 注意事项

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // 不能用于需要明确类型的场景
    // auto x;           // 错误！没有初始化
    // auto arr[] = {1, 2, 3};  // 错误！

    // 推导规则
    vector<int> vec = {1, 2, 3};

    auto a = vec;           // vector<int>
    auto b = vec[0];        // int
    auto& c = vec[0];       // int&
    const auto d = vec[0];  // const int

    // 数组退化为指针
    int arr[] = {1, 2, 3};
    auto e = arr;           // int*

    cout << "sizeof(vec) = " << sizeof(vec) << endl;
    cout << "sizeof(e) = " << sizeof(e) << endl;

    return 0;
}
```

## 练习

1. 使用 auto 简化范围 for 循环
2. 使用 auto 声明迭代器
3. 编写返回 auto 的函数

---

[上一节：异常处理](../../cpp/7-exceptions/01-basics.md) | [下一节：decltype](02-decltype.md)
