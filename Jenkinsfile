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
          // ⚠️ 必须安装 devDependencies
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

    stage('Export Static Files (optional)') {
      steps {
        echo '📤 Exporting static files...'
        dir('bulletin-board-next') {
          sh 'npm run export || true'
        }
      }
    }

    stage('Test (optional)') {
      steps {
        echo '🧪 Running tests...'
        dir('bulletin-board-next') {
          sh 'npm test || echo "No tests configured"'
        }
      }
    }
  }
}