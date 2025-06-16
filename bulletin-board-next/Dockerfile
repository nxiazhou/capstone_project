# 使用 Ubuntu 作为基础镜像
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 设置时区为亚洲/上海
RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata

# 安装基础依赖
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk git curl wget gnupg2 ca-certificates locales unzip && \
    rm -rf /var/lib/apt/lists/*

# 配置 en_US.UTF-8 locale
RUN locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8

# 安装 Node.js 20.x LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v

# 安装 Cypress 所需 GUI 库
RUN apt-get update && \
    apt-get install -y \
    libgtk-3-0 libxss1 libasound2 libnss3 libx11-xcb1 \
    libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
    libpango-1.0-0 libatk-bridge2.0-0 libxshmfence1 \
    libxext6 libxfixes3 libxrender1 libxtst6 libxi6 \
    xvfb && \
    rm -rf /var/lib/apt/lists/*

# 安装 PM2 和 Snyk
RUN npm install -g pm2 snyk

# 设置 Snyk Token
ENV SNYK_TOKEN=46000b57-9f9a-4c56-b3ef-42bc26a8ed35

# 解压 ZAP 安装包
COPY /opt/ZAP_2.16.1_Linux.tar.gz /opt/ZAP_2.16.1_Linux.tar.gz
RUN mkdir -p /opt/zap && \
    tar -zxvf /opt/ZAP_2.16.1_Linux.tar.gz -C /opt/zap --strip-components=1 && \
    rm /opt/ZAP_2.16.1_Linux.tar.gz
ENV PATH="/opt/zap:$PATH"

# ✅ 设置当前目录为构建目录（已经是 bulletin-board-next）
WORKDIR /app

# ✅ 复制所有文件（Dockerfile 已在同级）
COPY . .

# ✅ 安装依赖并构建前端项目
RUN npm install && npm run build

# ✅ 暴露前端运行端口
EXPOSE 3000

# ✅ 启动前端服务
CMD ["npm", "run", "start"]