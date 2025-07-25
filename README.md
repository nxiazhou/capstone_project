# 📚 capstone_project 操作指南

GitHub 仓库地址：👉 https://github.com/nxiazhou/capstone_project

旧前端地址：http://52.221.51.195:3000/login

新前端地址:http://47.97.211.83:3000/login

Kubernetes前端地址:http://120.26.162.244/

Jenkins地址:http://47.97.211.83:8080

    username:dddd    password:Dddd2025

前端的运行jenkins命令如下:

    docker run -d --name jenkins \
    --restart=always \
    --dns=8.8.8.8 \
    --add-host=host.docker.internal:host-gateway \
    -p 8080:8080 -p 50000:50000 -p 3000:3000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /var/lib/jenkins:/var/jenkins_home \
    -v /root/.kube/config:/root/.kube/config \
    -v /root/docker-jenkins:/root/deploy-yamls \
    -e JENKINS_HOME=/var/jenkins_home \
    -e LANG=en_US.UTF-8 \
    -e LC_ALL=en_US.UTF-8 \
    -e GIT_SSH_COMMAND="ssh -F /var/jenkins_home/.ssh/config" \
    my-jenkins-new:latest

虚拟机里面需要安装的依赖如下:

    npm install jest --save-dev

本地ssh命令:

    ssh -i "C:/develop/ssh/new_key" root@47.97.211.83

windows本地上传linux命令

    scp -i "C:/develop/ssh/new_key" C:/develop/ssh/jenkins-plugins-2.504.2.zip root@47.97.211.83:/var/lib/jenkins/jenkins-plugins-2.504.2.zip

jenkins工作目录（Docker容器外）:   

    /var/lib/jenkins/workspace/dddd_bullet_dashboard

jenkins工作目录（Docker容器内）:

    /var/jenkins_home/workspace/dddd_bullet_dashboard

进入容器的操作：

    sudo docker exec -it jenkins /bin/bash

停止容器:
    sudo docker stop jenkins
    sudo docker rm jenkins
##  构建过程
    在  ~/docker-jenkins目录下创建Dockerfile：

        # 使用 Ubuntu 作为基础镜像
        FROM ubuntu:20.04

        # 设置时区为亚洲，并禁用交互提示
        ENV DEBIAN_FRONTEND=noninteractive
        RUN apt-get update && \
            apt-get install -y tzdata && \
            ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
            dpkg-reconfigure --frontend noninteractive tzdata

        # 安装 Java 和必要的工具
        RUN apt-get update && \
            apt-get install -y openjdk-17-jdk git curl nodejs npm wget && \
            rm -rf /var/lib/apt/lists/*

        # 安装 PM2（使用 npm 安装）
        RUN npm install -g pm2

        # 创建目录来存放 Jenkins WAR 文件
        RUN mkdir -p /opt/jenkins

        # 将本地的 jenkins-2.504.2.war 文件从构建上下文目录复制到容器中的 /opt/jenkins
        COPY jenkins-2.504.2.war /opt/jenkins/jenkins-2.504.2.war

        # 设置 Jenkins 配置目录
        ENV JENKINS_HOME=/var/jenkins_home

        # 设置工作目录
        WORKDIR /var/jenkins_home



##  创建Job




linux用户:

    root Dddd2025
    jenkins Dddd2025

jenkins:

    dddd Dddd2025


新的cicd原理：

    代码提交 (Git) 
        ↓
    Jenkins 触发流水线 (Pipeline)
        ↓
    拉取代码 → 编译 → 测试 → 打包 Docker 镜像
        ↓
    推送镜像到镜像仓库（Docker Hub、阿里云镜像等）
        ↓
    Jenkins 执行 kubectl 命令
        ↓
    Kubernetes 集群拉取最新镜像并更新 Pod
        ↓
    应用自动更新，访问新的版本

Admin账号:

    Username: admin_nxz
    Password: 123456
    Username: admin_cbw
    Password: 123456
    Username: admin_jhc
    Password: 123456
    Username: admin_jyc
    Password: 123456

User账号:

    Username:
    Password: 
    Username: 
    Password:

前端Jenkis: http://52.221.51.195:8080

    Username: admin 
    Password: aa271886045f4224844ad4f5699bf30b 


后端地址：

    http://8.210.165.181
        auth-service: 8081, 
        gateway-service': 8090, 
        client-service': 8082, 
        content-service: 8083, 
        device-service: 8084, 
        payment-service: 8085, 
        report-service: 8086, 
        schedule-service: 8087 

Database:  

    Mysql: 
        host: dddd-db.c3cu28aqilh6.ap-southeast-1.rds.amazonaws.com 
        username: admin 
        password: shuaihaoshishabi 
        port :3306 
        db-name: dddd_platform 


项目文件目录
```bash
bulletin-board-next/
│    ├── components/               # 可复用的 React UI 组件
│    ├── cypress/                 # 集成测试配置与代码（Cypress）
│    │   ├── e2e/                 # Cypress 的端到端测试脚本
│    │   │   └── login.cy.js      # 登录功能的集成测试
│    │   ├── fixtures/            # 预置测试数据（模拟请求数据）
│    │   ├── support/             # 测试辅助函数（如全局钩子）
│    │   └── cypress.config.js    # Cypress 测试配置文件
│    ├── node_modules/            # 项目依赖目录（由 npm 安装生成）
│    ├── pages/                   # Next.js 页面文件，自动路由映射
│    │   ├── api/                 # API 路由，用于后端服务接口
│    │   └── login.js             # 登录页前端界面
│    ├── public/                  # 静态资源目录（图片、图标等）
│    ├── styles/                  # 全局 CSS 或 Tailwind 样式
│    ├── test/                    # 单元测试代码（Jest）
│    │   └── login.test.js        # 登录页的单元测试文件
│    ├── .babelrc                 # Babel 配置文件（编译语法）
│    ├── .gitignore               # Git 忽略文件列表
│    ├── .npmrc                   # npm 配置文件
│    ├── cypress.config.js        # Cypress 主配置（根目录冗余）
│    ├── eslint.config.mjs        # ESLint 配置文件（MJS 格式）
│    ├── jest.setup.js            # Jest 测试环境初始化脚本
│    ├── jsconfig.json            # VSCode 路径别名等 JS 项目配置
│    ├── next.config.mjs          # Next.js 项目的主配置文件
│    ├── package.json             # 项目依赖与脚本定义
│    ├── package-lock.json        # 精确锁定依赖版本（自动生成）
│    ├── postcss.config.mjs       # PostCSS（含 Tailwind）配置
└── README.md                # 项目介绍与操作文档说明
```

## 1.运行&仓库操作
### 1. 如何在本地运行项目（首次安装）

适用于第一次在新环境运行项目（比如新电脑或者新服务器）。

1. 克隆仓库（如果未克隆）
git clone https://github.com/nxiazhou/capstone_project.git

2. 进入项目目录
cd capstone_project

3. 安装依赖
npm install

4. 运行开发环境
npm run dev

5. 打开浏览器访问
http://localhost:3000

### 2. 如何从 GitHub 上拉取并更新代码

保持你的本地仓库与远程 GitHub 仓库同步。

1. 进入项目目录
cd capstone_project

2. 拉取最新远程代码
git pull origin main

如果有更新，会自动同步到本地。

### 3. 如何提交你的更改到 GitHub

修改完代码后，记得提交和推送到 GitHub。

1. 查看当前更改
git status

2. 添加所有更改
git add .

3. 写提交信息（commit message）
git commit -m "描述你的更改"

4. 推送到 GitHub
git push origin main

### 4. 如何处理合并冲突（如果遇到冲突）

多人同时开发时可能出现冲突，按照下面步骤解决。

1. 拉取远程最新代码，可能会提示冲突
git pull origin main

2. 根据提示，手动编辑冲突文件，保留正确内容

3. 标记冲突已解决
git add 冲突文件路径

4. 完成合并提交
git commit -m "解决合并冲突"

5. 推送到 GitHub
git push origin main

⚡ 注意：合并冲突出现时，文件中会看到 <<<<<<, ======, >>>>>> 的标记，请小心选择保留版本。

📌 温馨提示

本项目基于 Next.js + Tailwind CSS。

Node.js 推荐版本 v18以上。

修改代码前，请先 pull 最新代码，避免出现冲突。

提交信息要简洁明了，易于跟踪历史更改。
## 2. 单元测试 & 集成测试

### ✅ 1. 单元测试（Jest）

用于测试组件行为、输入验证等功能逻辑。

#### 🔧 安装依赖（如尚未安装）

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

⚠️ 如果出现依赖冲突报错，请使用以下命令：

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom --legacy-peer-deps
```

#### ▶️ 运行所有单元测试

```bash
npm run test
```

测试脚本位于 `test/` 目录下（例如：`test/login.test.js`）

---

### 🌐 2. 集成测试 / 端到端测试（E2E via Cypress）

用于模拟用户访问真实网页界面，如点击按钮、填写表单等行为。

#### 🔧 安装 Cypress（如尚未安装）

```bash
npm install --save-dev cypress --legacy-peer-deps
```

##### ▶️ 用另一个终端！！打开 Cypress 图形界面

```bash
npx cypress open
```

选择 `E2E Testing` ➝ 选择浏览器（如 Chrome） ➝ 创建并运行测试文件。

测试文件位置为：

```bash
cypress/e2e/login.cy.js
```

#### ▶️ 示例命令行运行方式（非图形界面）

```bash
npx cypress run
```

---

### ✅ 示例目录结构

```bash
bulletin-board-next/
├── test/
│   └── login.test.js        ← 单元测试（Jest）
├── cypress/
│   ├── e2e/
│   │   └── login.cy.js      ← 集成测试（Cypress）
│   ├── fixtures/
│   ├── support/
│   └── cypress.config.js    ← Cypress 配置文件
```

---

### 📌 注意事项

- Cypress 默认访问 `http://localhost:3000`，请先运行项目：

```bash
npm run dev
```

- 若测试访问失败（如 404 或 500），请确保页面路径正确且组件导入无误。

- 本项目已配置 `.babelrc` 使用 `"runtime": "automatic"`，支持 **JSX 自动引入 React**，无需每个页面写 `import React from 'react'`。

## 3.Zaproxy

采用后台守护进程的方式来运行zap服务

检查端口占用:

    netstat -tulnp | grep 8090

/opt/zap/zap-config.properties

    # ✅ 启用 API 无需密钥
    api.disablekey=true

    # ✅ 允许所有来源访问（含本机、容器内外）
    api.addrs.addr.name=.*
    api.addrs.addr.regex=true

    # ✅ 禁用 Selenium 相关功能（避免 Firefox 报错）
    selenium.firefox.driver=disabled
    ajaxSpider.enabled=false
    hud.enabled=false

    # ✅ 设置监听端口为 8090（默认是 8080）
    proxy.port=8090

    # ✅ 设置监听地址为所有 IP（确保容器外能访问）
    proxy.host=0.0.0.0

    # ✅ 关闭启动时自动更新插件（加快启动）
    addon.autoupdate=false
## 4.Kubernetes 配置
登录:

    docker login crpi-hmkoucghneqevmd4.cn-hangzhou.personal.cr.aliyuncs.com
构建镜像：

    docker build -t crpi-hmkoucghneqevmd4.cn-hangzhou.personal.cr.aliyuncs.com/dddd_nxz/dddd_platform:latest .

推送到ACR中:

    docker push crpi-hmkoucghneqevmd4.cn-hangzhou.personal.cr.aliyuncs.com/dddd_nxz/dddd_platform:latest

加载环境变量:

    export KUBECONFIG=/root/.kube/config

停止所有的服务：

    kubectl delete all --all -n default
    kubectl delete ingress --all -n default

删除load_balancer:

    /root/deploy-yamls/delete_public_ingress.sh

应用配置:

    kubectl apply -f /root/deploy-yamls/next-deploy.yaml
    kubectl apply -f /root/deploy-yamls/next-service.yaml
    kubectl apply -f /root/deploy-yamls/next-ingress.yaml
    kubectl get pods
    kubectl get svc
    kubectl get ingress

查看所有资源:

    kubectl get all --all-namespaces

查看ip地址:

    kubectl get svc next-frontend-service -n default -o jsonpath='{.status.loadBalancer.ingress[0].ip}'


