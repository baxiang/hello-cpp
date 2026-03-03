# 4.1 string_view

## 基础概念

```cpp
#include <iostream>
#include <string>
#include <string_view>
using namespace std;

int main() {
    string str = "Hello, World!";

    // string_view 不拥有数据，只是引用
    string_view sv = str;

    cout << "str: " << str << endl;
    cout << "sv: " << sv << endl;

    // 修改原字符串会影响 view
    str[0] = 'h';
    cout << "sv after modify: " << sv << endl;

    return 0;
}
```

## 性能优势

```cpp
#include <iostream>
#include <string>
#include <string_view>
using namespace std;

// 使用 string（可能涉及拷贝）
void processString(string s) {
    cout << "Processing: " << s << endl;
}

// 使用 string_view（无拷贝）
void processStringView(string_view sv) {
    cout << "Processing: " << sv << endl;
}

int main() {
    string str = "Hello, World!";

    processString(str);       // 可能拷贝
    processString(str.c_str()); // 一定拷贝

    processStringView(str);   // 无拷贝
    processStringView("Hello"); // 无拷贝

    return 0;
}
```

## 常用操作

```cpp
#include <iostream>
#include <string_view>
using namespace std;

int main() {
    string_view sv = "Hello, World!";

    // 基本信息
    cout << "size: " << sv.size() << endl;
    cout << "length: " << sv.length() << endl;
    cout << "empty: " << sv.empty() << endl;

    // 访问
    cout << "first char: " << sv[0] << endl;
    cout << "front: " << sv.front() << endl;
    cout << "back: " << sv.back() << endl;

    // 子串
    string_view sub = sv.substr(7, 5);
    cout << "substr: " << sub << endl;  // World

    // 查找
    cout << "find 'World': " << sv.find("World") << endl;
    cout << "find 'o': " << sv.find('o') << endl;

    // 比较
    string_view sv2 = "Hello, World!";
    cout << "equal: " << (sv == sv2) << endl;

    return 0;
}
```

## 函数参数

```cpp
#include <iostream>
#include <string>
#include <string_view>
#include <vector>
using namespace std;

// 接受 string_view 作为参数
void printNames(vector<string_view> names) {
    for (auto name : names) {
        cout << "Hello, " << name << "!" << endl;
    }
}

int main() {
    vector<string> strings = {"Alice"s, "Bob"s, "Charlie"s};

    // 可以直接传入不同类型的字符串
    printNames({"Alice", "Bob", "Charlie"});
    printNames(strings);

    return 0;
}
```

## 注意事项

```cpp
#include <iostream>
#include <string_view>
using namespace std;

// 错误示例：返回临时字符串的 view
string_view badFunction() {
    string temp = "Hello";
    return temp;  // 危险！temp 在函数结束时销毁
}

// 正确示例
string_view goodFunction(const string& str) {
    return str;  // 安全，生命周期由调用者管理
}

int main() {
    string str = "Hello, World!";

    string_view sv1 = goodFunction(str);
    cout << "sv1: " << sv1 << endl;

    // auto sv2 = badFunction();  // 悬空引用！

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <string>
#include <string_view>
#include <vector>
#include <algorithm>
using namespace std;

// 解析 CSV 行
vector<string_view> parseCSVLine(string_view line) {
    vector<string_view> result;
    size_t start = 0;

    while (start < line.size()) {
        size_t pos = line.find(',', start);
        if (pos == string_view::npos) {
            result.push_back(line.substr(start));
            break;
        }
        result.push_back(line.substr(start, pos - start));
        start = pos + 1;
    }

    return result;
}

// 修剪空格
string_view trim(string_view sv) {
    size_t start = sv.find_first_not_of(" \t\n\r");
    if (start == string_view::npos) return "";

    size_t end = sv.find_last_not_of(" \t\n\r");
    return sv.substr(start, end - start + 1);
}

int main() {
    string csvLine = "Alice, 25, Engineer, New York";
    auto fields = parseCSVLine(csvLine);

    cout << "Parsed fields:" << endl;
    for (const auto& field : fields) {
        cout << "  '" << trim(field) << "'" << endl;
    }

    return 0;
}
```

## 练习

1. 使用 string_view 优化字符串处理函数
2. 实现高效的字符串解析器
3. 比较 string 和 string_view 的性能差异

---

[上一节：文件系统](../../cpp17/3-filesystem/01-basics.md)
