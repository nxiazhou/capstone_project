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
                        def changed = sh(script: "git diff --name-only HEAD~1 HEAD | grep package.json || true", returnStdout: true).trim()
                        if (changed) {
                            echo '🔁 Detected changes in package.json, clearing node_modules...'
                            sh 'rm -rf node_modules'
                        } else {
                            echo '✅ No changes in package.json, skipping node_modules cleanup.'
                        }

                        echo '📦 Installing dependencies...'
                        sh 'npm install @tailwindcss/postcss --save-dev'
                        sh 'npm install --save-dev eslint'
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