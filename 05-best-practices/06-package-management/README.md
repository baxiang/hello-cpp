# 6. 包管理

C++ 长期以来缺乏官方的包管理工具，但近年来出现了多个优秀的第三方包管理器。本章节介绍现代 C++ 包管理的常用工具和最佳实践。

## 为什么需要包管理？

在没有包管理器之前，C++ 项目的依赖管理通常很痛苦：

- **手动下载**：手动下载源代码并编译
- **路径配置**：配置复杂的头文件搜索路径
- **传递依赖**：处理依赖的依赖
- **版本管理**：管理不同版本的库
- **跨平台**：跨平台共享依赖配置

包管理器可以自动解决这些问题，大幅提升开发效率。

## 主流 C++ 包管理器

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| **Conan** | 跨平台、包数量多、二进制缓存 | 商业项目、复杂依赖 |
| **vcpkg** | 微软开发、VS 集成好 | Windows 项目、微软生态 |
| **FetchContent** | CMake 内置、无需额外工具 | 小型项目、简单依赖 |

## 章节导航

| 文档 | 内容 |
|------|------|
| [01-introduction.md](01-introduction.md) | 包管理概述、工具对比、选择建议 |
| [02-conan.md](02-conan.md) | Conan 安装、配置、CMake 集成、发布包 |
| [03-vcpkg.md](03-vcpkg.md) | vcpkg 安装、配置、CMake 集成、清单模式 |
| [04-fetchcontent.md](04-fetchcontent.md) | FetchContent 基础、常用库示例、高级用法 |
| [05-best-practices.md](05-best-practices.md) | 版本锁定、CI/CD 缓存、团队协作 |

## 快速开始

### 使用 FetchContent（最简单）

```cmake
include(FetchContent)

FetchContent_Declare(
    fmt
    GIT_REPOSITORY https://github.com/fmtlib/fmt.git
    GIT_TAG 10.1.0
)
FetchContent_MakeAvailable(fmt)

target_link_libraries(myapp PRIVATE fmt::fmt)
```

### 使用 Conan

```bash
# 安装 Conan
pip install conan

# 创建 conanfile.txt
echo "[requires]
fmt/10.1.0
[generators]
CMakeDeps
CMakeToolchain" > conanfile.txt

# 安装依赖
conan install . --output-folder=build --build=missing

# 构建
cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=build/conan_toolchain.cmake
cmake --build build
```

### 使用 vcpkg

```bash
# 安装 vcpkg
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg && ./bootstrap-vcpkg.sh

# 安装依赖
./vcpkg install fmt

# 构建
cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=vcpkg/scripts/buildsystems/vcpkg.cmake
cmake --build build
```

## 学习路径

```
包管理概述 → Conan/vcpkg/FetchContent 选择 → 学习具体工具 → 最佳实践
```

## 相关章节

- [7. CMake 完全指南](../07-cmake-guide/README.md) - CMake 与包管理集成
- [8. VSCode 容器化开发环境](../08-dev-container/README.md) - 容器中的包管理配置