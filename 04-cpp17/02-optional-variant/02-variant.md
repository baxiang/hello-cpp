# 2.2 variant

## variant 基础

```cpp
#include <iostream>
#include <variant>
#include <string>
using namespace std;

int main() {
    // variant 可以持有多种类型之一
    variant<int, double, string> v;

    v = 42;
    cout << "v = " << get<int>(v) << endl;

    v = 3.14;
    cout << "v = " << get<double>(v) << endl;

    v = "hello"s;
    cout << "v = " << get<string>(v) << endl;

    // 获取索引
    cout << "index: " << v.index() << endl;

    return 0;
}
```

## visit 访问

```cpp
#include <iostream>
#include <variant>
#include <string>
using namespace std;

int main() {
    variant<int, double, string> v = 42;

    // 使用 visit 访问
    visit([](const auto& value) {
        cout << "Value: " << value << endl;
    }, v);

    // 返回值的 visit
    auto result = visit([](const auto& value) -> double {
        return static_cast<double>(value) * 2;
    }, v);

    cout << "Result: " << result << endl;

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <variant>
#include <vector>
#include <string>
using namespace std;

// 定义可以存储的类型
using Value = variant<int, double, string, bool>;

void printValue(const Value& v) {
    visit([](const auto& val) {
        cout << val << " (type: "
             << typeid(val).name() << ")" << endl;
    }, v);
}

int main() {
    vector<Value> values = {42, 3.14, "hello"s, true, false};

    for (const auto& v : values) {
        printValue(v);
    }

    return 0;
}
```

## any

```cpp
#include <iostream>
#include <any>
#include <string>
using namespace std;

int main() {
    any a = 42;
    cout << "a = " << any_cast<int>(a) << endl;

    a = 3.14;
    cout << "a = " << any_cast<double>(a) << endl;

    a = "hello"s;
    cout << "a = " << any_cast<string>(a) << endl;

    // 类型检查
    if (a.type() == typeid(string)) {
        cout << "a is a string" << endl;
    }

    // 安全转换
    try {
        int x = any_cast<int>(a);  // 会抛出异常
    } catch (const bad_any_cast& e) {
        cout << "Bad cast: " << e.what() << endl;
    }

    return 0;
}
```

## 练习

1. 使用 variant 实现多类型容器
2. 使用 visit 实现序列化
3. 比较 variant 和 any 的使用场景

---

[上一节：optional](01-optional.md) | [下一节：文件系统](../../cpp17/3-filesystem/01-basics.md)
