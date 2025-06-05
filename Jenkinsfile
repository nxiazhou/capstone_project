pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {

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

        stage('Install Dependencies & Build') {
            steps {
                dir('bulletin-board-next') {
                    sh '''
                        echo "📦 Setting npm registry"
                        npm config set registry https://registry.npmmirror.com

                        echo "📦 Installing dependencies"
                        npm install --include=dev --unsafe-perm

                        echo "📦 Installing TailwindCSS and ESLint"
                        npm install -D eslint tailwindcss postcss autoprefixer

                        echo "🔨 Building the Next.js project"
                        npm run build
                    '''
                }
            }
        }

        stage('Start with PM2') {
            steps {
                dir('bulletin-board-next') {
                    sh '''
                        echo "🚀 Installing PM2 globally if not exists"
                        npm install -g pm2

                        echo "🛑 Stopping existing PM2 process if exists"
                        pm2 delete next-app || true

                        echo "🚀 Starting Next.js with PM2"
                        pm2 start npm --name "next-app" -- run start

                        echo "💾 Saving PM2 process list"
                        pm2 save
                    '''
                }
            }
        }
    }
}