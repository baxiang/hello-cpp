# 4.1 Lambda 表达式

## Lambda 基础

```cpp
#include <iostream>
using namespace std;

int main() {
    // 最简单的 lambda
    auto greet = []() {
        cout << "Hello!" << endl;
    };
    greet();

    // 带参数的 lambda
    auto add = [](int a, int b) {
        return a + b;
    };
    cout << "3 + 5 = " << add(3, 5) << endl;

    // 带返回类型的 lambda
    auto multiply = [](int a, int b) -> int {
        return a * b;
    };
    cout << "3 * 5 = " << multiply(3, 5) << endl;

    return 0;
}
```

## 捕获列表

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int factor = 2;
    vector<int> nums = {1, 2, 3, 4, 5};

    // 值捕获
    auto byValue = [factor](int x) {
        return x * factor;
    };

    // 引用捕获
    auto byRef = [&factor](int x) {
        factor = 10;  // 修改外部变量
        return x * factor;
    };

    cout << "factor before: " << factor << endl;
    cout << "byValue(3) = " << byValue(3) << endl;
    cout << "factor after byValue: " << factor << endl;

    cout << "byRef(3) = " << byRef(3) << endl;
    cout << "factor after byRef: " << factor << endl;

    return 0;
}
```

## 捕获方式

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 1, b = 2, c = 3;

    // 捕获所有（值捕获）
    auto f1 = [=]() {
        cout << a << b << c << endl;
    };

    // 捕获所有（引用捕获）
    auto f2 = [&]() {
        a = 10;  // 修改外部变量
    };

    // 混合捕获
    auto f3 = [=, &b]() {
        // a, c 是值捕获，b 是引用捕获
        b = 20;
    };

    // 捕获特定变量
    auto f4 = [a, &b]() {
        // 只捕获 a（值）和 b（引用）
    };

    // C++14 初始化捕获
    auto f5 = [x = a + b]() {
        return x * x;
    };

    cout << "f5() = " << f5() << endl;

    return 0;
}
```

## mutable lambda

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 10;

    // 值捕获，mutable 允许修改副本
    auto f1 = [x]() mutable {
        x++;
        cout << "f1: x = " << x << endl;
    };

    f1();  // x = 11
    f1();  // x = 12

    // 引用捕获，直接修改外部变量
    auto f2 = [&x]() {
        x++;
        cout << "f2: x = " << x << endl;
    };

    f2();  // x = 13
    f2();  // x = 14
    cout << "x = " << x << endl;

    return 0;
}
```

## STL 中的 Lambda

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9, 3};

    // 排序
    sort(nums.begin(), nums.end());

    // 自定义排序（降序）
    sort(nums.begin(), nums.end(),
        [](int a, int b) { return a > b; });

    // find_if
    auto it = find_if(nums.begin(), nums.end(),
        [](int x) { return x % 2 == 0; });
    if (it != nums.end()) {
        cout << "First even: " << *it << endl;
    }

    // for_each
    for_each(nums.begin(), nums.end(),
        [](int x) { cout << x << " "; });
    cout << endl;

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<pair<string, int>> people = {
        {"Alice", 25},
        {"Bob", 30},
        {"Charlie", 25},
        {"David", 35}
    };

    // 按年龄排序
    sort(people.begin(), people.end(),
        [](const auto& a, const auto& b) {
            return a.second < b.second;
        });

    cout << "Sorted by age:" << endl;
    for (const auto& [name, age] : people) {
        cout << name << ": " << age << endl;
    }

    // 查找第一个 30 岁以上的人
    auto it = find_if(people.begin(), people.end(),
        [](const auto& p) { return p.second > 30; });

    if (it != people.end()) {
        cout << "\nFirst over 30: " << it->first << endl;
    }

    // 提取所有名字
    vector<string> names;
    transform(people.begin(), people.end(), back_inserter(names),
        [](const auto& p) { return p.first; });

    cout << "Names: ";
    for (const auto& name : names) {
        cout << name << " ";
    }
    cout << endl;

    return 0;
}
```

## 练习

1. 使用 Lambda 实现自定义排序
2. 使用 Lambda 实现过滤器
3. 使用捕获列表实现计数器

---

[上一节：移动语义](../../cpp11/3-move/02-move.md) | [下一节：多线程](../../cpp11/5-thread/01-basics.md)
