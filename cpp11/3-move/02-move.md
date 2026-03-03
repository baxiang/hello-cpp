# 3.2 移动语义

## 移动构造函数

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class MyString {
private:
    char* data;
    size_t len;

public:
    // 构造函数
    MyString(const char* str) {
        cout << "Constructor" << endl;
        len = strlen(str);
        data = new char[len + 1];
        strcpy(data, str);
    }

    // 拷贝构造函数
    MyString(const MyString& other) {
        cout << "Copy constructor" << endl;
        len = other.len;
        data = new char[len + 1];
        strcpy(data, other.data);
    }

    // 移动构造函数
    MyString(MyString&& other) noexcept {
        cout << "Move constructor" << endl;
        len = other.len;
        data = other.data;
        other.data = nullptr;
        other.len = 0;
    }

    // 析构函数
    ~MyString() {
        cout << "Destructor" << endl;
        delete[] data;
    }

    void print() const {
        cout << "String: " << (data ? data : "[empty]") << endl;
    }
};

MyString createString() {
    return MyString("Hello");
}

int main() {
    MyString s1("World");
    s1.print();

    // 移动构造
    MyString s2 = createString();
    s2.print();

    // 使用 move
    MyString s3 = move(s1);
    s3.print();
    s1.print();  // s1 已空

    return 0;
}
```

## 移动赋值运算符

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class MyString {
private:
    char* data;
    size_t len;

public:
    MyString(const char* str) {
        len = strlen(str);
        data = new char[len + 1];
        strcpy(data, str);
    }

    // 移动赋值
    MyString& operator=(MyString&& other) noexcept {
        cout << "Move assignment" << endl;
        if (this != &other) {
            delete[] data;
            data = other.data;
            len = other.len;
            other.data = nullptr;
            other.len = 0;
        }
        return *this;
    }

    ~MyString() {
        delete[] data;
    }

    void print() const {
        cout << "String: " << data << endl;
    }
};

int main() {
    MyString s1("Hello");
    MyString s2("World");

    s1.print();
    s2.print();

    // 移动赋值
    s1 = move(s2);
    s1.print();
    s2.print();  // s2 已空

    return 0;
}
```

## 五条法则

```cpp
#include <iostream>
using namespace std;

class Resource {
private:
    int* data;

public:
    // 1. 默认构造函数
    Resource() : data(new int(0)) {
        cout << "Default constructor" << endl;
    }

    // 2. 析构函数
    ~Resource() {
        cout << "Destructor" << endl;
        delete data;
    }

    // 3. 拷贝构造函数
    Resource(const Resource& other)
        : data(new int(*other.data)) {
        cout << "Copy constructor" << endl;
    }

    // 4. 拷贝赋值运算符
    Resource& operator=(const Resource& other) {
        cout << "Copy assignment" << endl;
        if (this != &other) {
            delete data;
            data = new int(*other.data);
        }
        return *this;
    }

    // 5. 移动构造函数
    Resource(Resource&& other) noexcept
        : data(other.data) {
        cout << "Move constructor" << endl;
        other.data = nullptr;
    }

    // 6. 移动赋值运算符
    Resource& operator=(Resource&& other) noexcept {
        cout << "Move assignment" << endl;
        if (this != &other) {
            delete data;
            data = other.data;
            other.data = nullptr;
        }
        return *this;
    }
};

int main() {
    Resource r1;
    Resource r2 = r1;         // 拷贝构造
    Resource r3 = move(r1);   // 移动构造

    return 0;
}
```

## 标准库中的移动语义

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // vector 移动
    vector<string> v1 = {"a", "b", "c"};
    vector<string> v2 = move(v1);

    cout << "v1 size: " << v1.size() << endl;  // 0
    cout << "v2 size: " << v2.size() << endl;  // 3

    // string 移动
    string s1 = "Hello";
    string s2 = move(s1);

    cout << "s1: '" << s1 << "'" << endl;  // 空
    cout << "s2: '" << s2 << "'" << endl;  // Hello

    return 0;
}
```

## 练习

1. 实现支持移动语义的数组类
2. 实现移动语义的矩阵类
3. 使用移动语义优化返回大对象

---

[上一节：右值引用](01-rvalue.md) | [下一节：Lambda 表达式](../../cpp11/4-lambda/01-basics.md)
