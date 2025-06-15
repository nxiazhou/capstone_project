pipeline {
    agent any

    options {
        ansiColor('xterm')     
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    environment {
        LANG = 'en_US.UTF-8'
        LC_ALL = 'en_US.UTF-8'
        NODE_ENV = 'production'
        CI = 'false'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📅 Cloning repository...'
                script {
                    try {
                        checkout scm
                        echo '✅ Repository cloned successfully'
                    } catch (Exception e) {
                        echo '❌ Error during checkout: ${e.getMessage()}'
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
                                echo '🔍 package.json has changed. Clearing cache...'
                                sh '''
                                    rm -rf node_modules package-lock.json .next
                                '''
                            } else {
                                echo '🔒 No changes in package.json. Skipping cache clear.'
                            }
                        }
                    } catch (Exception e) {
                        echo '❌ Error checking package.json changes: ${e.getMessage()}'
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
                                npm install --save-dev
                                echo "✅ Npm dependencies installed"
                            '''
                        }
                    } catch (Exception e) {
                        echo '❌ Error during dependencies installation: ${e.getMessage()}'
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
                            echo '✅ Build completed successfully'
                        }
                    } catch (Exception e) {
                        echo '❌ Error during build: ${e.getMessage()}'
                        throw e
                    }
                }
            }
        }

        stage('Start App for Testing') {
            steps {
                echo '🚦 Starting Next.js app for testing...'
                script {
                    dir('bulletin-board-next') {
                        sh '''
                            nohup npm run start > app.log 2>&1 &
                            echo "⏳ Waiting for port 3000 to be available..."
                            for i in {1..20}; do
                                nc -z localhost 3000 && echo "✅ Port 3000 is ready" && break
                                sleep 1
                            done
                        '''
                    }
                }
            }
        }

        stage('Run Next.js App in Kubernetes') {
            steps {
                echo '🚀 (Placeholder) Ready to deploy to Kubernetes in the future...'
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo '🧠 Running unit tests...'
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        try {
                            dir('bulletin-board-next') {
                                sh 'NODE_ENV=development npm run test || { echo "❌ Unit tests failed"; exit 1; }'
                                echo '✅ Unit tests passed'
                            }
                        } catch (Exception e) {
                            echo '❌ Error running unit tests: ${e.getMessage()}'
                            throw e
                        }
                    }
                }
            }
        }

        stage('Run Integration Tests') {
            steps {
                echo '🔄 Running integration tests...'
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        try {
                            dir('bulletin-board-next') {
                                sh '''
                                    export DISPLAY=:99
                                    nohup Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &
                                    sleep 2
                                    npx cypress run || { echo "❌ Integration tests failed"; exit 1; }
                                '''
                                echo '✅ Integration tests passed'
                            }
                        } catch (Exception e) {
                            echo '❌ Error running integration tests: ${e.getMessage()}'
                            throw e
                        }
                    }
                }
            }
        }

        stage('Security Scan - Snyk') {
            steps {
                echo '🛡️ Running Snyk scan...'
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        try {
                            dir('bulletin-board-next') {
                                sh '''
                                    snyk test || { echo "❌ Snyk scan failed"; exit 1; }
                                '''
                                echo '✅ Snyk scan completed'
                            }
                        } catch (Exception e) {
                            echo '❌ Error running Snyk scan: ${e.getMessage()}'
                            throw e
                        }
                    }
                }
            }
        }

        stage('Security Scan - ZAP') {
            steps {
                echo '🕷️ Running ZAP scan...'
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        try {
                            sh '''
                                zap.sh -daemon -host 0.0.0.0 -port 8090 -config api.disablekey=true > /dev/null &
                                sleep 5
                                curl "http://localhost:8090/JSON/ascan/action/scan/?url=http://localhost:3000"
                                sleep 15
                                curl -o zap-report.html http://localhost:8090/OTHER/core/other/htmlreport/
                            '''
                            echo '✅ ZAP scan completed'
                        } catch (Exception e) {
                            echo '❌ Error running ZAP scan: ${e.getMessage()}'
                            throw e
                        }
                    }
                }
            }
        }

        stage('Get ECS Public IP') {
            steps {
                echo '🌐 Getting ECS public IP...'
                script {
                    def publicIp = sh(script: "curl -s ifconfig.me", returnStdout: true).trim()
                    def url = publicIp + ":3000"
                    echo "The URL with port is: ${url}"
                }
            }
        }
    }
}