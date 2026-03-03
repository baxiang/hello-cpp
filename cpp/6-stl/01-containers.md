# 6.1 STL 容器

## vector - 动态数组

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // 创建
    vector<int> v1;                  // 空向量
    vector<int> v2(5, 10);           // 5 个元素，初始值 10
    vector<int> v3 = {1, 2, 3, 4, 5}; // 初始化列表

    // 添加元素
    v1.push_back(1);
    v1.push_back(2);
    v1.emplace_back(3);  // 原地构造

    // 访问
    cout << "v1[0]: " << v1[0] << endl;
    cout << "v1.at(1): " << v1.at(1) << endl;
    cout << "front: " << v1.front() << endl;
    cout << "back: " << v1.back() << endl;

    // 大小
    cout << "size: " << v1.size() << endl;
    cout << "capacity: " << v1.capacity() << endl;

    // 遍历
    for (int x : v1) {
        cout << x << " ";
    }
    cout << endl;

    // 迭代器
    for (auto it = v1.begin(); it != v1.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;

    // 删除
    v1.pop_back();
    v1.erase(v1.begin());

    // 清空
    v1.clear();

    return 0;
}
```

## list - 双向链表

```cpp
#include <iostream>
#include <list>
using namespace std;

int main() {
    list<int> lst = {1, 2, 3, 4, 5};

    // 添加
    lst.push_front(0);
    lst.push_back(6);

    // 插入
    auto it = lst.begin();
    advance(it, 3);
    lst.insert(it, 100);

    // 删除
    lst.remove(3);      // 删除值为 3 的元素
    lst.pop_front();
    lst.pop_back();

    // 大小
    cout << "Size: " << lst.size() << endl;

    // 遍历
    for (int x : lst) {
        cout << x << " ";
    }
    cout << endl;

    // 排序
    lst.sort();

    // 反转
    lst.reverse();

    return 0;
}
```

## deque - 双端队列

```cpp
#include <iostream>
#include <deque>
using namespace std;

int main() {
    deque<int> dq = {2, 3, 4};

    // 两端添加
    dq.push_front(1);
    dq.push_back(5);

    // 访问
    cout << "front: " << dq.front() << endl;
    cout << "back: " << dq.back() << endl;
    cout << "dq[2]: " << dq[2] << endl;

    // 随机访问迭代器
    for (auto it = dq.begin(); it != dq.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;

    return 0;
}
```

## set / multiset - 集合

```cpp
#include <iostream>
#include <set>
using namespace std;

int main() {
    // set - 不允许重复
    set<int> s = {5, 2, 8, 2, 1, 5};
    // 实际内容：{1, 2, 5, 8}

    cout << "Set contents: ";
    for (int x : s) {
        cout << x << " ";
    }
    cout << endl;

    // 插入
    s.insert(10);
    s.insert(3);

    // 查找
    if (s.find(5) != s.end()) {
        cout << "Found 5" << endl;
    }

    // 计数
    cout << "Count of 2: " << s.count(2) << endl;

    // 删除
    s.erase(5);

    // multiset - 允许重复
    multiset<int> ms = {1, 2, 2, 3};
    cout << "multiset count of 2: " << ms.count(2) << endl;

    return 0;
}
```

## map / multimap - 映射

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    // map - 键值对
    map<string, int> scores;

    // 插入
    scores["Alice"] = 95;
    scores["Bob"] = 87;
    scores.insert({"Charlie", 92});
    scores.emplace("David", 88);

    // 访问
    cout << "Alice: " << scores["Alice"] << endl;
    cout << "Bob: " << scores.at("Bob") << endl;

    // 遍历
    for (const auto& pair : scores) {
        cout << pair.first << ": " << pair.second << endl;
    }

    // 查找
    auto it = scores.find("Charlie");
    if (it != scores.end()) {
        cout << "Found Charlie with score: " << it->second << endl;
    }

    // 删除
    scores.erase("Bob");

    // multimap - 一键多值
    multimap<string, int> mm;
    mm.insert({"subject", 1});
    mm.insert({"subject", 2});
    cout << "multimap count: " << mm.count("subject") << endl;

    return 0;
}
```

## 容器适配器

```cpp
#include <iostream>
#include <stack>
#include <queue>
using namespace std;

int main() {
    // stack - 后进先出
    stack<int> st;
    st.push(1);
    st.push(2);
    st.push(3);

    cout << "Top: " << st.top() << endl;  // 3
    st.pop();
    cout << "Top after pop: " << st.top() << endl;  // 2

    // queue - 先进先出
    queue<int> q;
    q.push(1);
    q.push(2);
    q.push(3);

    cout << "Front: " << q.front() << endl;  // 1
    cout << "Back: " << q.back() << endl;    // 3
    q.pop();
    cout << "Front after pop: " << q.front() << endl;  // 2

    // priority_queue - 优先队列
    priority_queue<int> pq;
    pq.push(3);
    pq.push(1);
    pq.push(4);
    pq.push(1);
    pq.push(5);

    cout << "Priority queue: ";
    while (!pq.empty()) {
        cout << pq.top() << " ";  // 5 4 3 1 1
        pq.pop();
    }
    cout << endl;

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
using namespace std;

// 学生记录
struct Student {
    string name;
    int id;
    double gpa;
};

int main() {
    // 使用 map 管理学生
    map<int, Student> students;

    students[1001] = {"Alice", 1001, 3.8};
    students[1002] = {"Bob", 1002, 3.5};
    students[1003] = {"Charlie", 1003, 3.9};

    // 查找
    auto it = students.find(1002);
    if (it != students.end()) {
        cout << "Found: " << it->second.name
             << " (GPA: " << it->second.gpa << ")" << endl;
    }

    // 遍历
    cout << "\nAll students:" << endl;
    for (const auto& pair : students) {
        cout << pair.second.id << ": "
             << pair.second.name << " - "
             << pair.second.gpa << endl;
    }

    // 使用 vector 存储 GPA 列表
    vector<double> gpas;
    for (const auto& pair : students) {
        gpas.push_back(pair.second.gpa);
    }

    // 排序
    sort(gpas.begin(), gpas.end());

    cout << "\nGPAs sorted: ";
    for (double gpa : gpas) {
        cout << gpa << " ";
    }
    cout << endl;

    // 最高 GPA
    auto maxIt = max_element(gpas.begin(), gpas.end());
    cout << "Highest GPA: " << *maxIt << endl;

    return 0;
}
```

## 练习

1. 使用 vector 实现动态数组
2. 使用 map 实现电话簿
3. 使用 stack 实现括号匹配检查
4. 使用 priority_queue 实现任务调度

---

[上一节：类模板](../../cpp/5-templates/02-class.md) | [下一节：算法](02-algorithms.md)
