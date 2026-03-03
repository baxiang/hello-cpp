# 1.2 命名空间

## 命名空间定义

```cpp
#include <iostream>

// 定义命名空间
namespace MyCompany {
    int version = 1;

    void print() {
        std::cout << "Version: " << version << std::endl;
    }

    namespace Utils {
        void help() {
            std::cout << "Help" << std::endl;
        }
    }
}

int main() {
    // 使用作用域解析运算符
    std::cout << MyCompany::version << std::endl;
    MyCompany::print();
    MyCompany::Utils::help();

    return 0;
}
```

## using 声明

```cpp
#include <iostream>
using namespace std;

namespace Math {
    const double PI = 3.14159;

    int add(int a, int b) { return a + b; }
    int sub(int a, int b) { return a - b; }
}

int main() {
    // using 声明 - 引入单个名称
    using Math::PI;
    using Math::add;

    cout << "PI: " << PI << endl;
    cout << "3 + 5 = " << add(3, 5) << endl;

    // using directive - 引入整个命名空间
    using namespace Math;
    cout << "sub: " << sub(10, 3) << endl;

    return 0;
}
```

## 命名冲突

```cpp
#include <iostream>
using namespace std;

namespace A {
    void print() { cout << "A::print" << endl; }
}

namespace B {
    void print() { cout << "B::print" << endl; }
}

int main() {
    // 不使用 using namespace 避免冲突
    A::print();
    B::print();

    // 或者使用 using 声明
    using A::print;
    print();  // 调用 A::print

    // 显式调用
    B::print();

    return 0;
}
```

## 标准命名空间

```cpp
#include <iostream>
#include <vector>
#include <string>

// 方式 1：显式限定（推荐）
void method1() {
    std::cout << "Hello" << std::endl;
    std::vector<int> vec;
}

// 方式 2：using 声明（常用）
void method2() {
    using std::cout;
    using std::endl;
    using std::vector;

    cout << "Hello" << endl;
    vector<int> vec;
}

// 方式 3：using 指令（简单程序可用）
using namespace std;

void method3() {
    cout << "Hello" << endl;
    vector<int> vec;
}

int main() {
    method1();
    method2();
    method3();
    return 0;
}
```

## 匿名命名空间

```cpp
#include <iostream>

// 匿名命名空间 - 内部链接
namespace {
    int internalVar = 100;

    void internalFunc() {
        std::cout << "Internal function" << std::endl;
    }
}

int main() {
    // 同一文件内可直接访问
    std::cout << internalVar << std::endl;
    internalFunc();

    return 0;
}
```

## 嵌套命名空间

```cpp
#include <iostream>

// C++11 之前
namespace A {
    namespace B {
        namespace C {
            void print() {
                std::cout << "Nested" << std::endl;
            }
        }
    }
}

// C++17 起
namespace A::B::C {
    void print2() {
        std::cout << "C++17 nested" << std::endl;
    }
}

int main() {
    A::B::C::print();
    A::B::C::print2();
    return 0;
}
```

## 命名空间别名

```cpp
#include <iostream>

namespace VeryLongNamespaceName {
    namespace VeryLongInnerName {
        void print() {
            std::cout << "Hello" << std::endl;
        }
    }
}

// 别名
namespace VL = VeryLongNamespaceName;
namespace VLI = VeryLongNamespaceName::VeryLongInnerName;

int main() {
    VL::VeryLongInnerName::print();
    VLI::print();
    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <string>

namespace Graphics {
    class Renderer {
    public:
        void render() {
            std::cout << "Rendering..." << std::endl;
        }
    };

    namespace OpenGL {
        class Context {
        public:
            void init() {
                std::cout << "OpenGL init" << std::endl;
            }
        };
    }
}

namespace Audio {
    class Player {
    public:
        void play() {
            std::cout << "Playing audio..." << std::endl;
        }
    };
}

int main() {
    Graphics::Renderer renderer;
    renderer.render();

    Graphics::OpenGL::Context ctx;
    ctx.init();

    Audio::Player player;
    player.play();

    return 0;
}
```

## 最佳实践

1. **库代码使用命名空间**
2. **避免 `using namespace std;` 在头文件中**
3. **源文件中可适度使用 using 声明**
4. **使用有意义的命名空间名称**

## 练习

1. 创建包含多个类的命名空间
2. 实现嵌套命名空间
3. 使用命名空间别名简化代码

---

[上一节：C++ 简介](01-intro.md) | [下一节：输入输出](03-io.md)
