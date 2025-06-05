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

        stage('🧹 Clean Cache') {
            steps {
                dir('bulletin-board-next') {
                    echo '🧹 Removing node_modules and .next'
                    sh 'rm -rf node_modules .next'
                }
            }
        }

        stage('📦 Install Dependencies & Build') {
            steps {
                dir('bulletin-board-next') {
                    echo '📦 Installing project dependencies'
                    // ✅ 安装所有依赖，包括 devDependencies
                    sh 'npm install --include=dev'

                    echo '📦 Installing TailwindCSS, PostCSS, and ESLint explicitly'
                    // ✅ 手动安装缺失的 devDependencies
                    sh 'npm install --save-dev eslint @tailwindcss/postcss'

                    echo '🔨 Building Next.js project'
                    sh 'npm run build'
                }
            }
        }

        stage('🚀 Launch with PM2') {
            steps {
                dir('bulletin-board-next') {
                    echo '🚀 Restarting app with PM2'
                    sh '''
                        pm2 delete next-app || true
                        pm2 start npm --name "next-app" -- run start
                        pm2 save
                    '''
                }
            }
        }
    }
}