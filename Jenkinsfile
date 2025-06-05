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

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm install @tailwindcss/postcss --save-dev'
                sh 'npm install --save-dev eslint'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Building Next.js app...'
                sh 'npm run build'
            }
        }

        stage('Start App') {
            steps {
                echo '🚀 Starting Next.js app...'
                sh 'npm run start'
            }
        }
    }
}