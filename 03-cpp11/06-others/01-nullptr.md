# 1.1 nullptr

## nullptr 的引入

```cpp
#include <iostream>
using namespace std;

int main() {
    // C++11 之前使用 NULL（通常是 0）
    // int* ptr = NULL;  // 实际是 int* ptr = 0;

    // C++11 引入 nullptr
    int* ptr = nullptr;

    if (ptr == nullptr) {
        cout << "ptr is null" << endl;
    }

    // 类型安全
    void func(int x) { cout << "int: " << x << endl; }
    void func(char* p) { cout << "pointer" << endl; }

    func(nullptr);      // 调用指针版本
    // func(0);         // 调用 int 版本（可能不是你想要的）

    return 0;
}
```

## 练习

1. 使用 nullptr 替换代码中的 NULL
2. 理解 nullptr 的类型安全性

---

[上一节：智能指针](../2-smart-pointers/03-shared-ptr.md) | [下一节：constexpr](02-constexpr.md)
