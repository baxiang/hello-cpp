# 1.3 类型别名

## using 别名

```cpp
#include <iostream>
#include <vector>
using namespace std;

// C++11 类型别名
using IntVec = vector<int>;
using StringMap = map<string, int>;

// 模板别名
template <typename T>
using Vec = vector<T>;

int main() {
    IntVec nums = {1, 2, 3};
    Vec<double> doubles = {1.1, 2.2};

    return 0;
}
```

## 练习

1. 使用 using 简化复杂类型名
2. 创建模板别名

---

[上一节：constexpr](02-constexpr.md) | [下一节：枚举类](04-enum-class.md)
