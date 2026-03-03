# 1.2 decltype

## decltype 基础

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 10;
    const int cx = 20;
    int& rx = x;

    // 推导类型
    decltype(x) a = x;        // int
    decltype(cx) b = cx;      // const int
    decltype(rx) c = x;       // int&

    // 表达式
    decltype(x + 1) d = x;    // int

    cout << "a = " << a << endl;
    cout << "b = " << b << endl;

    c = 30;  // 修改 x
    cout << "x = " << x << endl;

    return 0;
}
```

## decltype 与 auto 的区别

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> vec = {1, 2, 3};

    // auto 会忽略引用和 const
    auto a = vec[0];          // int（值拷贝）

    // decltype 保留引用
    decltype(vec[0]) b = vec[0];  // int&
    b = 100;                  // 修改 vec[0]

    // decltype 保留表达式类型
    decltype((vec[0])) c = vec[0];  // int&

    cout << "vec[0] = " << vec[0] << endl;

    return 0;
}
```

## 实际应用

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> scores;
    scores["Alice"] = 95;
    scores["Bob"] = 87;

    // 复杂的类型声明
    decltype(scores)::iterator it = scores.begin();

    // 简化长类型名
    using ScoreMap = map<string, int>;
    decltype(ScoreMap::value_type) entry = {"Charlie", 90};

    cout << "First key: " << it->first << endl;
    cout << "Entry: " << entry.first << " = " << entry.second << endl;

    return 0;
}
```

## 泛型编程中的应用

```cpp
#include <iostream>
#include <vector>
using namespace std;

// 返回类型依赖于参数
template <typename T1, typename T2>
auto multiply(T1 a, T2 b) -> decltype(a * b) {
    return a * b;
}

// C++14 可以省略
template <typename T1, typename T2>
auto multiply2(T1 a, T2 b) {
    return a * b;
}

int main() {
    cout << multiply(2, 3) << endl;        // int
    cout << multiply(2, 3.5) << endl;      // double
    cout << multiply(2.5f, 3.0f) << endl;  // float

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

template <typename Container>
auto sum(const Container& c) -> decltype(*c.begin()) {
    using ValueType = decltype(*c.begin());
    ValueType total = ValueType();

    for (const auto& item : c) {
        total += item;
    }

    return total;
}

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};
    cout << "Sum: " << sum(nums) << endl;

    vector<double> doubles = {1.1, 2.2, 3.3};
    cout << "Sum: " << sum(doubles) << endl;

    return 0;
}
```

## 练习

1. 使用 decltype 简化迭代器声明
2. 编写泛型函数返回正确类型
3. 使用 decltype 处理模板

---

[上一节：auto](01-auto.md) | [下一节：智能指针简介](../../cpp11/2-smart-pointers/01-intro.md)
