pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {

        stage('📥 Checkout') {
            steps {
                echo '📥 Cloning repository...'
                checkout scm
            }
        }

        stage('📦 Install Dependencies') {
            steps {
                dir('bulletin-board-next') {
                    echo '📦 Installing all dependencies'
                    sh '''
                        # 删除旧的依赖项和构建缓存
                        rm -rf node_modules package-lock.json .next

                        # 安装所有依赖，包括 devDependencies
                        npm install
                        
                        echo "✅ npm dependencies installed"
                    '''
                }
            }
        }

        stage('🔨 Build Project') {
            steps {
                dir('bulletin-board-next') {
                    echo '🔨 Building Next.js app'
                    sh 'npm run build'
                }
            }
        }

        stage('🚀 Run with PM2') {
            steps {
                dir('bulletin-board-next') {
                    echo '🚀 Restarting with PM2'
                    sh '''
                        # 删除旧的 PM2 进程，防止冲突
                        pm2 delete next-app || true
                        # 使用 PM2 启动应用
                        pm2 start npm --name "next-app" -- run start
                        pm2 save
                    '''
                }
            }
        }
    }
}