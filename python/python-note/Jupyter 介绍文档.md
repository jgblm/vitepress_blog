# Jupyter 介绍文档

![](/python/jupyter.png)

## 一、Jupyter 简介及核心组件

Jupyter 是一个开源的交互式计算平台，其核心特点包括：

*   **交互式计算**：代码可以分段运行，即时查看结果，方便调试和探索。

*   **多语言支持**：默认支持 Python，通过内核扩展可支持 R、Julia、SQL 等多种语言。

*   **富媒体整合**：文档中可嵌入图表、图片、LaTeX 公式、HTML 等内容。

*   **易于分享**：Notebook 文件（.ipynb）可导出为 PDF、HTML、Markdown 等格式，或通过 Jupyter Hub 多人协作。

*   **跨平台兼容**：支持 Windows、macOS、Linux 系统，可本地运行或部署在服务器上。

Jupyter 的核心组件有：

1.  **Jupyter Notebook** 经典的网页版交互式编辑器，以 “单元格” 为基本单位，支持代码单元格（运行代码）和 markdown 单元格（编写说明文本）。

2.  **JupyterLab** 新一代集成开发环境，包含 Notebook 功能，并支持多标签页、终端、文件浏览器、代码编辑器等，更适合复杂项目开发。

3.  **Jupyter Hub** 面向团队或机构的部署工具，可在服务器上集中管理多个 Jupyter 实例，支持多人协作和资源分配。

4.  **内核（Kernels）** 负责执行代码的后台程序，不同语言对应不同内核（如 `ipykernel` 对应 Python，`irkernel` 对应 R）。

## 二、Jupyter 安装及启动命令

```

\# 安装 JupyterLab（功能更全面）

pip install jupyterlab

\# 启动 Lab

jupyter lab
```


## 三、实用技巧

### 1. 安装扩展插件（提升效率）

Jupyter 支持通过 `nbextensions` 安装扩展插件（如代码自动补全、主题切换等）：


1.  安装扩展管理工具：

```
pip install jupyter\_contrib\_nbextensions

jupyter contrib nbextension install --user
```

1.  启动 Notebook 后，在菜单栏点击 “Nbextensions”，勾选需要的功能：

*   **Table of Contents**：自动生成目录。

*   **Hinterland**：代码自动补全。

*   **Dark Theme**：切换深色主题。

### 2. 魔法命令（Magic Commands）

Jupyter 内置特殊命令（以 `%` 或 `%%` 开头），简化常用操作：



*   `%run`：运行外部 Python 文件



```
%run ./my\_script.py
```



*   `%timeit`：测试代码运行时间



```
%timeit \[i\*\*2 for i in range(1000)]
```



*   `%%bash`：在单元格中运行 bash 命令



```
%%bash

ls -l
```



*   `%load_ext autoreload`：自动重载导入的模块（开发时常用）



```
%load\_ext autoreload

%autoreload 2
```

### 3. 导出与分享



*   导出格式：在菜单栏点击 “File”→“Download as”，支持 PDF、HTML、Markdown、Python 脚本等。

*   在线分享：通过 [Google Colab](https://colab.research.google.com/)、[GitHub](https://github.com/)（直接上传 `.ipynb` 文件可预览）或 [NbViewer](https://nbviewer.org/) 分享。

### 4. 内核管理



*   查看已安装内核：



```
jupyter kernelspec list
```



*   安装新内核（如 R）：



```
\# 先安装 R，再在 R 控制台运行

install.packages('IRkernel')

IRkernel::installspec()
```



*   重启内核（解决代码卡住问题）：菜单栏 “Kernel”→“Restart”。

### 5. 优化性能



*   对于大型数据集或复杂计算，可使用 `dask` 或 `swifter` 库并行处理。

*   清理内存：在命令模式按 `Esc + 0 + 0`（两次 0）重启内核并清空输出。

## 四、常见问题解决



1.  **端口被占用**：启动时提示 `Port 8888 is already in use`，可指定其他端口：



```
jupyter notebook --port 8889
```



2.  **忘记密码**：在终端重置密码：



```
jupyter notebook password
```



3.  **中文显示乱码**：在代码中配置 matplotlib 字体：



```
import matplotlib.pyplot as plt

plt.rcParams\["font.family"] = \["SimHei", "WenQuanYi Micro Hei", "Heiti TC"]
```

