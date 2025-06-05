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
                    echo '📦 Installing all dependencies including dev'
                    sh '''
                        npm ci || npm install --include=dev
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
                        pm2 delete next-app || true
                        pm2 start npm --name "next-app" -- run start
                        pm2 save
                    '''
                }
            }
        }
    }
}
