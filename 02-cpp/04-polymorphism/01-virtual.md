# 4.1 虚函数

## 虚函数基础

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    void show() {
        cout << "Base show" << endl;
    }
};

class Derived : public Base {
public:
    void show() {
        cout << "Derived show" << endl;
    }
};

int main() {
    Derived d;
    Base* ptr = &d;

    // 非虚函数 - 静态绑定
    ptr->show();  // 输出：Base show

    return 0;
}
```

## 使用虚函数

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    virtual void show() {
        cout << "Base show" << endl;
    }
};

class Derived : public Base {
public:
    void show() override {
        cout << "Derived show" << endl;
    }
};

int main() {
    Derived d;
    Base* ptr = &d;

    // 虚函数 - 动态绑定
    ptr->show();  // 输出：Derived show

    return 0;
}
```

## 多态示例

```cpp
#include <iostream>
#include <vector>
using namespace std;

class Shape {
public:
    virtual double area() const {
        return 0;
    }

    virtual void describe() const {
        cout << "A shape" << endl;
    }

    virtual ~Shape() = default;
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}

    double area() const override {
        return 3.14159 * radius * radius;
    }

    void describe() const override {
        cout << "A circle" << endl;
    }
};

class Rectangle : public Shape {
private:
    double width, height;

public:
    Rectangle(double w, double h)
        : width(w), height(h) {}

    double area() const override {
        return width * height;
    }

    void describe() const override {
        cout << "A rectangle" << endl;
    }
};

int main() {
    vector<Shape*> shapes;
    shapes.push_back(new Circle(5));
    shapes.push_back(new Rectangle(4, 6));

    for (const auto& shape : shapes) {
        shape->describe();
        cout << "Area: " << shape->area() << endl;
    }

    // 清理
    for (auto& shape : shapes) {
        delete shape;
    }

    return 0;
}
```

## 虚函数表

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    virtual void func1() {
        cout << "Base::func1" << endl;
    }

    virtual void func2() {
        cout << "Base::func2" << endl;
    }
};

class Derived : public Base {
public:
    void func1() override {
        cout << "Derived::func1" << endl;
    }

    void func3() {
        cout << "Derived::func3" << endl;
    }
};

int main() {
    Base* ptr = new Derived();

    ptr->func1();  // Derived::func1
    ptr->func2();  // Base::func2
    // ptr->func3();  // 错误

    delete ptr;
    return 0;
}
```

## override 和 final

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    virtual void func1() {}
    virtual void func2() final {}
};

class Derived : public Base {
public:
    void func1() override {}  // OK

    // void func2() override {}  // 错误！final 禁止重写
};

// class FinalClass final : public Base {};
// class AlsoDerived : public FinalClass {};  // 错误！final 类不能继承
```

## 虚析构函数

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    virtual ~Base() {
        cout << "Base destructor" << endl;
    }
};

class Derived : public Base {
private:
    int* data;

public:
    Derived() {
        data = new int[100];
        cout << "Derived constructor" << endl;
    }

    ~Derived() override {
        cout << "Derived destructor" << endl;
        delete[] data;
    }
};

int main() {
    Base* ptr = new Derived();
    delete ptr;  // 正确调用派生类析构函数
    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// 员工基类
class Employee {
protected:
    string name;
    int id;
    double salary;

public:
    Employee(const string& n, int i, double s)
        : name(n), id(i), salary(s) {}

    virtual double calculateBonus() const {
        return salary * 0.1;  // 10% 基础奖金
    }

    virtual void printInfo() const {
        cout << "Employee: " << name
             << ", ID: " << id
             << ", Salary: $" << salary << endl;
    }

    virtual ~Employee() = default;
};

// 经理类
class Manager : public Employee {
private:
    int teamSize;

public:
    Manager(const string& n, int i, double s, int size)
        : Employee(n, i, s), teamSize(size) {}

    double calculateBonus() const override {
        return salary * 0.2 + teamSize * 1000;  // 20% + 团队奖金
    }

    void printInfo() const override {
        cout << "Manager: " << name
             << ", Team size: " << teamSize << endl;
    }
};

// 工程师类
class Engineer : public Employee {
private:
    string specialty;

public:
    Engineer(const string& n, int i, double s, const string& spec)
        : Employee(n, i, s), specialty(spec) {}

    double calculateBonus() const override {
        return salary * 0.15 + 5000;  // 15% + 技术奖金
    }

    void printInfo() const override {
        cout << "Engineer: " << name
             << ", Specialty: " << specialty << endl;
    }
};

int main() {
    vector<Employee*> staff;

    staff.push_back(new Manager("Alice", 1, 80000, 5));
    staff.push_back(new Engineer("Bob", 2, 70000, "Backend"));
    staff.push_back(new Engineer("Charlie", 3, 75000, "Frontend"));

    for (const auto& emp : staff) {
        emp->printInfo();
        cout << "Bonus: $" << emp->calculateBonus() << endl;
        cout << "---" << endl;
    }

    // 清理
    for (auto& emp : staff) {
        delete emp;
    }

    return 0;
}
```

## 练习

1. 实现支付系统（基类 Payment，派生类 CreditCard、PayPal、Crypto）
2. 创建通知系统（邮件、短信、推送）
3. 实现文件系统抽象
4. 设计游戏角色系统

---

[上一节：多重继承](../../cpp/3-inheritance/02-multiple.md) | [下一节：抽象类](02-abstract.md)
