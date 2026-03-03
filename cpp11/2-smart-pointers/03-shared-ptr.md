# 2.3 shared_ptr

## 基础用法

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
    // 创建 shared_ptr
    shared_ptr<Resource> ptr1 = make_shared<Resource>();
    cout << "use_count: " << ptr1.use_count() << endl;

    // 共享所有权
    shared_ptr<Resource> ptr2 = ptr1;
    cout << "use_count: " << ptr1.use_count() << endl;

    ptr2->use();

    // 释放一个引用
    ptr1.reset();
    cout << "After reset, use_count: " << ptr2.use_count() << endl;

    // 最后一个引用释放时删除对象
    ptr2.reset();
    cout << "After reset, ptr2 is "
         << (ptr2 ? "valid" : "null") << endl;

    return 0;
}
```

## weak_ptr 解决循环引用

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
    weak_ptr<A> a;  // 使用 weak_ptr
    ~B() { cout << "B destroyed" << endl; }
};

int main() {
    auto a = make_shared<A>();
    auto b = make_shared<B>();

    a->b = b;
    b->a = a;

    // 可以正常释放
    cout << "Done" << endl;
    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <memory>
#include <vector>
using namespace std;

class Observer {
public:
    virtual void update() = 0;
    virtual ~Observer() = default;
};

class Subject {
private:
    vector<shared_ptr<Observer>> observers;

public:
    void addObserver(shared_ptr<Observer> obs) {
        observers.push_back(obs);
    }

    void notify() {
        for (auto& obs : observers) {
            obs->update();
        }
    }
};

class ConcreteObserver : public Observer {
private:
    string name;

public:
    ConcreteObserver(const string& n) : name(n) {}

    void update() override {
        cout << name << " received notification" << endl;
    }
};

int main() {
    auto subject = make_shared<Subject>();

    auto obs1 = make_shared<ConcreteObserver>("Observer 1");
    auto obs2 = make_shared<ConcreteObserver>("Observer 2");

    subject->addObserver(obs1);
    subject->addObserver(obs2);

    subject->notify();

    return 0;
}
```

## 练习

1. 使用 shared_ptr 实现引用计数
2. 使用 weak_ptr 解决循环引用
3. 实现观察者模式

---

[上一节：unique_ptr](02-unique-ptr.md)
