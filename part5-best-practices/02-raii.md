# 2. RAII 原则

## RAII 基础

Resource Acquisition Is Initialization（资源获取即初始化）

```cpp
#include <iostream>
#include <fstream>
using namespace std;

// 错误示例：忘记释放资源
void badExample() {
    FILE* file = fopen("test.txt", "r");
    // ... 使用文件
    // 如果中间抛出异常，fclose 不会执行
    fclose(file);
}

// 正确示例：使用 RAII
void goodExample() {
    ifstream file("test.txt");
    // ... 使用文件
    // 离开作用域时自动关闭
}
```

## 智能指针 RAII

```cpp
#include <iostream>
#include <memory>
using namespace std;

class Resource {
public:
    Resource() { cout << "Acquired" << endl; }
    ~Resource() { cout << "Released" << endl; }
};

void useResource() {
    // 使用 unique_ptr 管理资源
    auto ptr = make_unique<Resource>();
    // 离开作用域时自动释放
}

int main() {
    useResource();
    // Resource 已被释放
    return 0;
}
```

## 自定义 RAII 类

```cpp
#include <iostream>
#include <mutex>
using namespace std;

// 自定义锁守卫
class LockGuard {
private:
    mutex& mtx;
public:
    explicit LockGuard(mutex& m) : mtx(m) {
        mtx.lock();
    }

    ~LockGuard() {
        mtx.unlock();
    }

    // 禁止拷贝
    LockGuard(const LockGuard&) = delete;
    LockGuard& operator=(const LockGuard&) = delete;
};

// 使用
mutex myMutex;
void threadSafe() {
    LockGuard lock(myMutex);
    // 临界区 - 自动加锁解锁
}
```

## 文件句柄 RAII

```cpp
#include <iostream>
#include <cstdio>
using namespace std;

class File {
private:
    FILE* file;

public:
    explicit File(const char* path, const char* mode)
        : file(fopen(path, mode)) {}

    ~File() {
        if (file) {
            fclose(file);
        }
    }

    // 禁止拷贝，允许移动
    File(const File&) = delete;
    File& operator=(const File&) = delete;

    File(File&& other) noexcept : file(other.file) {
        other.file = nullptr;
    }

    FILE* get() const { return file; }
};

int main() {
    File f("test.txt", "w");
    fprintf(f.get(), "Hello\n");
    // 自动关闭
    return 0;
}
```

## 练习

1. 使用 RAII 管理数据库连接
2. 实现 Socket 的 RAII 封装
3. 用 RAII 管理 OpenGL 资源

---

[上一节：代码规范](01-code-style.md) | [下一节：现代 C++ 风格](03-modern-cpp.md)
