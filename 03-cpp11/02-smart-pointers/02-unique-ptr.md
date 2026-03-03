# 2.2 unique_ptr

```cpp
#include <iostream>
#include <memory>
using namespace std;

class Resource {
public:
    Resource() { cout << "Acquired" << endl; }
    ~Resource() { cout << "Released" << endl; }
    void use() { cout << "Using resource" << endl; }
};

int main() {
    // 创建 unique_ptr
    unique_ptr<Resource> ptr1 = make_unique<Resource>();
    ptr1->use();

    // 不能拷贝
    // unique_ptr<Resource> ptr2 = ptr1;  // 错误

    // 可以移动
    unique_ptr<Resource> ptr2 = move(ptr1);
    // ptr1 现在为空

    if (ptr2) {
        ptr2->use();
    }

    // 自动释放
    return 0;
}
```

## 数组支持

```cpp
#include <iostream>
#include <memory>
using namespace std;

int main() {
    // C++14 支持数组
    unique_ptr<int[]> arr = make_unique<int[]>(10);

    for (int i = 0; i < 10; i++) {
        arr[i] = i;
    }

    cout << "arr[5] = " << arr[5] << endl;

    // 自动 delete[]
    return 0;
}
```

## 自定义删除器

```cpp
#include <iostream>
#include <memory>
using namespace std;

// 自定义删除器
struct Deleter {
    void operator()(int* p) const {
        cout << "Custom delete: " << *p << endl;
        delete p;
    }
};

int main() {
    unique_ptr<int, Deleter> ptr(new int(42), Deleter());
    cout << "Value: " << *ptr << endl;
    return 0;
}
```

## 练习

1. 使用 unique_ptr 管理动态数组
2. 实现自定义删除器
3. 使用 unique_ptr 实现工厂模式

---

[上一节：智能指针简介](01-intro.md) | [下一节：shared_ptr](03-shared-ptr.md)
