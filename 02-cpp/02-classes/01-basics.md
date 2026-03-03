# 2.1 类基础

## 类的定义

```cpp
#include <iostream>
using namespace std;

class Person {
private:
    string name;
    int age;

public:
    // 成员函数
    void setName(const string& n) {
        name = n;
    }

    string getName() const {
        return name;
    }

    void setAge(int a) {
        age = a;
    }

    int getAge() const {
        return age;
    }

    void introduce() const {
        cout << "Hi, I'm " << name
             << ", " << age << " years old." << endl;
    }
};

int main() {
    Person p;
    p.setName("Alice");
    p.setAge(25);
    p.introduce();

    return 0;
}
```

## 访问控制

```cpp
#include <iostream>
using namespace std;

class Box {
public:
    double width;    // 公有：外部可访问

private:
    double height;   // 私有：仅类内访问

protected:
    double depth;    // 保护：派生类可访问

public:
    void setDimensions(double w, double h, double d) {
        width = w;
        height = h;   // OK
        depth = d;    // OK
    }

    double volume() const {
        return width * height * depth;
    }
};

int main() {
    Box box;
    box.width = 10;      // OK
    // box.height = 20;  // 错误！私有
    box.setDimensions(10, 20, 5);
    cout << "Volume: " << box.volume() << endl;

    return 0;
}
```

## 构造函数

```cpp
#include <iostream>
using namespace std;

class Rectangle {
private:
    double width;
    double height;

public:
    // 默认构造函数
    Rectangle() {
        width = 1;
        height = 1;
    }

    // 带参构造函数
    Rectangle(double w, double h) {
        width = w;
        height = h;
    }

    double area() const {
        return width * height;
    }
};

int main() {
    Rectangle r1;                // 默认构造
    Rectangle r2(5, 10);         // 带参构造

    cout << "r1 area: " << r1.area() << endl;
    cout << "r2 area: " << r2.area() << endl;

    return 0;
}
```

## 初始化列表

```cpp
#include <iostream>
using namespace std;

class Point {
private:
    int x;
    int y;

public:
    // 使用初始化列表（推荐）
    Point(int xVal, int yVal)
        : x(xVal), y(yVal) {
    }

    // const 成员初始化必须用初始化列表
    Point(int val)
        : x(val), y(val) {
    }

    void print() const {
        cout << "(" << x << ", " << y << ")" << endl;
    }
};

int main() {
    Point p1(10, 20);
    Point p2(5);
    p1.print();
    p2.print();

    return 0;
}
```

## 析构函数

```cpp
#include <iostream>
using namespace std;

class Counter {
private:
    int count;

public:
    Counter() : count(0) {
        cout << "Constructor called" << endl;
    }

    ~Counter() {
        cout << "Destructor called" << endl;
    }

    void increment() {
        count++;
    }

    int getCount() const {
        return count;
    }
};

void test() {
    Counter c;
    c.increment();
    c.increment();
    cout << "Count: " << c.getCount() << endl;
}

int main() {
    test();  // 函数结束时自动调用析构函数
    cout << "Back to main" << endl;

    return 0;
}
```

## this 指针

```cpp
#include <iostream>
using namespace std;

class Person {
private:
    string name;
    int age;

public:
    // 使用 this 区分成员变量和参数
    void setName(const string& name) {
        this->name = name;
    }

    void setAge(int age) {
        this->age = age;
    }

    // 链式调用
    Person& withName(const string& n) {
        this->name = n;
        return *this;
    }

    Person& withAge(int a) {
        this->age = a;
        return *this;
    }

    void introduce() const {
        cout << "Name: " << name
             << ", Age: " << age << endl;
    }
};

int main() {
    Person p;
    p.withName("Bob").withAge(30);
    p.introduce();

    return 0;
}
```

## const 成员函数

```cpp
#include <iostream>
using namespace std;

class Data {
private:
    int value;
    mutable int accessCount;  // 可在 const 函数中修改

public:
    Data(int v) : value(v), accessCount(0) {}

    // const 成员函数 - 不能修改成员
    int getValue() const {
        accessCount++;  // mutable 允许修改
        return value;
    }

    // 非 const 成员函数
    void setValue(int v) {
        value = v;
    }
};

int main() {
    const Data d(100);
    cout << d.getValue() << endl;
    // d.setValue(200);  // 错误！const 对象只能调用 const 函数

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <string>
using namespace std;

class BankAccount {
private:
    string owner;
    double balance;

public:
    // 构造函数
    BankAccount(const string& name, double initial = 0)
        : owner(name), balance(initial) {
        cout << "Account created for " << owner << endl;
    }

    // 析构函数
    ~BankAccount() {
        cout << "Account closed for " << owner << endl;
    }

    // 存款
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            cout << "Deposited: " << amount << endl;
        }
    }

    // 取款
    bool withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            cout << "Withdrew: " << amount << endl;
            return true;
        }
        cout << "Withdrawal failed" << endl;
        return false;
    }

    // 查询余额
    double getBalance() const {
        return balance;
    }

    // 显示信息
    void display() const {
        cout << "Owner: " << owner
             << ", Balance: $" << balance << endl;
    }
};

int main() {
    BankAccount account("Alice", 1000);

    account.deposit(500);
    account.withdraw(200);
    account.display();

    cout << "Final balance: $" << account.getBalance() << endl;

    return 0;
}
```

## 练习

1. 定义表示时间的类
2. 实现复数类，支持加减乘除
3. 创建学生类，包含姓名、学号、成绩
4. 实现简单的日期类

---

[上一节：输入输出](../../cpp/1-intro/03-io.md) | [下一节：构造函数](02-constructor.md)
