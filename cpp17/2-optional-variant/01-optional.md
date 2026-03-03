# 2.1 optional

## optional 基础

```cpp
#include <iostream>
#include <optional>
using namespace std;

int main() {
    // 创建 optional
    optional<int> opt1 = 42;
    optional<int> opt2 = nullopt;
    optional<int> opt3;  // 空

    // 检查是否有值
    if (opt1) {
        cout << "opt1 has value: " << *opt1 << endl;
    }

    if (!opt2) {
        cout << "opt2 is empty" << endl;
    }

    // 访问值
    cout << "Value: " << opt1.value() << endl;

    // 带默认值
    cout << "Value or default: " << opt2.value_or(0) << endl;

    return 0;
}
```

## 函数返回 optional

```cpp
#include <iostream>
#include <optional>
#include <vector>
using namespace std;

// 可能失败的函数
optional<int> findFirstEven(const vector<int>& nums) {
    for (int n : nums) {
        if (n % 2 == 0) {
            return n;
        }
    }
    return nullopt;
}

optional<double> safeDivide(double a, double b) {
    if (b == 0) {
        return nullopt;
    }
    return a / b;
}

int main() {
    vector<int> nums1 = {1, 3, 5, 7};
    vector<int> nums2 = {1, 2, 3, 4};

    auto result1 = findFirstEven(nums1);
    if (result1) {
        cout << "Found even: " << *result1 << endl;
    } else {
        cout << "No even number found" << endl;
    }

    auto result2 = findFirstEven(nums2);
    if (result2) {
        cout << "Found even: " << *result2 << endl;
    }

    // 安全除法
    auto divResult = safeDivide(10, 0);
    if (divResult) {
        cout << "Result: " << *divResult << endl;
    } else {
        cout << "Division by zero!" << endl;
    }

    return 0;
}
```

## 实战示例

```cpp
#include <iostream>
#include <optional>
#include <string>
#include <map>
using namespace std;

class Database {
private:
    map<string, string> data;

public:
    optional<string> get(const string& key) {
        auto it = data.find(key);
        if (it != data.end()) {
            return it->second;
        }
        return nullopt;
    }

    void set(const string& key, const string& value) {
        data[key] = value;
    }
};

int main() {
    Database db;
    db.set("username", "alice");
    db.set("email", "alice@example.com");

    // 使用 optional
    if (auto username = db.get("username")) {
        cout << "Username: " << *username << endl;
    }

    if (auto phone = db.get("phone")) {
        cout << "Phone: " << *phone << endl;
    } else {
        cout << "Phone not found" << endl;
    }

    return 0;
}
```

## 练习

1. 实现返回 optional 的查找函数
2. 使用 optional 处理配置项
3. 实现可选链式调用

---

[上一节：结构化绑定](../../cpp17/1-structured-bindings/01-basics.md) | [下一节：variant](02-variant.md)
