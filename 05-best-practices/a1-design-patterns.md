# 附录 1. 设计模式

## 单例模式

```cpp
#include <iostream>
using namespace std;

class Singleton {
private:
    Singleton() = default;
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

public:
    static Singleton& getInstance() {
        static Singleton instance;
        return instance;
    }

    void doSomething() {
        cout << "Doing something" << endl;
    }
};

int main() {
    Singleton::getInstance().doSomething();
    return 0;
}
```

## 工厂模式

```cpp
#include <iostream>
#include <memory>
#include <map>
using namespace std;

// 产品基类
class Product {
public:
    virtual void use() = 0;
    virtual ~Product() = default;
};

// 具体产品
class ConcreteProductA : public Product {
public:
    void use() override { cout << "Using Product A" << endl; }
};

class ConcreteProductB : public Product {
public:
    void use() override { cout << "Using Product B" << endl; }
};

// 工厂
class Factory {
public:
    enum class Type { A, B };

    static unique_ptr<Product> create(Type type) {
        switch (type) {
            case Type::A: return make_unique<ConcreteProductA>();
            case Type::B: return make_unique<ConcreteProductB>();
            default: return nullptr;
        }
    }
};

int main() {
    auto p1 = Factory::create(Factory::Type::A);
    p1->use();

    auto p2 = Factory::create(Factory::Type::B);
    p2->use();

    return 0;
}
```

## 观察者模式

```cpp
#include <iostream>
#include <vector>
#include <memory>
using namespace std;

// 观察者接口
class Observer {
public:
    virtual void update(int value) = 0;
    virtual ~Observer() = default;
};

// 主题类
class Subject {
private:
    vector<shared_ptr<Observer>> observers;
    int value = 0;

public:
    void attach(shared_ptr<Observer> obs) {
        observers.push_back(obs);
    }

    void setValue(int v) {
        value = v;
        notify();
    }

    void notify() {
        for (auto& obs : observers) {
            obs->update(value);
        }
    }
};

// 具体观察者
class ConcreteObserver : public Observer {
private:
    string name;

public:
    ConcreteObserver(const string& n) : name(n) {}

    void update(int value) override {
        cout << name << " received: " << value << endl;
    }
};

int main() {
    Subject subject;
    subject.attach(make_shared<ConcreteObserver>("Observer 1"));
    subject.attach(make_shared<ConcreteObserver>("Observer 2"));

    subject.setValue(100);

    return 0;
}
```

## 练习

1. 实现线程安全的单例
2. 扩展工厂模式支持注册机制
3. 实现发布者 - 订阅者模式

---

[上一节：常见陷阱](05-pitfalls.md) | [下一节：编译工具链](a2-toolchain.md)
