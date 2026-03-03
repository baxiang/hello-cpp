# 2.3 运算符重载

## 运算符重载基础

```cpp
#include <iostream>
using namespace std;

class Complex {
private:
    double real;
    double imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 成员函数重载
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }

    Complex operator-(const Complex& other) const {
        return Complex(real - other.real, imag - other.imag);
    }

    void print() const {
        cout << real << " + " << imag << "i" << endl;
    }
};

int main() {
    Complex a(3, 4);
    Complex b(1, 2);

    Complex c = a + b;
    Complex d = a - b;

    c.print();
    d.print();

    return 0;
}
```

## 友元函数重载

```cpp
#include <iostream>
using namespace std;

class Vector3D {
private:
    double x, y, z;

public:
    Vector3D(double x = 0, double y = 0, double z = 0)
        : x(x), y(y), z(z) {}

    // 友元函数重载（左操作数不是本类对象）
    friend Vector3D operator+(const Vector3D& a, const Vector3D& b);
    friend Vector3D operator*(double scalar, const Vector3D& v);

    // 成员函数重载
    Vector3D operator*(double scalar) const {
        return Vector3D(x * scalar, y * scalar, z * scalar);
    }

    void print() const {
        cout << "(" << x << ", " << y << ", " << z << ")" << endl;
    }
};

Vector3D operator+(const Vector3D& a, const Vector3D& b) {
    return Vector3D(a.x + b.x, a.y + b.y, a.z + b.z);
}

Vector3D operator*(double scalar, const Vector3D& v) {
    return v * scalar;  // 调用成员函数版本
}

int main() {
    Vector3D a(1, 2, 3);
    Vector3D b(4, 5, 6);

    Vector3D c = a + b;
    c.print();

    Vector3D d = 2.0 * a;  // 需要友元
    d.print();

    return 0;
}
```

## 输入输出运算符重载

```cpp
#include <iostream>
using namespace std;

class Point {
private:
    int x, y;

public:
    Point(int x = 0, int y = 0) : x(x), y(y) {}

    // 重载 << 运算符
    friend ostream& operator<<(ostream& os, const Point& p);

    // 重载 >> 运算符
    friend istream& operator>>(istream& is, Point& p);
};

ostream& operator<<(ostream& os, const Point& p) {
    os << "(" << p.x << ", " << p.y << ")";
    return os;
}

istream& operator>>(istream& is, Point& p) {
    cout << "Enter x: ";
    is >> p.x;
    cout << "Enter y: ";
    is >> p.y;
    return is;
}

int main() {
    Point p;
    cout << "Input point:" << endl;
    cin >> p;

    cout << "You entered: " << p << endl;

    return 0;
}
```

## 比较运算符重载

```cpp
#include <iostream>
using namespace std;

class Person {
private:
    string name;
    int age;

public:
    Person(const string& n, int a) : name(n), age(a) {}

    // 比较运算符
    bool operator==(const Person& other) const {
        return name == other.name && age == other.age;
    }

    bool operator<(const Person& other) const {
        return age < other.age;
    }

    // 其他比较运算符可由 == 和 < 推导
    bool operator!=(const Person& other) const {
        return !(*this == other);
    }

    bool operator>(const Person& other) const {
        return other < *this;
    }

    void print() const {
        cout << name << " (" << age << ")" << endl;
    }
};

int main() {
    Person a("Alice", 25);
    Person b("Bob", 30);

    if (a < b) {
        cout << "Alice is younger" << endl;
    }

    if (a != b) {
        cout << "Different people" << endl;
    }

    return 0;
}
```

## 下标运算符重载

```cpp
#include <iostream>
using namespace std;

class Array {
private:
    int* data;
    int size;

public:
    Array(int s) : size(s) {
        data = new int[size];
        for (int i = 0; i < size; i++) {
            data[i] = 0;
        }
    }

    ~Array() {
        delete[] data;
    }

    // 非常量版本（可修改）
    int& operator[](int index) {
        return data[index];
    }

    // 常量版本（只读）
    const int& operator[](int index) const {
        return data[index];
    }

    int getSize() const { return size; }
};

int main() {
    Array arr(5);

    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;

    cout << "arr[1] = " << arr[1] << endl;

    for (int i = 0; i < arr.getSize(); i++) {
        cout << arr[i] << " ";
    }
    cout << endl;

    return 0;
}
```

## 递增递减运算符

```cpp
#include <iostream>
using namespace std;

class Counter {
private:
    int value;

public:
    Counter(int v = 0) : value(v) {}

    // 前置递增 ++i
    Counter& operator++() {
        ++value;
        return *this;
    }

    // 后置递增 i++（dummy 参数区分）
    Counter operator++(int) {
        Counter temp = *this;
        ++value;
        return temp;
    }

    // 前置递减 --i
    Counter& operator--() {
        --value;
        return *this;
    }

    // 后置递减 i--
    Counter operator--(int) {
        Counter temp = *this;
        --value;
        return temp;
    }

    int getValue() const { return value; }
};

int main() {
    Counter c(5);

    Counter a = ++c;  // 前置：c=6, a=6
    Counter b = c++;  // 后置：c=7, b=6

    cout << "a = " << a.getValue() << endl;
    cout << "b = " << b.getValue() << endl;
    cout << "c = " << c.getValue() << endl;

    return 0;
}
```

## 类型转换运算符

```cpp
#include <iostream>
using namespace std;

class Distance {
private:
    double meters;

public:
    Distance(double m = 0) : meters(m) {}

    // 转换函数
    operator double() const {
        return meters;
    }

    operator int() const {
        return static_cast<int>(meters);
    }

    // C++11 explicit 转换
    explicit operator bool() const {
        return meters > 0;
    }
};

int main() {
    Distance d(100.5);

    // 隐式转换
    double val = d;
    cout << "Meters: " << val << endl;

    // 显式转换
    int intVal = static_cast<int>(d);
    cout << "Integer: " << intVal << endl;

    // bool 转换
    if (d) {
        cout << "Distance is positive" << endl;
    }

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <cmath>
using namespace std;

class Complex {
private:
    double real;
    double imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 算术运算符
    Complex operator+(const Complex& o) const {
        return Complex(real + o.real, imag + o.imag);
    }

    Complex operator-(const Complex& o) const {
        return Complex(real - o.real, imag - o.imag);
    }

    Complex operator*(const Complex& o) const {
        return Complex(
            real * o.real - imag * o.imag,
            real * o.imag + imag * o.real
        );
    }

    Complex operator/(const Complex& o) const {
        double denom = o.real * o.real + o.imag * o.imag;
        return Complex(
            (real * o.real + imag * o.imag) / denom,
            (imag * o.real - real * o.imag) / denom
        );
    }

    // 比较运算符
    bool operator==(const Complex& o) const {
        return real == o.real && imag == o.imag;
    }

    // 输入输出
    friend ostream& operator<<(ostream& os, const Complex& c) {
        os << c.real << " + " << c.imag << "i";
        return os;
    }

    friend istream& operator>>(istream& is, Complex& c) {
        is >> c.real >> c.imag;
        return is;
    }

    // 模长
    double abs() const {
        return sqrt(real * real + imag * imag);
    }
};

int main() {
    Complex a(3, 4);
    Complex b(1, 2);

    cout << "a = " << a << endl;
    cout << "b = " << b << endl;

    cout << "a + b = " << (a + b) << endl;
    cout << "a - b = " << (a - b) << endl;
    cout << "a * b = " << (a * b) << endl;
    cout << "a / b = " << (a / b) << endl;

    cout << "|a| = " << a.abs() << endl;

    return 0;
}
```

## 可重载运算符

| 运算符 | 说明 |
|--------|------|
| `+ - * /` | 算术运算 |
| `== != < > <= >=` | 比较运算 |
| `++ --` | 自增自减 |
| `=` | 赋值 |
| `[]` | 下标 |
| `()` | 函数调用 |
| `<< >>` | 位运算/IO |
| `->` | 成员访问 |

**不可重载的运算符：** `::` `.*` `.` `?:` `sizeof`

## 练习

1. 实现有理数类（分数）
2. 实现矩阵类，支持加减乘
3. 实现大整数类
4. 实现多项式类

---

[上一节：构造函数](02-constructor.md) | [下一节：继承基础](../../cpp/3-inheritance/01-basics.md)
