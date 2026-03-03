# 3.1 文件系统

## 基础操作

```cpp
#include <iostream>
#include <filesystem>
namespace fs = std::filesystem;

int main() {
    // 当前路径
    fs::path current = fs::current_path();
    cout << "Current path: " << current << endl;

    // 检查路径是否存在
    fs::path test = "test.txt";
    cout << "Exists: " << fs::exists(test) << endl;

    // 检查是否是文件/目录
    cout << "Is file: " << fs::is_regular_file(test) << endl;
    cout << "Is directory: " << fs::is_directory(test) << endl;

    return 0;
}
```

## 路径操作

```cpp
#include <iostream>
#include <filesystem>
namespace fs = std::filesystem;

int main() {
    fs::path p = "/home/user/docs/file.txt";

    cout << "Full path: " << p << endl;
    cout << "Root: " << p.root_path() << endl;
    cout << "Parent: " << p.parent_path() << endl;
    cout << "Filename: " << p.filename() << endl;
    cout << "Stem: " << p.stem() << endl;
    cout << "Extension: " << p.extension() << endl;

    // 路径拼接
    fs::path new_p = fs::path("/home") / "user" / "docs";
    cout << "New path: " << new_p << endl;

    return 0;
}
```

## 目录遍历

```cpp
#include <iostream>
#include <filesystem>
namespace fs = std::filesystem;

int main() {
    // 遍历目录
    fs::path dir = ".";

    cout << "Contents of current directory:" << endl;
    for (const auto& entry : fs::directory_iterator(dir)) {
        cout << "  " << entry.path().filename();
        if (entry.is_directory()) {
            cout << " [DIR]";
        }
        cout << endl;
    }

    // 递归遍历
    cout << "\nRecursive:" << endl;
    for (const auto& entry : fs::recursive_directory_iterator(dir)) {
        cout << "  " << entry.path() << endl;
    }

    return 0;
}
```

## 文件操作

```cpp
#include <iostream>
#include <fstream>
#include <filesystem>
namespace fs = std::filesystem;

int main() {
    fs::path src = "source.txt";
    fs::path dst = "destination.txt";
    fs::path dir = "test_dir";

    // 创建目录
    fs::create_directory(dir);

    // 创建文件
    ofstream(src) << "Hello, Filesystem!";

    // 复制文件
    fs::copy_file(src, dst);

    // 重命名
    fs::rename(dst, "renamed.txt");

    // 获取文件大小
    uintmax_t size = fs::file_size(src);
    cout << "File size: " << size << " bytes" << endl;

    // 删除
    fs::remove(src);
    fs::remove("renamed.txt");
    fs::remove(dir);

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <filesystem>
#include <vector>
#include <algorithm>
namespace fs = std::filesystem;

// 查找特定扩展名的文件
vector<fs::path> findFilesByExtension(
    const fs::path& dir,
    const string& ext
) {
    vector<fs::path> result;

    for (const auto& entry : fs::recursive_directory_iterator(dir)) {
        if (entry.is_regular_file() &&
            entry.path().extension() == ext) {
            result.push_back(entry.path());
        }
    }

    return result;
}

// 计算目录大小
uintmax_t calculateDirSize(const fs::path& dir) {
    uintmax_t total = 0;

    for (const auto& entry : fs::recursive_directory_iterator(dir)) {
        if (entry.is_regular_file()) {
            total += entry.file_size();
        }
    }

    return total;
}

int main() {
    fs::path current = fs::current_path();

    // 查找所有 .cpp 文件
    auto cppFiles = findFilesByExtension(current, ".cpp");
    cout << "Found " << cppFiles.size() << " .cpp files:" << endl;
    for (const auto& f : cppFiles) {
        cout << "  " << f << endl;
    }

    // 计算目录大小
    uintmax_t size = calculateDirSize(current);
    cout << "\nTotal size: " << size << " bytes" << endl;

    // 目录信息
    cout << "\nDirectory info:" << endl;
    cout << "  Path: " << current << endl;
    cout << "  Exists: " << fs::exists(current) << endl;
    cout << "  Is directory: " << fs::is_directory(current) << endl;

    return 0;
}
```

## 练习

1. 编写程序统计目录下各类文件数量
2. 实现简单的文件备份工具
3. 查找并删除空目录

---

[上一节：variant](../../cpp17/2-optional-variant/02-variant.md) | [下一节：string_view](../../cpp17/4-string-view/01-basics.md)
