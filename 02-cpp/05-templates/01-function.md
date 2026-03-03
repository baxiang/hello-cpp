# 5.1 函数模板

## 模板基础

```cpp
#include <iostream>
using namespace std;

// 函数模板
template <typename T>
T add(T a, T b) {
    return a + b;
}

int main() {
    // 自动类型推导
    cout << add(1, 2) << endl;        // int
    cout << add(1.5, 2.5) << endl;    // double
    cout << add(1.0f, 2.0f) << endl;  // float

    // 显式指定类型
    cout << add<int>(1, 2) << endl;
    cout << add<double>(1.5, 2.5) << endl;

    return 0;
}
```

## 多个模板参数

```cpp
#include <iostream>
using namespace std;

template <typename T1, typename T2>
auto multiply(T1 a, T2 b) {
    return a * b;
}

int main() {
    cout << multiply(2, 3) << endl;        // int * int
    cout << multiply(2, 3.5) << endl;      // int * double
    cout << multiply(2.5f, 3.0f) << endl;  // float * float

    return 0;
}
```

## 模板特化

```cpp
#include <iostream>
#include <cstring>
using namespace std;

// 通用模板
template <typename T>
T maxValue(T a, T b) {
    cout << "Generic version" << endl;
    return (a > b) ? a : b;
}

// 特化版本
template <>
const char* maxValue<const char*>(const char* a, const char* b) {
    cout << "Specialized version for const char*" << endl;
    return (strcmp(a, b) > 0) ? a : b;
}

int main() {
    cout << maxValue(10, 20) << endl;
    cout << maxValue(3.14, 2.71) << endl;
    cout << maxValue("apple", "banana") << endl;

    return 0;
}
```

## 非类型模板参数

```cpp
#include <iostream>
using namespace std;

template <typename T, int N>
T sumArray(T (&arr)[N]) {
    T sum = 0;
    for (int i = 0; i < N; i++) {
        sum += arr[i];
    }
    return sum;
}

int main() {
    int ints[] = {1, 2, 3, 4, 5};
    double doubles[] = {1.1, 2.2, 3.3};

    cout << "Int sum: " << sumArray(ints) << endl;
    cout << "Double sum: " << sumArray(doubles) << endl;

    return 0;
}
```

## 可变参数模板

```cpp
#include <iostream>
using namespace std;

// 基础情况
void print() {
    cout << endl;
}

// 递归情况
template <typename T, typename... Args>
void print(T first, Args... rest) {
    cout << first << " ";
    print(rest...);
}

int main() {
    print(1);
    print(1, 2.0, "three");
    print('a', "hello", 100, 3.14);

    return 0;
}
```

## 折叠表达式（C++17）

```cpp
#include <iostream>
using namespace std;

// C++17 折叠表达式
template <typename... Args>
auto sum(Args... args) {
    return (... + args);  // 一元右折叠
}

template <typename... Args>
bool allTrue(Args... args) {
    return (... && args);
}

int main() {
    cout << sum(1, 2, 3, 4, 5) << endl;      // 15
    cout << sum(1.0, 2.0, 3.0) << endl;      // 6.0

    cout << boolalpha;
    cout << allTrue(true, true, true) << endl;   // true
    cout << allTrue(true, false, true) << endl;  // false

    return 0;
}
```

## SFINAE 和 enable_if

```cpp
#include <iostream>
#include <type_traits>
using namespace std;

// 只对整数类型启用
template <typename T>
typename enable_if<is_integral<T>::value, T>::type
doubleValue(T value) {
    return value * 2;
}

// 只对浮点类型启用
template <typename T>
typename enable_if<is_floating_point<T>::value, T>::type
doubleValue(T value) {
    return value * 2.0;
}

int main() {
    cout << doubleValue(10) << endl;      // int
    cout << doubleValue(3.14) << endl;    // double
    // cout << doubleValue("hello");  // 编译错误

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// 通用打印函数
template <typename T>
void printVector(const vector<T>& vec) {
    cout << "[ ";
    for (const auto& item : vec) {
        cout << item << " ";
    }
    cout << "]" << endl;
}

// 查找函数
template <typename T>
int findIndex(const T arr[], int size, const T& target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

// 交换函数
template <typename T>
void swapValues(T& a, T& b) {
    T temp = a;
    a = b;
    b = temp;
}

int main() {
    // 打印向量
    vector<int> nums = {1, 2, 3, 4, 5};
    vector<string> names = {"Alice", "Bob", "Charlie"};

    printVector(nums);
    printVector(names);

    // 查找
    int arr[] = {10, 20, 30, 40, 50};
    cout << "Index of 30: " << findIndex(arr, 5, 30) << endl;

    // 交换
    int x = 10, y = 20;
    swapValues(x, y);
    cout << "x = " << x << ", y = " << y << endl;

    return 0;
}
```

## 练习

1. 实现通用排序函数
2. 实现泛型栈数据结构
3. 实现泛型链表
4. 实现通用的 min/max 函数

---

[上一节：抽象类](../../cpp/4-polymorphism/02-abstract.md) | [下一节：类模板](02-class.md)
