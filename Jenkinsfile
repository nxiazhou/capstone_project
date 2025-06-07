pipeline {
    agent any

    options {
        ansiColor('xterm')      // Enable ANSI color for log output
        timeout(time: 30, unit: 'MINUTES')  // Timeout: automatically terminate pipeline after 30 minutes
        disableConcurrentBuilds()  // Prevent concurrent builds to avoid conflicts
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
                echo '\uD83D\uDCC5 Cloning repository...'
                script {
                    try {
                        checkout scm
                        echo '\u2705 Repository cloned successfully'
                    } catch (Exception e) {
                        echo '\u274C Error during checkout: ${e.getMessage()}'
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
                                echo '\uD83D\uDD0D package.json has changed. Clearing cache...'
                                sh '''
                                    # Remove old dependencies and build cache
                                    rm -rf node_modules package-lock.json .next
                                '''
                            } else {
                                echo '\uD83D\uDD11 No changes in package.json. Skipping cache clear.'
                            }
                        }
                    } catch (Exception e) {
                        echo '\u274C Error checking package.json changes: ${e.getMessage()}'
                        throw e
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '\uD83D\uDCE6 Installing all dependencies...'
                script {
                    try {
                        dir('bulletin-board-next') {
                            // Install dependencies directly without caching node_modules
                            sh '''
                                npm install --save-dev
                                echo "\\u2705 Npm dependencies installed"
                            '''
                        }
                    } catch (Exception e) {
                        echo '\u274C Error during dependencies installation: ${e.getMessage()}'
                        throw e
                    }
                }
            }
        }

        stage('Build Project') {
            steps {
                echo '\uD83D\uDD28 Building Next.js app...'
                script {
                    try {
                        dir('bulletin-board-next') {
                            // Build project after dependencies are installed
                            sh 'npm run build || { echo "\\u274C Build failed"; exit 1; }'
                            echo '\u2705 Build completed successfully'
                        }
                    } catch (Exception e) {
                        echo '\u274C Error during build: ${e.getMessage()}'
                        throw e
                    }
                }
            }
        }

        stage('Run Next.js App in Kubernetes') {
            steps {
                echo '🚀 Starting Next.js app in Kubernetes...'
                script {
                    try {
                        dir('bulletin-board-next') {
                            sh '''
                                # Start Next.js app directly in the background
                                nohup node node_modules/.bin/next start -p 3000 & 
                            '''
                            echo '✅ Next.js app started successfully'
                        }
                    } catch (Exception e) {
                        echo '❌ Error starting Next.js app: ${e.getMessage()}'
                        throw e
                    }
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo '\uD83E\uDDD2 Running unit tests...'
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        try {
                            dir('bulletin-board-next') {
                                sh 'npm run test || { echo "\\u274C Unit tests failed"; exit 1; }'
                                echo '\u2705 Unit tests passed'
                            }
                        } catch (Exception e) {
                            echo '\u274C Error running unit tests: ${e.getMessage()}'
                            throw e
                        }
                    }
                }
            }
        }

        stage('Run Integration Tests') {
            steps {
                echo '\uD83D\uDD04 Running integration tests...'
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        try {
                            dir('bulletin-board-next') {
                                sh '''
                                    export DISPLAY=:99
                                    nohup Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &
                                    sleep 2
                                    npx cypress run || { echo "\\u274C Integration tests failed"; exit 1; }
                                '''
                                echo '\u2705 Integration tests passed'
                            }
                        } catch (Exception e) {
                            echo '\u274C Error running integration tests: ${e.getMessage()}'
                            throw e
                        }
                    }
                }
            }
        }
        
        stage('Get ECS Public IP') {
            steps {
                echo '\uD83C\uDF10 Getting ECS public IP...'
                script {
                    // Use curl to get the public IP address
                    def publicIp = sh(script: "curl -s ifconfig.me", returnStdout: true).trim()
                    
                    // Append the port ":3000"
                    def url = publicIp + ":3000"
                    
                    // Output the result
                    echo "The URL with port is: ${url}"
                }
            }
        }
    }
}