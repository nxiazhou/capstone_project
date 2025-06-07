pipeline {
    agent any

    options {
        ansiColor('xterm')      // Enable ANSI color for log output
        timeout(time: 30, unit: 'MINUTES')  // Timeout: automatically terminate pipeline after 30 minutes
        disableConcurrentBuilds()  // Prevent concurrent builds to avoid conflicts
    }

    environment {
        NODE_ENV = 'production'
        LANG = 'en_US.UTF-8'
        LC_ALL = 'en_US.UTF-8'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                script {
                    try {
                        checkout scm
                        echo '✅ Repository cloned successfully'
                    } catch (Exception e) {
                        echo "❌ Error during checkout: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Check if package.json changed') {
            steps {
                script {
                    try {
                        dir('bulletin-board-next') {
                            def changes = sh(script: "git diff --name-only HEAD HEAD~1", returnStdout: true).trim()
                            if (changes.contains("package.json")) {
                                echo "🔍 package.json has changed. Clearing cache..."
                                sh '''
                                    # Remove old dependencies and build cache
                                    rm -rf node_modules package-lock.json .next
                                '''
                            } else {
                                echo "🔑 No changes in package.json. Skipping cache clear."
                            }
                        }
                    } catch (Exception e) {
                        echo "❌ Error checking package.json changes: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing all dependencies...'
                script {
                    try {
                        dir('bulletin-board-next') {
                            sh '''
                                npm ci --prefer-offline --no-audit --progress=false
                                echo "✅ Npm dependencies installed"
                            '''
                        }
                    } catch (Exception e) {
                        echo "❌ Error during dependencies installation: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Build Project') {
            steps {
                echo '🔨 Building Next.js app...'
                script {
                    try {
                        dir('bulletin-board-next') {
                            sh 'npm run build || { echo "❌ Build failed"; exit 1; }'
                            echo "✅ Build completed successfully"
                        }
                    } catch (Exception e) {
                        echo "❌ Error during build: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo '🧪 Running unit tests...'
                script {
                    try {
                        dir('bulletin-board-next') {
                            sh 'npm run test || { echo "❌ Unit tests failed"; exit 1; }'
                            echo "✅ Unit tests passed"
                        }
                    } catch (Exception e) {
                        echo "❌ Error running unit tests: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Run Integration Tests') {
            steps {
                echo '🔄 Running integration tests...'
                script {
                    try {
                        dir('bulletin-board-next') {
                            sh '''
                                export DISPLAY=:99
                                nohup Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &
                                sleep 2
                                NO_COLOR=1 npx cypress run || { echo "❌ Integration tests failed"; exit 1; }
                            '''
                            echo "✅ Integration tests passed"
                        }
                    } catch (Exception e) {
                        echo "❌ Error running integration tests: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Run with PM2') {
            steps {
                echo '🚀 Restarting with PM2...'
                script {
                    try {
                        dir('bulletin-board-next') {
                            sh '''
                                # Delete old PM2 process to avoid conflict
                                pm2 delete next-app || true

                                # Start app with PM2
                                pm2 start npm --name "next-app" -- run start
                                pm2 save

                                # Print PM2 status for confirmation
                                pm2 list
                                pm2 info next-app
                            '''
                            echo "✅ PM2 process started successfully"
                        }
                    } catch (Exception e) {
                        echo "❌ Error during PM2 process start: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Get ECS Public IP') {
            steps {
                echo '🌐 Getting ECS public IP...'
                script {
                    try {
                        def publicIp = sh(script: "curl -s http://169.254.169.254/latest/meta-data/public-ipv4", returnStdout: true).trim()
                        echo "✅ Jenkins deployment completed! Access the app at http://${publicIp}:3000"
                    } catch (Exception e) {
                        echo "❌ Error fetching ECS public IP: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }
    }
}