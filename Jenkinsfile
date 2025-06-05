pipeline {
  agent any

  environment {
    NODE_ENV = 'production'
  }

  stages {
    stage('Clone') {
      steps {
        echo '📥 Cloning repository...'
        git url: 'git@github.com:nxiazhou/capstone_project.git', branch: 'main', credentialsId: 'dddd'
      }
    }

    stage('Install Dependencies') {
      steps {
        echo '📦 Installing dependencies...'
        dir('bulletin-board-next') {
          sh 'rm -rf node_modules package-lock.json'
          sh 'npm install --include=dev'
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

    stage('Start with PM2') {
      steps {
        echo '🚀 Starting app with PM2...'
        dir('bulletin-board-next') {
          sh '''
            pm2 delete bulletin-board-next || true
            pm2 start node_modules/next/dist/bin/next --name "bulletin-board-next" -- start -p 3000 -H 0.0.0.0
            pm2 save
          '''
        }
      }
    }
  }
}