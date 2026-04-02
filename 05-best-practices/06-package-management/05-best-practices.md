# 5. 包管理最佳实践

本章介绍 C++ 包管理的最佳实践，包括版本锁定、CI/CD 集成和团队协作。

## 5.1 版本锁定

### 为什么需要版本锁定？

不锁定版本的风险：

```
第一天：项目正常工作
第二天：依赖库更新了 API
第三天：项目构建失败
```

### Conan 版本锁定

**使用 lockfile：**

```bash
# 创建 lockfile
conan lock create conanfile.py --lockfile-out=conan.lock

# 使用 lockfile 安装
conan install . --lockfile=conan.lock
```

**conanfile.py 版本约束：**

```python
class MyProjectConan(ConanFile):
    requirements = [
        "fmt/10.1.0",           # 精确版本
        "nlohmann_json/[>=3.11]",  # 最低版本
        "boost/[~1.81]",        # 兼容版本（1.81.x）
    ]
```

### vcpkg 版本锁定

**vcpkg.json 版本约束：**

```json
{
  "dependencies": [
    {
      "name": "fmt",
      "version>=": "10.1.0"
    },
    {
      "name": "nlohmann-json",
      "version>=": "3.11.0"
    }
  ],
  "builtin-baseline": "2023.11.01"
}
```

**锁定到具体版本：**

```json
{
  "dependencies": [
    {
      "name": "fmt",
      "version>=": "10.1.0",
      "version<": "11.0.0"
    }
  ]
}
```

### FetchContent 版本锁定

```cmake
# 好的做法：使用具体版本标签
FetchContent_Declare(
    fmt
    GIT_TAG 10.1.0
)

# 或使用提交哈希（最精确）
FetchContent_Declare(
    fmt
    GIT_TAG a1b2c3d4e5f6...
)

# 避免：使用分支名
FetchContent_Declare(
    fmt
    GIT_TAG main  # 不推荐
)
```

## 5.2 CI/CD 集成

### GitHub Actions - Conan

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install Conan
        run: pip install conan

      - name: Configure Conan
        run: conan profile detect

      - name: Cache Conan packages
        uses: actions/cache@v3
        with:
          path: ~/.conan2/p
          key: ${{ runner.os }}-conan-${{ hashFiles('conanfile.txt') }}
          restore-keys: |
            ${{ runner.os }}-conan-

      - name: Install dependencies
        run: conan install . --output-folder=build --build=missing

      - name: Build
        run: |
          cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=build/conan_toolchain.cmake
          cmake --build build
```

### GitHub Actions - vcpkg

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    env:
      VCPKG_ROOT: ${{ github.workspace }}/vcpkg

    steps:
      - uses: actions/checkout@v4

      - name: Setup vcpkg
        run: |
          git clone https://github.com/Microsoft/vcpkg.git
          ./vcpkg/bootstrap-vcpkg.sh

      - name: Cache vcpkg packages
        uses: actions/cache@v3
        with:
          path: |
            ${{ env.VCPKG_ROOT }}/installed
            ~/.cache/vcpkg
          key: ${{ runner.os }}-vcpkg-${{ hashFiles('vcpkg.json') }}

      - name: Build
        run: |
          cmake -S . -B build \
            -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake
          cmake --build build
```

### GitHub Actions - FetchContent

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Cache FetchContent
        uses: actions/cache@v3
        with:
          path: |
            build/_deps
            ~/.cache/cmake
          key: ${{ runner.os }}-cmake-${{ hashFiles('CMakeLists.txt') }}

      - name: Build
        run: |
          cmake -S . -B build
          cmake --build build
```

### GitLab CI - Conan

```yaml
build:
  image: conanio/gcc11
  stage: build

  cache:
    paths:
      - ~/.conan2/p/

  script:
    - conan profile detect
    - conan install . --output-folder=build --build=missing
    - cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=build/conan_toolchain.cmake
    - cmake --build build

  artifacts:
    paths:
      - build/myapp
```

## 5.3 团队协作

### 统一包管理器选择

团队应统一选择一种包管理器：

```
团队决策流程：
1. 评估项目需求
2. 评估团队技能
3. 选择 Conan/vcpkg/FetchContent
4. 编写团队文档
5. 培训团队成员
```

### 共享配置文件

**Conan：**
```
项目根目录/
├── conanfile.txt 或 conanfile.py
├── conan.lock（提交到 git）
└── profiles/
    ├── debug
    └── release
```

**vcpkg：**
```
项目根目录/
├── vcpkg.json（提交到 git）
├── vcpkg-configuration.json（如有私有仓库）
└── .env 或 CMakePresets.json（设置 VCPKG_ROOT）
```

### 环境一致性

**开发环境文档：**

```markdown
## 开发环境设置

1. 安装 Conan: `pip install conan`
2. 配置 profile: `conan profile detect`
3. 安装依赖: `conan install . --build=missing`
4. 构建: `cmake --preset conan-default`
```

**Docker 开发环境：**

```dockerfile
FROM conanio/gcc11-ubuntu16.04

WORKDIR /workspace

# 安装项目依赖
COPY conanfile.txt .
RUN conan install . --build=missing

# 复制源码
COPY . .

# 构建
RUN cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=build/conan_toolchain.cmake
RUN cmake --build build
```

## 5.4 私有依赖管理

### Conan 私有仓库

**搭建 Artifactory 仓库：**

```bash
# 添加私有仓库
conan remote add mycompany https://conan.mycompany.com

# 上传私有包
conan upload mylib/1.0.0 --remote=mycompany
```

**conanfile.py：**

```python
class MyProjectConan(ConanFile):
    requirements = [
        "fmt/10.1.0@_/_",           # Conan Center
        "mylib/1.0.0@mycompany/_",  # 私有仓库
    ]
```

### vcpkg 私有仓库

**创建私有仓库：**

```
my-vcpkg-registry/
├── ports/
│   └── mylib/
│       ├── portfile.cmake
│       └── vcpkg.json
├── versions/
│   └── mylib.json
└── baseline.json
```

**vcpkg-configuration.json：**

```json
{
  "registries": [
    {
      "kind": "git",
      "repository": "https://github.com/mycompany/vcpkg-registry",
      "baseline": "main",
      "packages": ["mylib", "*"]
    }
  ],
  "default-registry": {
    "kind":builtin"
  }
}
```

### FetchContent 私有库

```cmake
# 私有 Git 仓库
FetchContent_Declare(
    mylib
    GIT_REPOSITORY https://github.com/mycompany/mylib.git
    GIT_TAG        v1.0.0
)

# 或需要认证的仓库
FetchContent_Declare(
    mylib
    GIT_REPOSITORY https://user:token@github.com/mycompany/mylib.git
    GIT_TAG        v1.0.0
)
```

## 5.5 依赖更新策略

### 定期更新

```
更新策略：
1. 每月检查依赖更新
2. 在单独分支测试更新
3. 通过所有测试后合并
4. 更新 lockfile
```

### 安全更新

```bash
# 检查安全漏洞（Conan）
conan audit

# 或使用外部工具
# GitHub Dependabot
# Snyk
```

### 更新流程

```bash
# Conan 更新
conan install . --update
conan lock create conanfile.py --lockfile-out=conan.lock

# vcpkg 更新
cd vcpkg && git pull
./bootstrap-vcpkg.sh
./vcpkg upgrade --no-dry-run

# FetchContent 更新
# 修改 GIT_TAG 到新版本
```

## 5.6 常见问题解决

### 版本冲突

```
问题：库 A 需要 fmt/9.x，库 B 需要 fmt/10.x

解决方案：
1. Conan：使用版本范围或覆盖
2. vcpkg：只能使用一个版本
3. FetchContent：手动协调
```

**Conan 版本覆盖：**

```python
class MyProjectConan(ConanFile):
    requirements = [
        "fmt/10.1.0",
        "libA/1.0.0",  # 需要 fmt/9.x
    ]

    def requirements(self):
        # 强制所有依赖使用 fmt/10.x
        self.requires("fmt/10.1.0", override=True)
```

### 构建失败

```bash
# Conan：清除缓存重试
conan remove "*" -c
conan install . --build=missing

# vcpkg：清除并重建
./vcpkg remove fmt
rm -rf installed/
./vcpkg install fmt
```

### 网络问题

```bash
# Conan：使用镜像
conan remote add mirror https://conan-mirror.example.com

# vcpkg：设置代理
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
```

## 5.7 总结

### 最佳实践清单

| 实践 | 说明 |
|------|------|
| 锁定版本 | 使用 lockfile 或具体版本号 |
| CI/CD 缓存 | 利用缓存加速构建 |
| 团队统一 | 统一包管理器和配置 |
| 定期更新 | 定期检查并更新依赖 |
| 安全检查 | 检查依赖安全漏洞 |
| 文档记录 | 记录依赖管理流程 |

### 推荐流程

```
新项目启动：
1. 选择包管理器（根据项目规模）
2. 创建依赖配置文件
3. 设置 CI/CD 缓存
4. 编写开发环境文档

日常开发：
1. 使用 lockfile 确保一致性
2. 定期更新依赖
3. 监控安全漏洞

发布前：
1. 确认所有依赖版本
2. 更新 lockfile
3. 测试所有平台
```

## 附录：常用包列表

| 库 | Conan | vcpkg | FetchContent URL |
|----|-------|-------|------------------|
| fmt | fmt/10.1.0 | fmt | github.com/fmtlib/fmt |
| nlohmann_json | nlohmann_json/3.11.2 | nlohmann-json | github.com/nlohmann/json |
| spdlog | spdlog/1.12.0 | spdlog | github.com/gabime/spdlog |
| GoogleTest | gtest/1.14.0 | gtest | github.com/google/googletest |
| Catch2 | catch2/3.5.0 | catch2 | github.com/catchorg/Catch2 |
| Boost | boost/1.81.0 | boost | （建议用 Conan/vcpkg） |
| OpenSSL | openssl/3.1.0 | openssl | （建议用 Conan/vcpkg） |