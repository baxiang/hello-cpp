# 3.2 多重继承

## 多重继承基础

```cpp
#include <iostream>
using namespace std;

class A {
protected:
    int a;
public:
    A(int v = 0) : a(v) {}
    void showA() { cout << "A: " << a << endl; }
};

class B {
protected:
    int b;
public:
    B(int v = 0) : b(v) {}
    void showB() { cout << "B: " << b << endl; }
};

// 多重继承
class C : public A, public B {
private:
    int c;
public:
    C(int va, int vb, int vc) : A(va), B(vb), c(vc) {}

    void showC() {
        showA();
        showB();
        cout << "C: " << c << endl;
    }
};

int main() {
    C obj(10, 20, 30);
    obj.showC();

    return 0;
}
```

## 菱形继承问题

```cpp
#include <iostream>
using namespace std;

class Base {
protected:
    int value;
public:
    Base(int v = 0) : value(v) {
        cout << "Base constructor" << endl;
    }
};

// 非虚继承 - 问题
class Left : public Base {
public:
    Left(int v) : Base(v) {
        cout << "Left constructor" << endl;
    }
};

class Right : public Base {
public:
    Right(int v) : Base(v) {
        cout << "Right constructor" << endl;
    }
};

class Derived : public Left, public Right {
public:
    Derived(int v) : Left(v), Right(v) {
        cout << "Derived constructor" << endl;
    }

    void show() {
        // cout << value << endl;  // 错误！歧义
        cout << "Left::value = " << Left::value << endl;
        cout << "Right::value = " << Right::value << endl;
    }
};

int main() {
    Derived d(100);
    d.show();
    return 0;
}
```

## 虚继承解决菱形问题

```cpp
#include <iostream>
using namespace std;

class Base {
protected:
    int value;
public:
    Base(int v = 0) : value(v) {
        cout << "Base constructor" << endl;
    }
};

// 虚继承
class Left : virtual public Base {
public:
    Left(int v) : Base(v) {
        cout << "Left constructor" << endl;
    }
};

class Right : virtual public Base {
public:
    Right(int v) : Base(v) {
        cout << "Right constructor" << endl;
    }
};

class Derived : public Left, public Right {
public:
    Derived(int v) : Base(v), Left(v), Right(v) {
        cout << "Derived constructor" << endl;
    }

    void show() {
        cout << "value = " << value << endl;  // OK，无歧义
    }
};

int main() {
    Derived d(100);
    d.show();
    return 0;
}
```

## 构造顺序

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    Base() { cout << "Base" << endl; }
};

class Left : virtual public Base {
public:
    Left() { cout << "Left" << endl; }
};

class Right : virtual public Base {
public:
    Right() { cout << "Right" << endl; }
};

// 虚基类最先构造，然后按声明顺序
class Derived : public Left, public Right {
public:
    Derived() { cout << "Derived" << endl; }
};

int main() {
    Derived d;
    // 输出：
    // Base
    // Left
    // Right
    // Derived
    return 0;
}
```

## 接口类（纯抽象类）

```cpp
#include <iostream>
#include <string>
using namespace std;

// 接口类
class IPrintable {
public:
    virtual void print() const = 0;
    virtual ~IPrintable() = default;
};

class ISortable {
public:
    virtual int compare(const ISortable& other) const = 0;
    virtual ~ISortable() = default;
};

// 实现多个接口
class Person : public IPrintable, public ISortable {
private:
    string name;
    int age;

public:
    Person(const string& n, int a) : name(n), age(a) {}

    void print() const override {
        cout << "Person: " << name
             << ", Age: " << age << endl;
    }

    int compare(const ISortable& other) const override {
        const Person& p = dynamic_cast<const Person&>(other);
        return age - p.age;
    }
};

int main() {
    Person p1("Alice", 25);
    Person p2("Bob", 30);

    p1.print();
    p2.print();

    cout << "Age diff: " << p1.compare(p2) << endl;

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// 可绘制接口
class IDrawable {
public:
    virtual void draw() const = 0;
    virtual ~IDrawable() = default;
};

// 可移动接口
class IMovable {
public:
    virtual void move(int x, int y) = 0;
    virtual void getPosition(int& x, int& y) const = 0;
    virtual ~IMovable() = default;
};

// 实现两个接口
class Sprite : public IDrawable, public IMovable {
private:
    string image;
    int posX, posY;

public:
    Sprite(const string& img)
        : image(img), posX(0), posY(0) {}

    void draw() const override {
        cout << "Drawing '" << image
             << "' at (" << posX << ", " << posY << ")" << endl;
    }

    void move(int x, int y) override {
        posX = x;
        posY = y;
        cout << "Moved to (" << x << ", " << y << ")" << endl;
    }

    void getPosition(int& x, int& y) const override {
        x = posX;
        y = posY;
    }
};

int main() {
    Sprite player("hero.png");
    player.move(100, 200);
    player.draw();

    int x, y;
    player.getPosition(x, y);
    cout << "Position: (" << x << ", " << y << ")" << endl;

    return 0;
}
```

## 练习

1. 设计支持序列化和反序列化的类
2. 实现支持拖拽的 UI 组件
3. 创建游戏对象系统
4. 设计插件系统框架

---

[上一节：继承基础](01-basics.md) | [下一节：虚函数](../../cpp/4-polymorphism/01-virtual.md)
