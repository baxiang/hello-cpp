# 2.1 智能指针简介

## 原始指针的问题

```cpp
#include <iostream>
using namespace std;

class Resource {
public:
    Resource() { cout << "Acquired" << endl; }
    ~Resource() { cout << "Released" << endl; }
};

void leak() {
    Resource* ptr = new Resource();
    // 忘记 delete - 内存泄漏
}

void noLeak() {
    Resource* ptr = new Resource();
    delete ptr;
}

int main() {
    noLeak();
    // leak();  // 会泄漏
    return 0;
}
```

## unique_ptr

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
    // 独占所有权
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

## shared_ptr

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
    // 共享所有权
    shared_ptr<Resource> ptr1 = make_shared<Resource>();
    cout << "use_count: " << ptr1.use_count() << endl;

    {
        shared_ptr<Resource> ptr2 = ptr1;
        cout << "use_count: " << ptr1.use_count() << endl;

        ptr2->use();
    }

    cout << "use_count: " << ptr1.use_count() << endl;
    ptr1->use();

    return 0;
}
```

## weak_ptr

```cpp
#include <iostream>
#include <memory>
using namespace std;

class Resource {
public:
    Resource() { cout << "Acquired" << endl; }
    ~Resource() { cout << "Released" << endl; }
};

int main() {
    shared_ptr<Resource> shared = make_shared<Resource>();
    weak_ptr<Resource> weak = shared;

    cout << "use_count: " << shared.use_count() << endl;

    // 通过 weak_ptr 访问
    if (auto locked = weak.lock()) {
        cout << "Resource is available" << endl;
    }

    shared.reset();
    cout << "After reset, use_count: " << shared.use_count() << endl;

    if (weak.expired()) {
        cout << "Resource has been released" << endl;
    }

    return 0;
}
```

## 循环引用问题

```cpp
#include <iostream>
#include <memory>
using namespace std;

class B;  // 前向声明

class A {
public:
    shared_ptr<B> b;
    ~A() { cout << "A destroyed" << endl; }
};

class B {
public:
    shared_ptr<A> a;
    ~B() { cout << "B destroyed" << endl; }
};

int main() {
    auto a = make_shared<A>();
    auto b = make_shared<B>();

    a->b = b;
    b->a = a;

    // 循环引用导致内存泄漏
    // 使用 weak_ptr 解决
    return 0;
}
```

## 最佳实践

```cpp
#include <iostream>
#include <memory>
#include <vector>
using namespace std;

class Database {
public:
    void query() { cout << "Query executed" << endl; }
};

class Service {
private:
    unique_ptr<Database> db;

public:
    Service() : db(make_unique<Database>()) {}

    void fetchData() {
        db->query();
    }
};

int main() {
    vector<unique_ptr<Service>> services;
    services.push_back(make_unique<Service>());
    services.push_back(make_unique<Service>());

    for (const auto& svc : services) {
        svc->fetchData();
    }

    return 0;
}
```

## 练习

1. 使用 unique_ptr 管理动态数组
2. 使用 shared_ptr 实现观察者模式
3. 使用 weak_ptr 解决循环引用

---

[上一节：decltype](../../cpp11/1-auto/02-decltype.md) | [下一节：右值引用](../../cpp11/3-move/01-rvalue.md)
