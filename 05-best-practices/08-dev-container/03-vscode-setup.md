# 3. VSCode C++ 扩展配置

本章详细介绍 VSCode 中 C++ 开发相关的扩展配置，包括代码提示、调试、格式化等功能。

## 3.1 必备扩展

### C/C++ 扩展

**扩展 ID：** `ms-vscode.cpptools`

这是微软官方的 C/C++ 扩展，提供：
- IntelliSense 代码提示
- 代码导航（跳转定义、查找引用）
- 调试支持
- 代码格式化

```bash
# 命令行安装
code --install-extension ms-vscode.cpptools
```

### CMake Tools

**扩展 ID：** `ms-vscode.cmake-tools`

提供 CMake 项目支持：
- CMake 配置和构建
- CMake Kits 选择
- 调试目标管理

```bash
code --install-extension ms-vscode.cmake-tools
```

### C/C++ Extension Pack

**扩展 ID：** `ms-vscode.cpptools-extension-pack`

扩展包，包含多个实用扩展：
- C/C++ (ms-vscode.cpptools)
- C/C++ Themes (ms-vscode.cpptools-themes)
- CMake (twxs.cmake)
- CMake Tools (ms-vscode.cmake-tools)
- Clang-Format (xaver.clang-format)

```bash
code --install-extension ms-vscode.cpptools-extension-pack
```

## 3.2 推荐扩展

### CodeLLDB

**扩展 ID：** `vadimcn.vscode-lldb`

基于 LLDB 的调试器，支持：
- macOS 和 Linux 原生调试
- Rust 和 C++ 调试
- 更好的表达式求值

```bash
code --install-extension vadimcn.vscode-lldb
```

### clangd（可选替代 IntelliSense）

**扩展 ID：** `llvm-vs-code-extensions.vscode-clangd`

基于 clangd 的语言服务器：
- 更快的代码分析
- 更准确的代码补全
- 实时错误检测

```bash
code --install-extension llvm-vs-code-extensions.vscode-clangd
```

> **注意：** 使用 clangd 时需要禁用 C/C++ 扩展的 IntelliSense，避免冲突。

### 其他实用扩展

```bash
# Git 增强
code --install-extension eamodio.gitlens

# 代码检查
code --install-extension cschlosser.doxdocgen

# 文件图标
code --install-extension ms-vscode.vscode-icons

# 远程开发
code --install-extension ms-vscode-remote.remote-ssh
```

## 3.3 IntelliSense 配置

### c_cpp_properties.json

在 `.vscode/c_cpp_properties.json` 中配置 IntelliSense：

```json
{
  "configurations": [
    {
      "name": "Linux",
      "includePath": [
        "${workspaceFolder}/**",
        "${workspaceFolder}/include",
        "/usr/include/**",
        "/usr/local/include/**"
      ],
      "defines": [
        "_DEBUG",
        "UNICODE",
        "_UNICODE"
      ],
      "compilerPath": "/usr/bin/gcc",
      "cStandard": "c17",
      "cppStandard": "c++17",
      "intelliSenseMode": "linux-gcc-x64",
      "compilerArgs": [
        "-Wall",
        "-Wextra"
      ],
      "browse": {
        "path": [
          "${workspaceFolder}",
          "/usr/include",
          "/usr/local/include"
        ],
        "limitSymbolsToIncludedHeaders": true
      }
    }
  ],
  "version": 4
}
```

### 配置字段说明

| 字段 | 说明 |
|------|------|
| `includePath` | 头文件搜索路径 |
| `defines` | 预处理器宏定义 |
| `compilerPath` | 编译器路径 |
| `cStandard` | C 语言标准版本 |
| `cppStandard` | C++ 标准版本 |
| `intelliSenseMode` | IntelliSense 模式 |
| `compilerArgs` | 编译器参数 |

### 常用 IntelliSense 模式

| 模式 | 说明 |
|------|------|
| `linux-gcc-x64` | Linux GCC 64位 |
| `linux-clang-x64` | Linux Clang 64位 |
| `macos-clang-x64` | macOS Clang 64位 |
| `macos-clang-arm64` | macOS Clang ARM64 |
| `windows-msvc-x64` | Windows MSVC 64位 |

### 与 CMake 集成

使用 CMake Tools 时，可以让 CMake 自动提供配置：

```json
// settings.json
{
  "C_Cpp.default.configurationProvider": "ms-vscode.cmake-tools"
}
```

这样就不需要手动维护 `c_cpp_properties.json`，CMake Tools 会自动从 `CMakeLists.txt` 提取配置。

## 3.4 调试配置

### launch.json

在 `.vscode/launch.json` 中配置调试：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "(gdb) Launch",
      "type": "cppdbg",
      "request": "launch",
      "program": "${workspaceFolder}/build/${fileBasenameNoExtension}",
      "args": ["arg1", "arg2"],
      "stopAtEntry": false,
      "cwd": "${workspaceFolder}",
      "environment": [
        {
          "name": "MY_ENV",
          "value": "my_value"
        }
      ],
      "externalConsole": false,
      "MIMode": "gdb",
      "miDebuggerPath": "/usr/bin/gdb",
      "setupCommands": [
        {
          "description": "Enable pretty-printing for gdb",
          "text": "-enable-pretty-printing",
          "ignoreFailures": true
        },
        {
          "description": "Set Disassembly Flavor to Intel",
          "text": "-gdb-set disassembly-flavor intel",
          "ignoreFailures": true
        }
      ],
      "preLaunchTask": "CMake: build"
    },
    {
      "name": "(gdb) Attach",
      "type": "cppdbg",
      "request": "attach",
      "program": "${workspaceFolder}/build/myprogram",
      "MIMode": "gdb",
      "miDebuggerPath": "/usr/bin/gdb",
      "processId": "${command:pickProcess}"
    }
  ]
}
```

### 使用 LLDB 调试

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "(lldb) Launch",
      "type": "lldb",
      "request": "launch",
      "program": "${workspaceFolder}/build/myprogram",
      "args": [],
      "cwd": "${workspaceFolder}",
      "stopOnEntry": false,
      "preLaunchTask": "CMake: build"
    }
  ]
}
```

### 调试快捷键

| 快捷键 | 功能 |
|--------|------|
| `F5` | 开始调试 |
| `F9` | 切换断点 |
| `F10` | 单步跳过 |
| `F11` | 单步进入 |
| `Shift+F11` | 单步跳出 |
| `Shift+F5` | 停止调试 |
| `Ctrl+Shift+F5` | 重启调试 |

### 调试技巧

**条件断点：**

在断点上右键 → "Edit Breakpoint"，设置条件：

```cpp
// 当 i > 10 时触发
i > 10

// 当字符串等于某值时触发
strcmp(name, "test") == 0
```

**日志点（Logpoint）：**

不暂停执行，只输出日志：

```
变量 x 的值: {x}, 变量 y 的值: {y}
```

**监视表达式：**

在调试面板的"监视"区域添加表达式：

```cpp
// 监视变量
myVariable

// 监视表达式
vec.size()
*ptr

// 监视数组
arr,10  // 显示 arr 数组的 10 个元素
```

## 3.5 构建任务配置

### tasks.json

在 `.vscode/tasks.json` 中配置构建任务：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "CMake: Configure",
      "type": "shell",
      "command": "cmake",
      "args": [
        "-B",
        "build",
        "-S",
        ".",
        "-DCMAKE_BUILD_TYPE=Debug"
      ],
      "options": {
        "cwd": "${workspaceFolder}"
      },
      "problemMatcher": []
    },
    {
      "label": "CMake: Build",
      "type": "shell",
      "command": "cmake",
      "args": [
        "--build",
        "build",
        "--parallel",
        "4"
      ],
      "options": {
        "cwd": "${workspaceFolder}"
      },
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": ["$gcc"],
      "dependsOn": "CMake: Configure"
    },
    {
      "label": "CMake: Clean",
      "type": "shell",
      "command": "cmake",
      "args": [
        "--build",
        "build",
        "--target",
        "clean"
      ],
      "options": {
        "cwd": "${workspaceFolder}"
      },
      "problemMatcher": []
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "ctest",
      "args": [
        "--test-dir",
        "build",
        "--output-on-failure"
      ],
      "options": {
        "cwd": "${workspaceFolder}"
      },
      "group": "test",
      "problemMatcher": []
    }
  ]
}
```

### 任务快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd+Shift+B` | 运行默认构建任务 |
| `Cmd+Shift+P` → `Tasks: Run Task` | 选择任务运行 |

## 3.6 代码格式化

### .clang-format 配置

在项目根目录创建 `.clang-format` 文件：

```yaml
---
BasedOnStyle: Google
Language: Cpp
Standard: c++17

# 缩进
IndentWidth: 4
TabWidth: 4
UseTab: Never
IndentCaseLabels: false
IndentPPDirectives: None

# 大括号
BreakBeforeBraces: Attach
BraceWrapping:
  AfterCaseLabel: true
  AfterClass: true
  AfterControlStatement: Always
  AfterEnum: true
  AfterFunction: true
  AfterNamespace: true
  AfterStruct: true
  AfterUnion: true
  AfterExternBlock: true
  BeforeCatch: true
  BeforeElse: true
  BeforeLambdaBody: false
  IndentBraces: false
  SplitEmptyFunction: false
  SplitEmptyRecord: false
  SplitEmptyNamespace: false

# 对齐
AlignAfterOpenBracket: Align
AlignConsecutiveAssignments: false
AlignConsecutiveDeclarations: false
AlignOperands: true
AlignTrailingComments: true

# 换行
ColumnLimit: 100
AllowAllParametersOfDeclarationOnNextLine: true
AllowShortBlocksOnASingleLine: Empty
AllowShortCaseLabelsOnASingleLine: false
AllowShortFunctionsOnASingleLine: Empty
AllowShortIfStatementsOnASingleLine: Never
AllowShortLoopsOnASingleLine: false
AlwaysBreakTemplateDeclarations: Yes
BreakBeforeBinaryOperators: None
BreakBeforeTernaryOperators: true
BreakConstructorInitializers: BeforeColon
BreakInheritanceList: BeforeColon

# 空格
SpaceAfterCStyleCast: false
SpaceAfterLogicalNot: false
SpaceAfterTemplateKeyword: true
SpaceBeforeAssignmentOperators: true
SpaceBeforeCpp11BracedList: false
SpaceBeforeCtorInitializerColon: true
SpaceBeforeInheritanceColon: true
SpaceBeforeParens: ControlStatements
SpaceBeforeRangeBasedForLoopColon: true
SpaceInEmptyParentheses: false
SpacesBeforeTrailingComments: 2
SpacesInAngles: false
SpacesInCStyleCastParentheses: false
SpacesInContainerLiterals: false
SpacesInParentheses: false
SpacesInSquareBrackets: false

# 包含排序
IncludeBlocks: Regroup
IncludeCategories:
  # 系统头文件
  - Regex: '<[a-z_]+>'
    Priority: 1
  # C 标准库
  - Regex: '<[a-z_/]+\.h>'
    Priority: 2
  # C++ 标准库
  - Regex: '<[a-z_/]+>'
    Priority: 3
  # 项目头文件
  - Regex: '".*"'
    Priority: 4

# 指针对齐
DerivePointerAlignment: false
PointerAlignment: Left

# 引用对齐
ReferenceAlignment: Left
```

### VSCode 格式化设置

在 `.vscode/settings.json` 中：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "xaver.clang-format",
  "C_Cpp.formatting": "clang-format",
  "clang-format.style": "file",
  "clang-format.fallbackStyle": "Google",
  "[cpp]": {
    "editor.defaultFormatter": "xaver.clang-format"
  },
  "[c]": {
    "editor.defaultFormatter": "xaver.clang-format"
  }
}
```

### 格式化快捷键

| 快捷键 | 功能 |
|--------|------|
| `Shift+Option+F` (macOS) | 格式化当前文件 |
| `Shift+Alt+F` (Windows/Linux) | 格式化当前文件 |
| `Cmd+K Cmd+F` | 格式化选中区域 |

## 3.7 完整配置示例

### .vscode/settings.json

```json
{
  // C/C++ 扩展设置
  "C_Cpp.default.configurationProvider": "ms-vscode.cmake-tools",
  "C_Cpp.default.cppStandard": "c++17",
  "C_Cpp.default.cStandard": "c11",
  "C_Cpp.intelliSenseEngine": "default",
  "C_Cpp.errorSquiggles": "enabled",
  "C_Cpp.autocomplete": "default",
  "C_Cpp.enhancedColorization": "enabled",

  // CMake 设置
  "cmake.buildDirectory": "${workspaceFolder}/build",
  "cmake.configureOnOpen": true,
  "cmake.configureSettings": {
    "CMAKE_BUILD_TYPE": "Debug",
    "CMAKE_EXPORT_COMPILE_COMMANDS": "ON"
  },
  "cmake.debugConfig": {
    "MIMode": "gdb",
    "miDebuggerPath": "/usr/bin/gdb"
  },

  // 格式化设置
  "editor.formatOnSave": true,
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "files.eol": "\n",

  // 文件关联
  "files.associations": {
    "*.h": "c",
    "*.hpp": "cpp",
    "*.cpp": "cpp",
    "*.cc": "cpp"
  }
}
```

### .vscode/extensions.json

推荐扩展列表，打开项目时 VSCode 会提示安装：

```json
{
  "recommendations": [
    "ms-vscode.cpptools",
    "ms-vscode.cmake-tools",
    "ms-vscode.cpptools-extension-pack",
    "xaver.clang-format",
    "vadimcn.vscode-lldb"
  ]
}
```

## 下一步

配置完成后，如遇到问题请参考 [04-troubleshooting.md](04-troubleshooting.md)。