# 4.2 抽象类

## 纯虚函数和抽象类

```cpp
#include <iostream>
using namespace std;

// 抽象类
class Shape {
protected:
    string color;

public:
    Shape(const string& c) : color(c) {}

    // 纯虚函数
    virtual double area() const = 0;

    // 普通虚函数
    virtual void describe() const {
        cout << "A " << color << " shape" << endl;
    }

    virtual ~Shape() = default;
};

// 具体类
class Circle : public Shape {
private:
    double radius;

public:
    Circle(const string& c, double r)
        : Shape(c), radius(r) {}

    double area() const override {
        return 3.14159 * radius * radius;
    }

    void describe() const override {
        cout << "A " << color << " circle with radius "
             << radius << endl;
    }
};

int main() {
    // Shape* s = new Shape();  // 错误！不能实例化抽象类

    Circle c("Red", 5);
    cout << "Area: " << c.area() << endl;
    c.describe();

    return 0;
}
```

## 抽象类作为接口

```cpp
#include <iostream>
#include <vector>
using namespace std;

// 接口
class IPayment {
public:
    virtual bool processPayment(double amount) = 0;
    virtual string getPaymentMethod() const = 0;
    virtual ~IPayment() = default;
};

// 信用卡支付
class CreditCardPayment : public IPayment {
private:
    string cardNumber;

public:
    CreditCardPayment(const string& num) : cardNumber(num) {}

    bool processPayment(double amount) override {
        cout << "Processing $" << amount
             << " via Credit Card ****"
             << cardNumber.substr(12) << endl;
        return true;
    }

    string getPaymentMethod() const override {
        return "Credit Card";
    }
};

// PayPal 支付
class PayPalPayment : public IPayment {
private:
    string email;

public:
    PayPalPayment(const string& e) : email(e) {}

    bool processPayment(double amount) override {
        cout << "Processing $" << amount
             << " via PayPal (" << email << ")" << endl;
        return true;
    }

    string getPaymentMethod() const override {
        return "PayPal";
    }
};

void checkout(IPayment* payment, double amount) {
    cout << "Payment method: " << payment->getPaymentMethod() << endl;
    if (payment->processPayment(amount)) {
        cout << "Payment successful!" << endl;
    } else {
        cout << "Payment failed!" << endl;
    }
}

int main() {
    CreditCardPayment cc("1234567812345678");
    PayPalPayment pp("user@example.com");

    checkout(&cc, 99.99);
    cout << "---" << endl;
    checkout(&pp, 49.99);

    return 0;
}
```

## 部分抽象类

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    // 纯虚函数
    virtual void makeSound() const = 0;

    // 有实现的纯虚函数
    virtual void sleep() const {
        cout << "Animal is sleeping" << endl;
    }

    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void makeSound() const override {
        cout << "Dog barks: Woof!" << endl;
    }
};

class Cat : public Animal {
public:
    void makeSound() const override {
        cout << "Cat meows: Meow!" << endl;
    }

    void sleep() const override {
        cout << "Cat is sleeping on the couch" << endl;
    }
};

int main() {
    Dog dog;
    Cat cat;

    dog.makeSound();
    dog.sleep();

    cat.makeSound();
    cat.sleep();

    return 0;
}
```

## 抽象类与多态

```cpp
#include <iostream>
#include <vector>
#include <memory>
using namespace std;

// 抽象基类
class Document {
protected:
    string title;
    string content;

public:
    Document(const string& t) : title(t) {}

    virtual void open() = 0;
    virtual void close() = 0;
    virtual void save() = 0;

    string getTitle() const { return title; }

    virtual ~Document() = default;
};

// PDF 文档
class PDFDocument : public Document {
public:
    PDFDocument(const string& t) : Document(t) {}

    void open() override {
        cout << "Opening PDF: " << title << endl;
    }

    void close() override {
        cout << "Closing PDF: " << title << endl;
    }

    void save() override {
        cout << "Saving PDF: " << title << endl;
    }
};

// Word 文档
class WordDocument : public Document {
public:
    WordDocument(const string& t) : Document(t) {}

    void open() override {
        cout << "Opening Word: " << title << endl;
    }

    void close() override {
        cout << "Closing Word: " << title << endl;
    }

    void save() override {
        cout << "Saving Word: " << title << endl;
    }
};

class DocumentManager {
private:
    vector<unique_ptr<Document>> documents;

public:
    void addDocument(unique_ptr<Document> doc) {
        documents.push_back(move(doc));
    }

    void openAll() {
        for (auto& doc : documents) {
            doc->open();
        }
    }

    void saveAll() {
        for (auto& doc : documents) {
            doc->save();
        }
    }
};

int main() {
    DocumentManager manager;

    manager.addDocument(make_unique<PDFDocument>("Report.pdf"));
    manager.addDocument(make_unique<WordDocument>("Letter.docx"));

    manager.openAll();
    manager.saveAll();

    return 0;
}
```

## 工厂模式

```cpp
#include <iostream>
#include <memory>
#include <string>
using namespace std;

// 抽象产品
class Product {
public:
    virtual void use() const = 0;
    virtual ~Product() = default;
};

// 具体产品
class ConcreteProductA : public Product {
public:
    void use() const override {
        cout << "Using Product A" << endl;
    }
};

class ConcreteProductB : public Product {
public:
    void use() const override {
        cout << "Using Product B" << endl;
    }
};

// 抽象工厂
class Factory {
public:
    virtual unique_ptr<Product> create() = 0;
    virtual ~Factory() = default;
};

// 具体工厂
class FactoryA : public Factory {
public:
    unique_ptr<Product> create() override {
        return make_unique<ConcreteProductA>();
    }
};

class FactoryB : public Factory {
public:
    unique_ptr<Product> create() override {
        return make_unique<ConcreteProductB>();
    }
};

int main() {
    unique_ptr<Factory> factory = make_unique<FactoryA>();
    auto product = factory->create();
    product->use();

    return 0;
}
```

## 练习

1. 实现数据库连接抽象层
2. 设计日志系统抽象
3. 创建跨平台 UI 组件库
4. 实现命令模式

---

[上一节：虚函数](01-virtual.md) | [下一节：函数模板](../../cpp/5-templates/01-function.md)
