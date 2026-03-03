# 1.4 枚举类

## 强类型枚举

```cpp
#include <iostream>
using namespace std;

// C++11 枚举类
enum class Color {
    Red,
    Green,
    Blue
};

enum class Status : int {  // 指定底层类型
    OK = 0,
    Error = 1
};

int main() {
    Color c = Color::Red;  // 必须使用作用域

    // 比较
    if (c == Color::Red) {
        cout << "Red" << endl;
    }

    // 转换为 int
    int val = static_cast<int>(c);

    return 0;
}
```

## 练习

1. 定义枚举类表示星期
2. 实现类型安全的状态机

---

[上一节：类型别名](03-type-alias.md) | [下一节：初始化列表](05-initializer-list.md)
