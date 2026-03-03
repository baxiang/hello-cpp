# 1.1 结构化绑定

## 基础语法

```cpp
#include <iostream>
#include <tuple>
using namespace std;

int main() {
    // 元组结构化绑定
    tuple<int, double, string> t = {1, 3.14, "hello"};

    auto [i, d, s] = t;

    cout << "i = " << i << endl;
    cout << "d = " << d << endl;
    cout << "s = " << s << endl;

    return 0;
}
```

## 结构体绑定

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Person {
    string name;
    int age;
    double height;
};

int main() {
    Person p = {"Alice", 25, 1.65};

    // 结构化绑定
    auto [name, age, height] = p;

    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    cout << "Height: " << height << endl;

    return 0;
}
```

## 引用绑定

```cpp
#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

int main() {
    Point p = {10, 20};

    // 值绑定（拷贝）
    auto [x1, y1] = p;
    x1 = 100;  // 不影响 p

    // 引用绑定
    auto& [x2, y2] = p;
    x2 = 100;  // 影响 p

    cout << "p.x = " << p.x << endl;  // 100

    return 0;
}
```

## 在范围 for 中使用

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> scores = {
        {"Alice", 95},
        {"Bob", 87},
        {"Charlie", 92}
    };

    // C++17 结构化绑定
    for (const auto& [name, score] : scores) {
        cout << name << ": " << score << endl;
    }

    return 0;
}
```

## 函数返回多个值

```cpp
#include <iostream>
#include <tuple>
using namespace std;

// 返回多个值
tuple<int, int, int> getStats() {
    return {10, 20, 30};
}

int main() {
    // 结构化绑定接收
    auto [min, max, avg] = getStats();

    cout << "Min: " << min << endl;
    cout << "Max: " << max << endl;
    cout << "Avg: " << avg << endl;

    return 0;
}
```

## 数组绑定

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[] = {1, 2, 3, 4, 5};

    // 结构化绑定数组
    auto [a, b, c, d, e] = arr;

    cout << "a + e = " << (a + e) << endl;

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <tuple>
using namespace std;

struct Employee {
    string name;
    int id;
    double salary;
};

tuple<string, double> getTopEarner(const vector<Employee>& employees) {
    const Employee* top = &employees[0];
    for (const auto& emp : employees) {
        if (emp.salary > top->salary) {
            top = &emp;
        }
    }
    return {top->name, top->salary};
}

int main() {
    vector<Employee> employees = {
        {"Alice", 1, 80000},
        {"Bob", 2, 90000},
        {"Charlie", 3, 85000}
    };

    // 结构化绑定接收返回值
    auto [name, salary] = getTopEarner(employees);

    cout << "Top earner: " << name
         << " with $" << salary << endl;

    // 遍历 map
    vector<pair<int, string>> idNames = {
        {1, "Alice"},
        {2, "Bob"},
        {3, "Charlie"}
    };

    for (const auto& [id, name] : idNames) {
        cout << "ID " << id << ": " << name << endl;
    }

    return 0;
}
```

## 练习

1. 使用结构化绑定解构元组
2. 在范围 for 中使用结构化绑定
3. 编写返回多个值的函数

---

[上一节：多线程](../../cpp11/5-thread/01-basics.md) | [下一节：optional](../../cpp17/2-optional-variant/01-optional.md)
