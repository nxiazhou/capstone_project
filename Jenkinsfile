pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {

        stage('Check Shell') {
            steps {
                sh 'echo $0'                // 输出当前 shell
                sh 'readlink -f $(which sh)' // 显示 /bin/sh 的真实链接
            }
        }

        stage('Who Am I') {
            steps {
                sh 'whoami'
            }
        }

        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                checkout scm
            }
        }

        stage('Clean Cache') {
            steps {
                echo '🧹 Removing old cache...'
                dir('bulletin-board-next') {
                    sh 'rm -rf node_modules .next'
                }
            }
        }

        stage('Install & Build with Bash') {
            steps {
                dir('bulletin-board-next') {
                    sh '''#!/bin/bash
                    echo "📦 Setting npm registry..."
                    npm config set registry https://registry.npmmirror.com

                    echo "📦 Installing dependencies..."
                    npm install --include=dev --unsafe-perm

                    echo "📦 Installing Tailwind & ESLint..."
                    npm install -D tailwindcss postcss autoprefixer
                    npm install -D eslint

                    echo "🔨 Building Next.js app..."
                    npm run build
                    '''
                }
            }
        }

        stage('Start App in Background') {
            steps {
                echo '🚀 Starting Next.js app in background...'
                dir('bulletin-board-next') {
                    sh '''#!/bin/bash
                    echo "📤 Launching app with nohup..."
                    nohup npm run start > app.log 2>&1 &
                    '''
                }
            }
        }
    }
}