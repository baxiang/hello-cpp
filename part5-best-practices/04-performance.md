# 4. 性能优化

## 避免不必要的拷贝

```cpp
// 低效：值传递导致拷贝
void process(std::vector<int> vec) { }

// 高效：常量引用
void process(const std::vector<int>& vec) { }

// 返回值优化
// C++17 起 guaranteed copy elision
std::vector<int> create() {
    std::vector<int> result;
    return result;  // 不产生拷贝
}
```

## 使用移动语义

```cpp
class Data {
    std::vector<int> data;
public:
    // 移动构造函数
    Data(Data&& other) noexcept
        : data(std::move(other.data)) {}

    // 移动赋值
    Data& operator=(Data&& other) noexcept {
        data = std::move(other.data);
        return *this;
    }
};
```

## 预分配容器容量

```cpp
// 低效：多次重新分配
std::vector<int> vec;
for (int i = 0; i < 1000000; i++) {
    vec.push_back(i);
}

// 高效：预分配
std::vector<int> vec;
vec.reserve(1000000);
for (int i = 0; i < 1000000; i++) {
    vec.push_back(i);
}
```

## 使用 string_view

```cpp
// 旧风格 - 字符串拷贝
void process(const std::string& str);

// 现代风格 - 无拷贝
void process(std::string_view str);
```

## 内联小函数

```cpp
// 小函数使用 inline 或定义在头文件中
inline int add(int a, int b) {
    return a + b;
}

// 或使用 constexpr（隐式 inline）
constexpr int multiply(int a, int b) {
    return a * b;
}
```

## 容器选择指南

| 需求 | 推荐容器 |
|------|---------|
| 随机访问 | vector |
| 频繁头尾插入 | deque |
| 频繁中间插入 | list |
| 快速查找 | unordered_set/map |
| 有序数据 | set/map |
| 唯一所有权 | unique_ptr |
| 共享所有权 | shared_ptr |

## 练习

1. 优化代码减少拷贝
2. 选择合适的容器
3. 使用 string_view 优化字符串处理

---

[上一节：现代 C++ 风格](03-modern-cpp.md) | [下一节：常见陷阱](05-pitfalls.md)
