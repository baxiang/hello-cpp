# 1.2 constexpr

## 常量表达式

```cpp
#include <iostream>
using namespace std;

// constexpr 函数 - 可在编译时计算
constexpr int square(int x) {
    return x * x;
}

int main() {
    // 编译时计算
    constexpr int val = square(5);  // 25

    // 运行时也可用
    int x = 5;
    int result = square(x);

    cout << "val = " << val << endl;
    cout << "result = " << result << endl;

    return 0;
}
```

## 练习

1. 编写 constexpr 函数计算阶乘
2. 使用 constexpr 定义编译时常量

---

[上一节：nullptr](01-nullptr.md) | [下一节：类型别名](03-type-alias.md)
