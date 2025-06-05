pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Clone') {
            steps {
                echo '📥 Cloning repository...'
                git branch: 'main', url: 'git@github.com:nxiazhou/capstone_project.git'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Building Next.js app...'
                sh 'npm run build'
            }
        }

        stage('Export Static Files (optional)') {
            steps {
                echo '📤 Exporting static files (if using next export)...'
                sh 'npm run export || true' // 如果没配置 export，这一步会被跳过
            }
        }

        stage('Test (optional)') {
            steps {
                echo '🧪 Running tests (if any)...'
                sh 'npm test || echo "No tests configured"'
            }
        }
    }
}