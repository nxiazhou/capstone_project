pipeline {
  agent any

  environment {
    NODE_ENV = 'production'
  }

  stages {
    stage('Clone') {
      steps {
        echo '📥 Cloning repository...'
        git url: 'git@github.com:nxiazhou/capstone_project.git', branch: 'main'
      }
    }

    stage('Install Dependencies') {
      steps {
        echo '📦 Installing dependencies...'
        dir('bulletin-board-next') {
          sh 'npm install'
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
        echo '🚀 Starting Next.js app in background...'
        dir('bulletin-board-next') {
          // 旧服务可选 kill
          sh 'pkill -f "next start" || true'
          // 后台启动
          sh 'nohup npm run start -- -p 3000 -H 0.0.0.0 > output.log 2>&1 &'
          // 等待端口就绪
          sh '''
            for i in {1..20}; do
              curl -s http://localhost:3000 > /dev/null && break
              echo "⏳ Waiting for app to be ready... ($i/20)"
              sleep 1
            done
          '''
        }
      }
    }

    stage('Unit Test (Jest)') {
      steps {
        echo '🧪 Running unit tests (Jest)...'
        dir('bulletin-board-next') {
          sh 'npm run test || exit 1'
        }
      }
    }

    stage('Integration Test (Cypress)') {
      steps {
        echo '🧪 Running integration tests (Cypress)...'
        dir('bulletin-board-next') {
          sh 'npx cypress run || exit 1'
        }
      }
    }
  }
}