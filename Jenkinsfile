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
                echo '📦 Checking for package.json changes...'
                dir('bulletin-board-next') {
                    script {
                        sh 'git pull origin main'

                        echo '📦 Installing dependencies...'
                        sh 'npm install'
                    }
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
                    sh 'npm run start'
                }
            }
        }
    }
}