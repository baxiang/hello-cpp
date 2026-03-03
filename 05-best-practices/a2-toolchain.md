# 附录 2. 编译工具链

## GCC 编译选项

```bash
# 基本编译
g++ -o program main.cpp

# 显示警告
g++ -Wall -Wextra -Wpedantic -o program main.cpp

# 调试版本
g++ -g -o program main.cpp

# 发布版本（优化）
g++ -O2 -o program main.cpp

# C++ 标准
g++ -std=c++17 -o program main.cpp

# 生成依赖
g++ -MMD -MP -o program main.cpp

# 完整编译命令
g++ -std=c++17 -Wall -Wextra -O2 -o program main.cpp
```

## CMake 基础

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.10)
project(MyProject VERSION 1.0)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 17)

# 创建可执行文件
add_executable(myapp main.cpp utils.cpp)

# 添加头文件目录
target_include_directories(myapp PRIVATE include/)

# 链接库
target_link_libraries(myapp PRIVATE pthread)

# 编译选项
target_compile_options(myapp PRIVATE -Wall -Wextra)
```

### 构建命令

```bash
# 创建构建目录
mkdir build && cd build

# 配置
cmake ..

# 构建
cmake --build .

# 或
make
```

## Makefile 示例

```makefile
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra
SRCS = main.cpp utils.cpp
OBJS = $(SRCS:.cpp=.o)
TARGET = myapp

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)

.PHONY: all clean
```

## 练习

1. 编写 CMake 构建你的项目
2. 配置编译警告选项
3. 创建调试和发布版本

---

[上一节：设计模式](a1-design-patterns.md) | [下一节：调试技巧](a3-debugging.md)
