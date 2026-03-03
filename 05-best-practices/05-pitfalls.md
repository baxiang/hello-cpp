# 5. 常见陷阱

## 悬垂引用

```cpp
// 错误：返回局部变量引用
int& getRef() {
    int x = 10;
    return x;  // 悬垂引用！
}

// 正确
int getValue() {
    int x = 10;
    return x;  // 返回值
}
```

## 切片问题

```cpp
class Base { public: virtual ~Base() = default; };
class Derived : public Base { };

// 错误：对象切片
void process(Base b) { }  // 传递 Derived 时会被切片

// 正确：使用引用或指针
void process(Base& b) { }
void process(Base* b) { }
```

## 异常安全

```cpp
// 不安全：可能泄漏
void unsafe() {
    Resource* r1 = new Resource();
    Resource* r2 = new Resource();  // 可能抛出
    delete r1;  // 如果上面抛出，这里不会执行
    delete r2;
}

// 安全：使用智能指针
void safe() {
    auto r1 = make_unique<Resource>();
    auto r2 = make_unique<Resource>();
    // 自动清理
}
```

## 整数溢出

```cpp
// 危险：可能溢出
int multiply(int a, int b) {
    return a * b;  // 可能溢出
}

// 安全：检查溢出
#include <limits>
int safeMultiply(int a, int b) {
    if (a > 0 && b > std::numeric_limits<int>::max() / a) {
        throw std::overflow_error("Overflow");
    }
    return a * b;
}
```

## 浮点数比较

```cpp
double a = 0.1 + 0.2;
double b = 0.3;

// 错误：直接比较
if (a == b) { }  // 可能为 false

// 正确：使用 epsilon
const double EPS = 1e-9;
if (std::abs(a - b) < EPS) { }  // 近似相等
```

## 未初始化变量

```cpp
// 危险：未定义行为
int x;
if (condition) {
    x = 10;
}
std::cout << x;  // 如果 condition 为 false，x 未初始化

// 正确：总是初始化
int x = 0;
```

## 练习

1. 识别并修复悬垂引用
2. 避免对象切片
3. 实现异常安全的代码

---

[上一节：性能优化](04-performance.md) | [下一节：设计模式](a1-design-patterns.md)
