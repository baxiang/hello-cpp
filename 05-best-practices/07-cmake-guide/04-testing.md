# 4. 测试集成

本章介绍如何在 CMake 项目中集成测试框架。

## 4.1 CTest 基础

CTest 是 CMake 内置的测试工具，支持运行和管理测试。

### 启用测试

```cmake
# 在根目录 CMakeLists.txt 中
enable_testing()

# 或使用条件
option(BUILD_TESTS "Build tests" ON)
if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()
```

### 添加测试

```cmake
# 基本测试
add_test(NAME MyTest COMMAND myapp --test)

# 测试可执行文件
add_executable(test_app test_main.cpp)
add_test(NAME UnitTest COMMAND test_app)

# 使用测试属性
set_tests_properties(MyTest PROPERTIES
    TIMEOUT 30           # 超时时间（秒）
    LABELS "unit"        # 测试标签
    WILL_FAIL TRUE       # 预期失败
)
```

### 运行测试

```bash
# 运行所有测试
ctest

# 详细输出
ctest -V

# 运行特定测试
ctest -R MyTest         # 正则匹配测试名
ctest -L unit           # 按标签运行

# 并行运行
ctest -j 4

# 输出到文件
ctest -T Test           # 生成测试报告
```

### 测试结果

```bash
# 查看测试结果
ctest -N                # 显示测试数量
ctest --show-only       # 显示测试命令

# 测试输出目录
build/Testing/Temporary/
```

## 4.2 GoogleTest 集成

GoogleTest 是最流行的 C++ 测试框架。

### 使用 FetchContent（推荐）

```cmake
include(FetchContent)
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG v1.14.0
)
# Windows: 防止覆盖父项目的编译器/链接器设置
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# 创建测试可执行文件
add_executable(tests test_main.cpp)
target_link_libraries(tests PRIVATE gtest_main)

# 自动发现测试
include(GoogleTest)
gtest_discover_tests(tests)
```

### 使用 find_package

```cmake
# 需要预先安装 GoogleTest
find_package(GTest REQUIRED)

add_executable(tests test_main.cpp)
target_link_libraries(tests PRIVATE GTest::gtest_main)

include(GoogleTest)
gtest_discover_tests(tests)
```

### 测试示例

```cpp
// test_main.cpp
#include <gtest/gtest.h>

// 简单测试
TEST(MathTest, Add) {
    EXPECT_EQ(2 + 3, 5);
    EXPECT_EQ(-1 + 1, 0);
}

TEST(MathTest, Multiply) {
    EXPECT_EQ(2 * 3, 6);
    EXPECT_NE(2 * 3, 5);
}

// 测试夹具（Test Fixture）
class VectorTest : public ::testing::Test {
protected:
    std::vector<int> vec;

    void SetUp() override {
        vec = {1, 2, 3, 4, 5};
    }

    void TearDown() override {
        vec.clear();
    }
};

TEST_F(VectorTest, Size) {
    EXPECT_EQ(vec.size(), 5);
}

TEST_F(VectorTest, PushBack) {
    vec.push_back(6);
    EXPECT_EQ(vec.size(), 6);
}

// 参数化测试
class ParamTest : public ::testing::TestWithParam<int> {};

TEST_P(ParamTest, Positive) {
    int value = GetParam();
    EXPECT_GT(value, 0);
}

INSTANTIATE_TEST_SUITE_P(
    PositiveValues,
    ParamTest,
    ::testing::Values(1, 2, 3, 4, 5)
);

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
```

### gtest_discover_tests

```cmake
# 自动发现 GoogleTest 测试
include(GoogleTest)
gtest_discover_tests(tests
    PROPERTIES
        TIMEOUT 30
        LABELS "unit"
    # 设置环境变量
    ENVIRONMENT "MY_VAR=value"
)
```

## 4.3 Catch2 集成

Catch2 是另一个流行的测试框架，语法更简洁。

### 使用 FetchContent

```cmake
FetchContent_Declare(
    catch2
    GIT_REPOSITORY https://github.com/catchorg/Catch2.git
    GIT_TAG v3.5.0
)
FetchContent_MakeAvailable(catch2)

add_executable(tests test_main.cpp)
target_link_libraries(tests PRIVATE Catch2::Catch2)

include(Catch)
catch_discover_tests(tests)
```

### 测试示例

```cpp
// test_main.cpp
#include <catch2/catch_test_macros.hpp>

TEST_CASE("Math operations", "[math]") {
    SECTION("Addition") {
        REQUIRE(2 + 3 == 5);
        REQUIRE(-1 + 1 == 0);
    }

    SECTION("Multiplication") {
        REQUIRE(2 * 3 == 6);
    }
}

TEST_CASE("Vector operations", "[vector]") {
    std::vector<int> vec = {1, 2, 3};

    REQUIRE(vec.size() == 3);

    SECTION("Push back") {
        vec.push_back(4);
        REQUIRE(vec.size() == 4);
    }

    SECTION("Clear") {
        vec.clear();
        REQUIRE(vec.empty());
    }
}

// BDD 风格测试
SCENARIO("Vector can be resized", "[vector]") {
    GIVEN("A vector with some items") {
        std::vector<int> v(5);

        REQUIRE(v.size() == 5);

        WHEN("the size is increased") {
            v.resize(10);

            THEN("the size changes") {
                REQUIRE(v.size() == 10);
            }
        }

        WHEN("the size is reduced") {
            v.resize(0);

            THEN("the size changes") {
                REQUIRE(v.size() == 0);
            }
        }
    }
}
```

## 4.4 测试项目结构

```
my-project/
├── CMakeLists.txt
├── src/
│   ├── CMakeLists.txt
│   ├── main.cpp
│   └── utils.cpp
├── include/
│   └── utils.h
└── tests/
    ├── CMakeLists.txt
    ├── test_main.cpp
    └── test_utils.cpp
```

### tests/CMakeLists.txt

```cmake
# 查找或下载 GoogleTest
include(FetchContent)
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG v1.14.0
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# 创建测试可执行文件
add_executable(tests
    test_main.cpp
    test_utils.cpp
)

# 链接被测试的库
target_link_libraries(tests PRIVATE
    mylib           # 被测试的库
    gtest_main      # GoogleTest
)

# 包含头文件
target_include_directories(tests PRIVATE
    ${CMAKE_SOURCE_DIR}/include
)

# 自动发现测试
include(GoogleTest)
gtest_discover_tests(tests
    PROPERTIES
        TIMEOUT 30
    LABELS
        unit
)
```

## 4.5 测试覆盖率

### 启用覆盖率

```cmake
# Debug 模式启用覆盖率
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    target_compile_options(mylib PRIVATE --coverage -O0 -g)
    target_link_options(mylib PRIVATE --coverage)
endif()
```

### 生成覆盖率报告

```bash
# 运行测试
ctest

# 生成覆盖率数据
gcov *.cpp

# 生成 HTML 报告（使用 lcov）
lcov --capture --directory . --output-file coverage.info
genhtml coverage.info --output-directory coverage_report
```

### CMake 集成 lcov

```cmake
# 添加覆盖率目标
find_program(LCOV_PATH lcov)
find_program(GENHTML_PATH genhtml)

if(LCOV_PATH AND GENHTML_PATH)
    add_custom_target(coverage
        COMMAND ${LCOV_PATH} --capture --directory ${CMAKE_BINARY_DIR} --output-file coverage.info
        COMMAND ${GENHTML_PATH} coverage.info --output-directory ${CMAKE_BINARY_DIR}/coverage_report
        WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
        COMMENT "Generating coverage report"
    )
endif()
```

## 4.6 测试属性详解

```cmake
set_tests_properties(MyTest PROPERTIES
    # 超时设置
    TIMEOUT 60                    # 60秒超时

    # 标签
    LABELS "unit;integration"     # 多个标签

    # 预期结果
    WILL_FAIL TRUE                # 预期失败
    PASS_REGULAR_EXPRESSION "OK"  # 输出匹配正则
    FAIL_REGULAR_EXPRESSION "ERROR"

    # 环境变量
    ENVIRONMENT "PATH=/usr/bin"

    # 依赖
    DEPENDS SetupTest             # 依赖其他测试

    # 资源
    RESOURCE_LOCK file_lock       # 资源锁
    PROCESSORS 2                  # 需要的处理器数
)
```

## 4.7 测试夹具（Setup/TearDown）

```cmake
# 创建测试夹具可执行文件
add_executable(test_fixture fixture.cpp)
add_test(NAME SetupFixture COMMAND test_fixture --setup)
add_test(NAME TearDownFixture COMMAND test_fixture --teardown)

# 设置依赖
set_tests_properties(MyTest PROPERTIES
    DEPENDS SetupFixture
    FIXTURES_SETUP MyFixture
)

set_tests_properties(TearDownFixture PROPERTIES
    FIXTURES_CLEANUP MyFixture
)
```

## 4.8 测试最佳实践

### 测试命名

```cmake
# 使用清晰的测试名
add_test(NAME Math_Add COMMAND test_math --test-add)
add_test(NAME Math_Subtract COMMAND test_math --test-subtract)

# 使用标签分类
set_tests_properties(Math_Add PROPERTIES LABELS "math;unit")
```

### 测试隔离

```cmake
# 每个测试独立
add_executable(test_unit test_unit.cpp)
add_executable(test_integration test_integration.cpp)

gtest_discover_tests(test_unit LABELS "unit")
gtest_discover_tests(test_integration LABELS "integration")
```

### 测试数据

```cmake
# 复制测试数据
configure_file(
    ${CMAKE_SOURCE_DIR}/tests/data/test_input.txt
    ${CMAKE_BINARY_DIR}/tests/test_input.txt
    COPYONLY
)

# 或使用资源
set_tests_properties(DataTest PROPERTIES
    RESOURCE_FILES test_input.txt
)
```

## 4.9 实践练习

### 练习 1：基本测试

创建简单的测试项目：

- 使用 CTest 添加测试
- 测试可执行文件输出

### 练习 2：GoogleTest

使用 GoogleTest 测试数学函数：

- 测试 add、subtract、multiply
- 使用 EXPECT_EQ、EXPECT_NE

### 练习 3：测试夹具

使用测试夹具测试类：

- SetUp 初始化对象
- TearDown 清理资源

## 下一步

掌握测试集成后，继续阅读 [05-cross-platform.md](05-cross-platform.md) 学习跨平台构建。