# 5.1 多线程基础

## thread 基础

```cpp
#include <iostream>
#include <thread>
using namespace std;

void hello() {
    cout << "Hello from thread!" << endl;
}

int main() {
    thread t(hello);
    t.join();  // 等待线程完成

    cout << "Main thread" << endl;
    return 0;
}
```

## 带参数的线程

```cpp
#include <iostream>
#include <thread>
using namespace std;

void greet(const string& name, int times) {
    for (int i = 0; i < times; i++) {
        cout << "Hello, " << name << "!" << endl;
    }
}

int main() {
    thread t(greet, "Alice", 3);
    t.join();

    return 0;
}
```

## mutex 和 lock_guard

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <vector>
using namespace std;

mutex mtx;
int shared_value = 0;

void increment() {
    for (int i = 0; i < 1000; i++) {
        lock_guard<mutex> lock(mtx);
        shared_value++;
    }
}

int main() {
    vector<thread> threads;

    for (int i = 0; i < 10; i++) {
        threads.emplace_back(increment);
    }

    for (auto& t : threads) {
        t.join();
    }

    cout << "Final value: " << shared_value << endl;
    return 0;
}
```

## unique_lock

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
using namespace std;

mutex mtx;
condition_variable cv;
bool ready = false;

void worker(int id) {
    unique_lock<mutex> lock(mtx);
    cv.wait(lock, [] { return ready; });
    cout << "Worker " << id << " starting" << endl;
    lock.unlock();

    // 执行工作...
}

int main() {
    thread workers[5];

    for (int i = 0; i < 5; i++) {
        workers[i] = thread(worker, i);
    }

    this_thread::sleep_for(chrono::seconds(1));

    {
        lock_guard<mutex> lock(mtx);
        ready = true;
    }
    cv.notify_all();

    for (auto& t : workers) {
        t.join();
    }

    return 0;
}
```

## atomic

```cpp
#include <iostream>
#include <thread>
#include <atomic>
#include <vector>
using namespace std;

atomic<int> counter(0);

void increment() {
    for (int i = 0; i < 1000; i++) {
        counter++;
    }
}

int main() {
    vector<thread> threads;

    for (int i = 0; i < 10; i++) {
        threads.emplace_back(increment);
    }

    for (auto& t : threads) {
        t.join();
    }

    cout << "Counter: " << counter << endl;
    return 0;
}
```

## 完整示例

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <vector>
#include <queue>
#include <chrono>
using namespace std;

class ThreadPool {
private:
    vector<thread> workers;
    queue<function<void()>> tasks;
    mutex queue_mutex;
    condition_variable condition;
    bool stop = false;

public:
    ThreadPool(size_t threads) {
        for (size_t i = 0; i < threads; ++i) {
            workers.emplace_back([this] {
                while (true) {
                    function<void()> task;
                    {
                        unique_lock<mutex> lock(queue_mutex);
                        condition.wait(lock, [this] {
                            return stop || !tasks.empty();
                        });

                        if (stop && tasks.empty()) return;

                        task = move(tasks.front());
                        tasks.pop();
                    }
                    task();
                }
            });
        }
    }

    template<class F>
    void enqueue(F&& f) {
        {
            unique_lock<mutex> lock(queue_mutex);
            tasks.emplace(forward<F>(f));
        }
        condition.notify_one();
    }

    ~ThreadPool() {
        {
            unique_lock<mutex> lock(queue_mutex);
            stop = true;
        }
        condition.notify_all();
        for (thread& worker : workers) {
            worker.join();
        }
    }
};

int main() {
    ThreadPool pool(4);

    for (int i = 0; i < 8; i++) {
        pool.enqueue([i] {
            cout << "Task " << i << " running on thread "
                 << this_thread::get_id() << endl;
            this_thread::sleep_for(chrono::milliseconds(100));
        });
    }

    this_thread::sleep_for(chrono::seconds(1));
    return 0;
}
```

## 练习

1. 创建两个线程，一个打印奇数，一个打印偶数
2. 实现生产者 - 消费者模式
3. 使用 atomic 实现计数器

---

[上一节：Lambda 表达式](../../cpp11/4-lambda/01-basics.md) | [下一节：结构化绑定](../../cpp17/1-structured-bindings/01-basics.md)
