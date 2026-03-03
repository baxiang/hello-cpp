# 7.1 异常处理

## try-catch 基础

```cpp
#include <iostream>
using namespace std;

int main() {
    try {
        int a = 10, b = 0;

        if (b == 0) {
            throw "Division by zero!";
        }

        cout << a / b << endl;

    } catch (const char* msg) {
        cout << "Error: " << msg << endl;
    }

    cout << "Program continues..." << endl;

    return 0;
}
```

## 异常类

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

double divide(double a, double b) {
    if (b == 0) {
        throw invalid_argument("Division by zero");
    }
    return a / b;
}

int main() {
    try {
        double result = divide(10, 0);
        cout << "Result: " << result << endl;

    } catch (const invalid_argument& e) {
        cout << "Invalid argument: " << e.what() << endl;

    } catch (const exception& e) {
        cout << "Standard exception: " << e.what() << endl;

    } catch (...) {
        cout << "Unknown exception" << endl;
    }

    return 0;
}
```

## 自定义异常

```cpp
#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

class BankException : public exception {
protected:
    string message;

public:
    BankException(const string& msg) : message(msg) {}

    const char* what() const noexcept override {
        return message.c_str();
    }
};

class InsufficientFundsException : public BankException {
private:
    double amount;
    double balance;

public:
    InsufficientFundsException(double amt, double bal)
        : BankException("Insufficient funds"),
          amount(amt), balance(bal) {}

    double getAmount() const { return amount; }
    double getBalance() const { return balance; }

    const char* what() const noexcept override {
        return ("Insufficient funds: tried to withdraw $" +
                to_string(amount) + " from $" +
                to_string(balance)).c_str();
    }
};

class BankAccount {
private:
    double balance;

public:
    BankAccount(double initial) : balance(initial) {}

    void withdraw(double amount) {
        if (amount > balance) {
            throw InsufficientFundsException(amount, balance);
        }
        balance -= amount;
    }

    double getBalance() const { return balance; }
};

int main() {
    BankAccount account(1000);

    try {
        account.withdraw(500);
        cout << "Balance: $" << account.getBalance() << endl;

        account.withdraw(1000);  // 会抛出异常

    } catch (const InsufficientFundsException& e) {
        cout << "Error: " << e.what() << endl;
        cout << "Tried to withdraw: $" << e.getAmount() << endl;
        cout << "Available: $" << e.getBalance() << endl;
    }

    return 0;
}
```

## 栈展开

```cpp
#include <iostream>
using namespace std;

class Resource {
public:
    Resource() { cout << "Resource acquired" << endl; }
    ~Resource() { cout << "Resource released" << endl; }
};

void func3() {
    Resource r;
    throw "Error in func3";
}

void func2() {
    Resource r;
    func3();
}

void func1() {
    Resource r;
    func2();
}

int main() {
    try {
        func1();
    } catch (const char* msg) {
        cout << "Caught: " << msg << endl;
    }

    cout << "Program continues" << endl;
    return 0;
}
```

输出：
```
Resource acquired
Resource acquired
Resource acquired
Resource released
Resource released
Resource released
Caught: Error in func3
Program continues
```

## noexcept

```cpp
#include <iostream>
using namespace std;

// 可能抛出异常
void mayThrow() {
    throw "Error";
}

// 不抛出异常
void noThrow() noexcept {
    cout << "This won't throw" << endl;
}

int main() {
    try {
        noThrow();
        mayThrow();
    } catch (...) {
        cout << "Caught exception" << endl;
    }

    return 0;
}
```

## RAII 与异常安全

```cpp
#include <iostream>
#include <memory>
using namespace std;

class File {
public:
    File(const string& name) {
        cout << "Opening file: " << name << endl;
    }

    ~File() {
        cout << "Closing file" << endl;
    }

    void write(const string& data) {
        cout << "Writing: " << data << endl;
    }
};

void riskyOperation() {
    unique_ptr<File> file = make_unique<File>("test.txt");

    file->write("Data 1");
    file->write("Data 2");

    // 即使这里抛出异常，File 也会被正确关闭
    throw runtime_error("Unexpected error");

    file->write("Data 3");  // 不会执行
}

int main() {
    try {
        riskyOperation();
    } catch (const exception& e) {
        cout << "Error: " << e.what() << endl;
    }

    cout << "Program continues" << endl;
    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

class Calculator {
public:
    static double divide(double a, double b) {
        if (b == 0) {
            throw invalid_argument("Cannot divide by zero");
        }
        return a / b;
    }

    static double squareRoot(double x) {
        if (x < 0) {
            throw domain_error("Cannot compute square root of negative number");
        }
        return sqrt(x);
    }
};

int main() {
    try {
        cout << "10 / 2 = " << Calculator::divide(10, 2) << endl;
        cout << "10 / 0 = " << Calculator::divide(10, 0) << endl;

    } catch (const invalid_argument& e) {
        cerr << "Invalid argument: " << e.what() << endl;

    } catch (const domain_error& e) {
        cerr << "Domain error: " << e.what() << endl;

    } catch (const exception& e) {
        cerr << "Exception: " << e.what() << endl;

    } catch (...) {
        cerr << "Unknown exception" << endl;
    }

    return 0;
}
```

## 练习

1. 实现带异常处理的栈
2. 创建自定义异常类
3. 实现异常安全的资源管理
4. 编写带输入验证的计算器

---

[上一节：算法](../../cpp/6-stl/02-algorithms.md) | [下一节：auto](../../cpp11/1-auto/01-auto.md)
