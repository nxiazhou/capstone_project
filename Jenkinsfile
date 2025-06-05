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
                    sh '''#!/bin/bash
                    echo "📦 Setting npm registry to Taobao mirror"
                    npm config set registry https://registry.npmmirror.com

                    echo "📦 Installing project dependencies"
                    npm install

                    echo "📦 Installing TailwindCSS and ESLint"
                    npm install -D eslint tailwindcss postcss autoprefixer

                    echo "🔨 Building Next.js project"
                    npm run build
                    '''
                }
            }
        }

        stage('🚀 Deploy with PM2') {
            steps {
                dir('bulletin-board-next') {
                    sh '''#!/bin/bash
                    echo "📦 Installing PM2 globally if not installed"
                    npm install -g pm2

                    echo "🛑 Stopping existing PM2 process (if any)"
                    pm2 delete next-app || true

                    echo "🚀 Starting app with PM2"
                    pm2 start npm --name "next-app" -- run start

                    echo "💾 Saving PM2 process list for reboot"
                    pm2 save
                    '''
                }
            }
        }
    }
}
