# 3.1 继承基础

## 继承语法

```cpp
#include <iostream>
using namespace std;

// 基类
class Animal {
protected:
    string name;
    int age;

public:
    Animal(const string& n, int a) : name(n), age(a) {
        cout << "Animal constructor" << endl;
    }

    void eat() {
        cout << name << " is eating" << endl;
    }

    void sleep() {
        cout << name << " is sleeping" << endl;
    }
};

// 派生类
class Dog : public Animal {
public:
    Dog(const string& n, int a) : Animal(n, a) {
        cout << "Dog constructor" << endl;
    }

    void bark() {
        cout << name << " is barking: Woof!" << endl;
    }
};

int main() {
    Dog dog("Buddy", 3);

    // 使用基类方法
    dog.eat();
    dog.sleep();

    // 使用派生类方法
    dog.bark();

    return 0;
}
```

## 访问控制

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    int publicVar;
protected:
    int protectedVar;
private:
    int privateVar;
};

// 公有继承
class PublicDerived : public Base {
    // publicVar 可访问
    // protectedVar 可访问
    // privateVar 不可访问
};

// 保护继承
class ProtectedDerived : protected Base {
    // publicVar 变为 protected
    // protectedVar 保持 protected
    // privateVar 不可访问
};

// 私有继承
class PrivateDerived : private Base {
    // publicVar 变为 private
    // protectedVar 变为 private
    // privateVar 不可访问
};

int main() {
    PublicDerived pub;
    pub.publicVar = 10;  // OK

    // pub.protectedVar = 20;  // 错误

    return 0;
}
```

## 构造和析构顺序

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    Base() { cout << "Base constructor" << endl; }
    ~Base() { cout << "Base destructor" << endl; }
};

class Derived : public Base {
public:
    Derived() { cout << "Derived constructor" << endl; }
    ~Derived() { cout << "Derived destructor" << endl; }
};

int main() {
    Derived d;
    return 0;
}
```

输出：
```
Base constructor
Derived constructor
Derived destructor
Base destructor
```

## 初始化基类

```cpp
#include <iostream>
using namespace std;

class Person {
protected:
    string name;
    int age;

public:
    Person(const string& n, int a) : name(n), age(a) {
        cout << "Person constructor" << endl;
    }
};

class Student : public Person {
private:
    string major;
    double gpa;

public:
    Student(const string& n, int a, const string& m, double g)
        : Person(n, a), major(m), gpa(g) {
        cout << "Student constructor" << endl;
    }

    void display() const {
        cout << name << ", " << age
             << ", Major: " << major
             << ", GPA: " << gpa << endl;
    }
};

int main() {
    Student s("Alice", 20, "CS", 3.8);
    s.display();

    return 0;
}
```

## 继承与组合

```cpp
#include <iostream>
using namespace std;

class Engine {
public:
    void start() { cout << "Engine started" << endl; }
    void stop() { cout << "Engine stopped" << endl; }
};

class Car {
private:
    Engine engine;  // 组合
    string model;

public:
    Car(const string& m) : model(m) {}

    void drive() {
        engine.start();
        cout << "Driving " << model << endl;
        engine.stop();
    }
};

int main() {
    Car car("Tesla");
    car.drive();
    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <string>
using namespace std;

// 基类
class Shape {
protected:
    string color;

public:
    Shape(const string& c) : color(c) {}

    virtual double area() const = 0;

    void setColor(const string& c) { color = c; }
    string getColor() const { return color; }

    void describe() const {
        cout << "A " << color << " shape" << endl;
    }
};

// 派生类 1
class Circle : public Shape {
private:
    double radius;

public:
    Circle(const string& c, double r)
        : Shape(c), radius(r) {}

    double area() const override {
        return 3.14159 * radius * radius;
    }
};

// 派生类 2
class Rectangle : public Shape {
private:
    double width, height;

public:
    Rectangle(const string& c, double w, double h)
        : Shape(c), width(w), height(h) {}

    double area() const override {
        return width * height;
    }
};

int main() {
    Circle circle("Red", 5);
    Rectangle rect("Blue", 4, 6);

    cout << "Circle area: " << circle.area() << endl;
    cout << "Rectangle area: " << rect.area() << endl;

    return 0;
}
```

## 练习

1. 创建动物继承体系
2. 实现图形类继承层次
3. 设计员工管理系统（基类 Employee，派生类 Manager、Developer）
4. 实现车辆继承体系

---

[上一节：运算符重载](../../cpp/2-classes/03-operator.md) | [下一节：多重继承](02-multiple.md)
