pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {

        stage('Force Bash') {
            steps {
                sh 'bash'
            }
        }
        stage('Check Shell') {
            steps {
                sh 'echo $0'    // 输出当前使用的 shell
                sh 'readlink -f $(which sh)'  // 更精确地显示 sh 指向哪里
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

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                dir('bulletin-board-next') {
                    sh 'npm install'
                    sh 'npm install -D tailwindcss postcss autoprefixer'
                    sh 'npm install -D eslint'
                }
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Building Next.js app...'
                dir('bulletin-board-next') {
                    sh 'npm run build'
                }
            }
        }

        stage('Start App') {
            steps {
                echo '🚀 Starting Next.js app...'
                dir('bulletin-board-next') {
                    // 启动建议用 pm2 或后台模式防止 pipeline 阻塞
                    sh 'nohup npm run start &'
                }
            }
        }
    }
}