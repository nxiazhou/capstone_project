# 使用 Ubuntu 作为基础镜像
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

# 设置工作目录为 /app
WORKDIR /app

# 复制当前目录下所有文件（Dockerfile 同级）
COPY . .

# 暴露 Next.js 服务端口
EXPOSE 3000

# 启动 Next.js 应用
CMD ["npm", "run", "start"]