pipeline {
  agent any

  environment {
    NODE_ENV = 'production'
    APP_DIR = 'bulletin-board-next'
  }

  stages {
    stage('Checkout') {
      steps {
        echo '📥 Cloning repository...'
        checkout scm
      }
    }

    stage('Install Dependencies If Needed') {
      steps {
        echo '📦 Checking for package.json changes...'
        dir("${APP_DIR}") {
          script {
            def packageChanged = sh(script: 'git diff --name-only HEAD~1 HEAD | grep package.json || true', returnStdout: true).trim()
            if (packageChanged) {
              echo '🔁 package.json changed, reinstalling dependencies...'
              sh 'npm install'
            } else {
              echo '✅ package.json unchanged, skipping npm install.'
            }
          }
        }
      }
    }

    stage('Build') {
      steps {
        echo '🔨 Building Next.js app...'
        dir("${APP_DIR}") {
          sh 'npm run build'
        }
      }
    }

    stage('Start App') {
      steps {
        echo '🚀 Starting app with npm start...'
        dir("${APP_DIR}") {
          sh 'npm run start'
        }
      }
    }
  }
}