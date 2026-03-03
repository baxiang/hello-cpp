# 3. 现代 C++ 风格

## 使用 auto 简化代码

```cpp
// 旧风格
std::vector<int>::iterator it = vec.begin();

// 现代风格
auto it = vec.begin();

// 范围 for
for (const auto& item : container) {
    process(item);
}
```

## 使用 nullptr 代替 NULL

```cpp
// 旧风格
int* ptr = NULL;

// 现代风格
int* ptr = nullptr;
```

## 使用智能指针

```cpp
// 旧风格 - 裸指针
void oldStyle() {
    Resource* r = new Resource();
    delete r;
}

// 现代风格
void modernStyle() {
    auto r = make_unique<Resource>();
    // 自动释放
}
```

## 使用 override 和 final

```cpp
class Base {
public:
    virtual void func();
};

class Derived : public Base {
public:
    void func() override;  // 明确意图
};
```

## 使用 constexpr

```cpp
// 编译时计算
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

constexpr int val = factorial(5);
```

## 使用 Lambda 表达式

```cpp
// 旧风格 - 函数对象
struct Comparator {
    bool operator()(int a, int b) { return a < b; }
};
sort(vec.begin(), vec.end(), Comparator());

// 现代风格
sort(vec.begin(), vec.end(),
     [](int a, int b) { return a < b; });
```

## 使用初始化列表

```cpp
// 旧风格
vector<int> vec;
vec.push_back(1);
vec.push_back(2);
vec.push_back(3);

// 现代风格
vector<int> vec{1, 2, 3};
```

## 练习

1. 重构旧代码使用现代 C++ 风格
2. 将裸指针改为智能指针
3. 使用 Lambda 简化回调代码

---

[上一节：RAII](02-raii.md) | [下一节：性能优化](04-performance.md)
