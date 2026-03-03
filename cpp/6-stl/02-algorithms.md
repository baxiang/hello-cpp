# 6.2 STL 算法

## 非修改性算法

### find / find_if

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};

    // find
    auto it = find(nums.begin(), nums.end(), 3);
    if (it != nums.end()) {
        cout << "Found: " << *it << endl;
    }

    // find_if
    auto it2 = find_if(nums.begin(), nums.end(),
        [](int x) { return x > 3; });
    if (it2 != nums.end()) {
        cout << "First > 3: " << *it2 << endl;
    }

    return 0;
}
```

### count / count_if

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 2, 3, 2, 4};

    // count
    int c = count(nums.begin(), nums.end(), 2);
    cout << "Count of 2: " << c << endl;

    // count_if
    int evenCount = count_if(nums.begin(), nums.end(),
        [](int x) { return x % 2 == 0; });
    cout << "Even numbers: " << evenCount << endl;

    return 0;
}
```

## 修改性算法

### copy / transform

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> src = {1, 2, 3, 4, 5};
    vector<int> dest(src.size());

    // copy
    copy(src.begin(), src.end(), dest.begin());

    // transform
    transform(src.begin(), src.end(), src.begin(),
        [](int x) { return x * x; });

    cout << "Squared: ";
    for (int x : src) {
        cout << x << " ";
    }
    cout << endl;

    return 0;
}
```

### replace / replace_if

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 2, 4, 2};

    // replace
    replace(nums.begin(), nums.end(), 2, 99);

    // replace_if
    replace_if(nums.begin(), nums.end(),
        [](int x) { return x > 50; }, 0);

    for (int x : nums) {
        cout << x << " ";
    }
    cout << endl;

    return 0;
}
```

### remove / remove_if

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 2, 4, 2};

    // remove 返回新结尾
    auto newEnd = remove(nums.begin(), nums.end(), 2);

    // 实际删除
    nums.erase(newEnd, nums.end());

    cout << "After remove: ";
    for (int x : nums) {
        cout << x << " ";
    }
    cout << endl;

    return 0;
}
```

## 排序算法

### sort

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9, 3};

    // 升序
    sort(nums.begin(), nums.end());

    // 降序
    sort(nums.begin(), nums.end(), greater<int>());

    // 自定义比较
    sort(nums.begin(), nums.end(),
        [](int a, int b) { return a % 10 < b % 10; });

    return 0;
}
```

### partial_sort / nth_element

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4};

    // partial_sort - 部分排序
    partial_sort(nums.begin(), nums.begin() + 3, nums.end());
    cout << "Top 3: ";
    for (int i = 0; i < 3; i++) {
        cout << nums[i] << " ";
    }
    cout << endl;

    // nth_element - 第 n 个元素
    nth_element(nums.begin(), nums.begin() + 3, nums.end());
    cout << "4th smallest: " << nums[3] << endl;

    return 0;
}
```

## 其他算法

### for_each

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};

    // for_each
    for_each(nums.begin(), nums.end(),
        [](int& x) {
            cout << x << " ";
            x *= 2;
        });
    cout << endl;

    // C++11 范围 for
    for (int x : nums) {
        cout << x << " ";
    }
    cout << endl;

    return 0;
}
```

### merge

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v1 = {1, 3, 5, 7};
    vector<int> v2 = {2, 4, 6, 8};
    vector<int> result(v1.size() + v2.size());

    // merge - 合并两个有序序列
    merge(v1.begin(), v1.end(),
          v2.begin(), v2.end(),
          result.begin());

    cout << "Merged: ";
    for (int x : result) {
        cout << x << " ";
    }
    cout << endl;

    return 0;
}
```

### accumulate（numeric 头文件）

```cpp
#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};

    // 求和
    int sum = accumulate(nums.begin(), nums.end(), 0);
    cout << "Sum: " << sum << endl;

    // 累积乘积
    int product = accumulate(nums.begin(), nums.end(), 1,
        [](int a, int b) { return a * b; });
    cout << "Product: " << product << endl;

    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6};

    cout << "Original: ";
    for (int x : nums) cout << x << " ";
    cout << endl;

    // 排序
    sort(nums.begin(), nums.end());
    cout << "Sorted: ";
    for (int x : nums) cout << x << " ";
    cout << endl;

    // 反转
    reverse(nums.begin(), nums.end());
    cout << "Reversed: ";
    for (int x : nums) cout << x << " ";
    cout << endl;

    // 求和
    int sum = accumulate(nums.begin(), nums.end(), 0);
    cout << "Sum: " << sum << endl;

    // 查找第一个偶数
    auto it = find_if(nums.begin(), nums.end(),
        [](int x) { return x % 2 == 0; });
    if (it != nums.end()) {
        cout << "First even: " << *it << endl;
    }

    // 统计大于 5 的个数
    int count = count_if(nums.begin(), nums.end(),
        [](int x) { return x > 5; });
    cout << "Count > 5: " << count << endl;

    // 平方
    vector<int> squared(nums.size());
    transform(nums.begin(), nums.end(), squared.begin(),
        [](int x) { return x * x; });
    cout << "Squared: ";
    for (int x : squared) cout << x << " ";
    cout << endl;

    return 0;
}
```

## 练习

1. 使用算法实现去重
2. 使用 sort 实现自定义排序
3. 使用 find_if 查找满足条件的元素
4. 使用 accumulate 计算平均值

---

[上一节：容器](01-containers.md) | [下一节：异常处理](../../cpp/7-exceptions/01-basics.md)
