# 1.5 初始化列表

## std::initializer_list

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // 统一初始化语法
    int x{5};
    vector<int> nums{1, 2, 3, 4, 5};

    // 初始化列表参数
    auto list = {1, 2, 3, 4, 5};

    for (int n : list) {
        cout << n << " ";
    }
    cout << endl;

    return 0;
}
```

## 自定义类支持

```cpp
#include <iostream>
#include <initializer_list>
using namespace std;

class MyVector {
private:
    int* data;
    size_t size;

public:
    MyVector(initializer_list<int> init)
        : size(init.size()) {
        data = new int[size];
        copy(init.begin(), init.end(), data);
    }

    ~MyVector() { delete[] data; }

    size_t getSize() const { return size; }
    int get(size_t i) const { return data[i]; }
};

int main() {
    MyVector v{1, 2, 3, 4, 5};
    cout << "Size: " << v.getSize() << endl;

    return 0;
}
```

## 练习

1. 使用初始化列表简化代码
2. 为自定义类添加初始化列表支持

---

[上一节：枚举类](04-enum-class.md)
