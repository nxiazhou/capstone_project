pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        LANG = 'en_US.UTF-8'
        LC_ALL = 'en_US.UTF-8'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
                sh 'pwd'  // 添加此行来确认当前目录
            }
        }

        stage('🔍 Check if package.json changed') {
            steps {
                script {
                    dir('bulletin-board-next') {
                        def changes = sh(script: "git diff --name-only HEAD HEAD~1", returnStdout: true).trim()
                        if (changes.contains("package.json")) {
                            echo "package.json has changed. Clearing cache..."
                            sh '''
                                # 删除旧的依赖项和构建缓存
                                rm -rf node_modules package-lock.json .next
                            '''
                        } else {
                            echo "🔑 No changes in package.json. Skipping cache clear."
                        }
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('bulletin-board-next') {
                    echo 'Installing all dependencies'
                    sh '''
                        npm ci --prefer-offline --no-audit --progress=false
                        echo "V npm dependencies installed"
                    '''
                }
            }
        }

        stage('Build Project') {
            steps {
                dir('bulletin-board-next') {
                    echo 'Building Next.js app...'
                    sh 'npm run build || { echo "X Build failed"; exit 1; }'
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                dir('bulletin-board-next') {
                    echo 'Running unit tests...'
                    sh 'npm run test || { echo "X Unit tests failed"; exit 1; }'
                }
            }
        }

        stage('Run Integration Tests') {
            steps {
                dir('bulletin-board-next') {
                    echo 'Running integration tests...'
                    sh '''
                        export DISPLAY=:99
                        nohup Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &
                        sleep 2
                        NO_COLOR=1 npx cypress run || { echo "X Integration tests failed"; exit 1; }
                    '''
                }
            }
        }

        stage('Run with PM2') {
            steps {
                dir('bulletin-board-next') {
                    echo 'Restarting with PM2...'
                    sh '''
                        # 删除旧的 PM2 进程，防止冲突
                        pm2 delete next-app || true

                        # 使用 PM2 启动应用
                        pm2 start npm --name "next-app" -- run start
                        pm2 save

                        # 打印 PM2 状态确认
                        pm2 list
                        pm2 info next-app
                    '''
                }
            }
        }

        stage('🔍 Get ECS Public IP') {
            steps {
                script {
                    def publicIp = sh(script: "curl -s http://169.254.169.254/latest/meta-data/public-ipv4", returnStdout: true).trim()
                    echo "V Jenkins deployment completed! Access the app at http://${publicIp}:3000"
                }
            }
        }
    }
}