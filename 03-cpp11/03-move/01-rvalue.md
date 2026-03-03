# 3.1 右值引用

## 左值和右值

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 10;      // x 是左值
    int y = x + 1;   // x + 1 是右值

    // 左值：有名字，可取地址
    cout << "&x = " << &x << endl;

    // 右值：临时值，不能取地址
    // int* ptr = &(x + 1);  // 错误

    // 左值引用
    int& lref = x;      // OK

    // 右值引用
    int&& rref = 20;    // OK
    int&& rref2 = x + 1; // OK

    return 0;
}
```

## 右值引用基础

```cpp
#include <iostream>
using namespace std;

void process(int& x) {
    cout << "Lvalue reference: " << x << endl;
}

void process(int&& x) {
    cout << "Rvalue reference: " << x << endl;
}

int main() {
    int a = 10;
    process(a);       // 调用左值版本
    process(20);      // 调用右值版本
    process(a + 1);   // 调用右值版本

    return 0;
}
```

## std::move

```cpp
#include <iostream>
#include <utility>
using namespace std;

void func(int& x) {
    cout << "Lvalue: " << x << endl;
}

void func(int&& x) {
    cout << "Rvalue: " << x << endl;
}

int main() {
    int a = 10;

    func(a);              // Lvalue
    func(move(a));        // Rvalue

    // move 后 a 处于有效但未定义状态
    cout << "a = " << a << endl;

    return 0;
}
```

## 完美转发

```cpp
#include <iostream>
#include <utility>
using namespace std;

void target(int& x) {
    cout << "target(int&) called" << endl;
}

void target(int&& x) {
    cout << "target(int&&) called" << endl;
}

void target(const int& x) {
    cout << "target(const int&) called" << endl;
}

template <typename T>
void wrapper(T&& arg) {
    // 使用 forward 保持值类别
    target(forward<T>(arg));
}

int main() {
    int x = 10;
    const int cx = 20;

    wrapper(x);           // 左值
    wrapper(cx);          // const 左值
    wrapper(30);          // 右值
    wrapper(move(x));     // 右值

    return 0;
}
```

## 练习

1. 区分左值和右值
2. 使用 move 转移所有权
3. 使用 forward 实现完美转发

---

[上一节：智能指针](../../cpp11/2-smart-pointers/01-intro.md) | [下一节：移动语义](02-move.md)
