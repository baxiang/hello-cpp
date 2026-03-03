# 5.2 类模板

## 类模板基础

```cpp
#include <iostream>
using namespace std;

template <typename T>
class Box {
private:
    T content;

public:
    Box(const T& c) : content(c) {}

    T getContent() const {
        return content;
    }

    void setContent(const T& c) {
        content = c;
    }
};

int main() {
    Box<int> intBox(42);
    cout << "Int box: " << intBox.getContent() << endl;

    Box<string> strBox("Hello");
    cout << "String box: " << strBox.getContent() << endl;

    return 0;
}
```

## 多个模板参数

```cpp
#include <iostream>
using namespace std;

template <typename K, typename V>
class Pair {
private:
    K key;
    V value;

public:
    Pair(const K& k, const V& v) : key(k), value(v) {}

    K getKey() const { return key; }
    V getValue() const { return value; }

    void setKey(const K& k) { key = k; }
    void setValue(const V& v) { value = v; }
};

int main() {
    Pair<string, int> person("Age", 25);
    cout << person.getKey() << ": " << person.getValue() << endl;

    Pair<int, double> measurement(1, 3.14);
    cout << measurement.getKey() << ": " << measurement.getValue() << endl;

    return 0;
}
```

## 模板特化

```cpp
#include <iostream>
#include <cstring>
using namespace std;

// 通用模板
template <typename T>
class Container {
private:
    T data;

public:
    Container(const T& d) : data(d) {}

    T getData() const { return data; }
};

// 特化版本
template <>
class Container<const char*> {
private:
    char* data;

public:
    Container(const char* d) {
        data = new char[strlen(d) + 1];
        strcpy(data, d);
    }

    ~Container() {
        delete[] data;
    }

    const char* getData() const { return data; }

    // 拷贝构造和赋值运算符（深拷贝）
    Container(const Container& other) {
        data = new char[strlen(other.data) + 1];
        strcpy(data, other.data);
    }

    Container& operator=(const Container& other) {
        if (this != &other) {
            delete[] data;
            data = new char[strlen(other.data) + 1];
            strcpy(data, other.data);
        }
        return *this;
    }
};

int main() {
    Container<int> intContainer(100);
    cout << "Int: " << intContainer.getData() << endl;

    Container<const char*> strContainer("Hello");
    cout << "String: " << strContainer.getData() << endl;

    return 0;
}
```

## 类模板作为基类

```cpp
#include <iostream>
using namespace std;

template <typename T>
class Shape {
protected:
    T dimension;

public:
    Shape(T d) : dimension(d) {}

    virtual T area() const = 0;
    virtual ~Shape() = default;
};

template <typename T>
class Square : public Shape<T> {
public:
    Square(T side) : Shape<T>(side) {}

    T area() const override {
        return this->dimension * this->dimension;
    }
};

template <typename T>
class Cube : public Shape<T> {
public:
    Cube(T side) : Shape<T>(side) {}

    T volume() const {
        return this->dimension * this->dimension * this->dimension;
    }
};

int main() {
    Square<int> square(5);
    cout << "Square area: " << square.area() << endl;

    Cube<double> cube(3.0);
    cout << "Cube volume: " << cube.volume() << endl;

    return 0;
}
```

## 变长模板

```cpp
#include <iostream>
#include <tuple>
using namespace std;

// 简化版的元组
template <typename... Args>
class Tuple;

// 递归情况
template <typename T, typename... Rest>
class Tuple<T, Rest...> : public Tuple<Rest...> {
private:
    T value;

public:
    Tuple(T v, Rest... rest) : Tuple<Rest...>(rest...), value(v) {}

    T getFirst() const { return value; }
};

// 基础情况
template <>
class Tuple<> {
public:
    Tuple() {}
};

int main() {
    Tuple<int, double, const char*> t(42, 3.14, "hello");
    cout << "First: " << t.getFirst() << endl;

    return 0;
}
```

## 完整示例：简易向量

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

template <typename T>
class Vector {
private:
    T* data;
    size_t size;
    size_t capacity;

public:
    // 构造函数
    Vector() : data(nullptr), size(0), capacity(0) {}

    Vector(size_t n, const T& value = T())
        : size(n), capacity(n) {
        data = new T[capacity];
        for (size_t i = 0; i < size; i++) {
            data[i] = value;
        }
    }

    // 拷贝构造函数
    Vector(const Vector& other)
        : size(other.size), capacity(other.capacity) {
        data = new T[capacity];
        for (size_t i = 0; i < size; i++) {
            data[i] = other.data[i];
        }
    }

    // 析构函数
    ~Vector() {
        delete[] data;
    }

    // 赋值运算符
    Vector& operator=(const Vector& other) {
        if (this != &other) {
            delete[] data;
            size = other.size;
            capacity = other.capacity;
            data = new T[capacity];
            for (size_t i = 0; i < size; i++) {
                data[i] = other.data[i];
            }
        }
        return *this;
    }

    // 添加元素
    void push_back(const T& value) {
        if (size >= capacity) {
            capacity = capacity == 0 ? 1 : capacity * 2;
            T* newData = new T[capacity];
            for (size_t i = 0; i < size; i++) {
                newData[i] = data[i];
            }
            delete[] data;
            data = newData;
        }
        data[size++] = value;
    }

    // 访问元素
    T& operator[](size_t index) {
        if (index >= size) {
            throw out_of_range("Index out of range");
        }
        return data[index];
    }

    const T& operator[](size_t index) const {
        if (index >= size) {
            throw out_of_range("Index out of range");
        }
        return data[index];
    }

    // 大小
    size_t getSize() const { return size; }
    bool empty() const { return size == 0; }

    // 迭代器支持
    T* begin() { return data; }
    T* end() { return data + size; }
    const T* begin() const { return data; }
    const T* end() const { return data + size; }
};

int main() {
    Vector<int> nums;
    nums.push_back(1);
    nums.push_back(2);
    nums.push_back(3);

    for (size_t i = 0; i < nums.getSize(); i++) {
        cout << nums[i] << " ";
    }
    cout << endl;

    // 范围 for 循环
    for (const auto& n : nums) {
        cout << n << " ";
    }
    cout << endl;

    Vector<string> names(3, "Unknown");
    names[0] = "Alice";
    names[1] = "Bob";
    names[2] = "Charlie";

    for (const auto& name : names) {
        cout << name << " ";
    }
    cout << endl;

    return 0;
}
```

## 练习

1. 实现泛型栈
2. 实现泛型队列
3. 实现泛型链表
4. 实现简单的哈希表

---

[上一节：函数模板](01-function.md) | [下一节：容器](../../cpp/6-stl/01-containers.md)
