# 2.2 构造函数

## 构造函数重载

```cpp
#include <iostream>
using namespace std;

class Point {
private:
    int x, y;

public:
    // 默认构造函数
    Point() : x(0), y(0) {
        cout << "Default constructor" << endl;
    }

    // 单参数构造函数
    Point(int val) : x(val), y(val) {
        cout << "Single param constructor" << endl;
    }

    // 双参数构造函数
    Point(int xVal, int yVal) : x(xVal), y(yVal) {
        cout << "Two param constructor" << endl;
    }

    void print() const {
        cout << "(" << x << ", " << y << ")" << endl;
    }
};

int main() {
    Point p1;         // (0, 0)
    Point p2(5);      // (5, 5)
    Point p3(10, 20); // (10, 20)

    p1.print();
    p2.print();
    p3.print();

    return 0;
}
```

## 拷贝构造函数

```cpp
#include <iostream>
using namespace std;

class MyClass {
private:
    int value;

public:
    MyClass(int v) : value(v) {
        cout << "Constructor" << endl;
    }

    // 拷贝构造函数
    MyClass(const MyClass& other) : value(other.value) {
        cout << "Copy constructor" << endl;
    }

    int getValue() const { return value; }
};

void funcByValue(MyClass obj) {
    cout << "Value: " << obj.getValue() << endl;
}

int main() {
    MyClass a(100);

    // 调用拷贝构造函数
    MyClass b = a;
    MyClass c(a);

    // 传值调用也会触发拷贝
    funcByValue(a);

    return 0;
}
```

## 深拷贝与浅拷贝

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class MyString {
private:
    char* data;
    int length;

public:
    // 构造函数
    MyString(const char* str) {
        length = strlen(str);
        data = new char[length + 1];
        strcpy(data, str);
        cout << "Constructor" << endl;
    }

    // 拷贝构造函数（深拷贝）
    MyString(const MyString& other) {
        length = other.length;
        data = new char[length + 1];
        strcpy(data, other.data);
        cout << "Copy constructor (deep)" << endl;
    }

    // 析构函数
    ~MyString() {
        delete[] data;
        cout << "Destructor" << endl;
    }

    void print() const {
        cout << "String: " << data << endl;
    }
};

int main() {
    MyString s1("Hello");
    MyString s2 = s1;  // 深拷贝

    s1.print();
    s2.print();

    return 0;
}
```

## 委托构造函数（C++11）

```cpp
#include <iostream>
using namespace std;

class Employee {
private:
    string name;
    int id;
    double salary;

public:
    // 主构造函数
    Employee(const string& n, int i, double s)
        : name(n), id(i), salary(s) {
        cout << "Main constructor" << endl;
    }

    // 委托构造函数
    Employee() : Employee("Unknown", 0, 0) {
        cout << "Default constructor (delegating)" << endl;
    }

    // 委托构造函数
    Employee(const string& n) : Employee(n, 0, 0) {
        cout << "Name-only constructor (delegating)" << endl;
    }

    void display() const {
        cout << name << " (ID: " << id
             << ") $" << salary << endl;
    }
};

int main() {
    Employee e1;
    Employee e2("Alice");
    Employee e3("Bob", 1001, 50000);

    e1.display();
    e2.display();
    e3.display();

    return 0;
}
```

## 构造函数与 static

```cpp
#include <iostream>
using namespace std;

class Counter {
private:
    static int count;
    int id;

public:
    Counter() {
        count++;
        id = count;
        cout << "Object " << id << " created" << endl;
    }

    ~Counter() {
        cout << "Object " << id << " destroyed" << endl;
    }

    static int getCount() {
        return count;
    }
};

int Counter::count = 0;

int main() {
    cout << "Count: " << Counter::getCount() << endl;

    Counter c1, c2;
    cout << "Count: " << Counter::getCount() << endl;

    {
        Counter c3;
        cout << "Count: " << Counter::getCount() << endl;
    }

    cout << "Count: " << Counter::getCount() << endl;

    return 0;
}
```

## explicit 构造函数

```cpp
#include <iostream>
using namespace std;

class Amount {
private:
    int dollars;

public:
    // 隐式转换
    Amount(int d) : dollars(d) {}

    int getDollars() const { return dollars; }
};

void printAmount(const Amount& a) {
    cout << "$" << a.getDollars() << endl;
}

int main() {
    Amount a(100);
    printAmount(a);

    // 隐式转换（可能不是你想要的）
    printAmount(500);  // 等价于 printAmount(Amount(500))

    return 0;
}
```

```cpp
// 使用 explicit 禁止隐式转换
class SafeAmount {
private:
    int dollars;

public:
    explicit SafeAmount(int d) : dollars(d) {}
    int getDollars() const { return dollars; }
};

void printSafeAmount(const SafeAmount& a) {
    cout << "$" << a.getDollars() << endl;
}

int main() {
    SafeAmount a(100);
    printSafeAmount(a);

    // printSafeAmount(500);  // 错误！不能隐式转换

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Date {
private:
    int year, month, day;

public:
    Date(int y, int m, int d) : year(y), month(m), day(d) {}

    void display() const {
        cout << year << "-" << month << "-" << day;
    }
};

class Event {
private:
    string title;
    Date date;

public:
    Event(const string& t, int y, int m, int d)
        : title(t), date(y, m, d) {
        cout << "Event created: " << title << endl;
    }

    void display() const {
        cout << "Event: " << title << " on ";
        date.display();
        cout << endl;
    }
};

int main() {
    Event meeting("Team Meeting", 2024, 3, 15);
    Event conference("Tech Conf", 2024, 6, 1);

    meeting.display();
    conference.display();

    return 0;
}
```

## 练习

1. 实现一个完整的字符串类
2. 创建矩阵类，支持多种构造方式
3. 实现智能指针的简化版本
4. 设计一个支持深拷贝的数组类

---

[上一节：类基础](01-basics.md) | [下一节：运算符重载](03-operator.md)
