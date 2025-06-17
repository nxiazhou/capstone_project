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
        KUBE_CMD = 'KUBECONFIG=/root/.kube/config kubectl'
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

        // stage('Check if package.json changed') {
        //     steps {
        //         script {
        //             try {
        //                 dir('bulletin-board-next') {
        //                     def changes = sh(script: "git diff --name-only HEAD HEAD~1", returnStdout: true).trim()
        //                     if (changes.contains("package.json")) {
        //                         echo '🔍 package.json has changed. Clearing cache...'
        //                         sh '''
        //                             rm -rf node_modules package-lock.json .next
        //                         '''
        //                     } else {
        //                         echo '🔒 No changes in package.json. Skipping cache clear.'
        //                     }
        //                 }
        //             } catch (Exception e) {
        //                 echo '❌ Error checking package.json changes: ${e.getMessage()}'
        //                 throw e
        //             }
        //         }
        //     }
        // }

        // stage('Install Dependencies') {
        //     steps {
        //         echo '📦 Installing all dependencies...'
        //         script {
        //             try {
        //                 dir('bulletin-board-next') {
        //                     sh '''
        //                         npm install --save-dev
        //                         echo "✅ Npm dependencies installed"
        //                     '''
        //                 }
        //             } catch (Exception e) {
        //                 echo '❌ Error during dependencies installation: ${e.getMessage()}'
        //                 throw e
        //             }
        //         }
        //     }
        // }

        // stage('Build Project') {
        //     steps {
        //         echo '🔨 Building Next.js app...'
        //         script {
        //             try {
        //                 dir('bulletin-board-next') {
        //                     sh 'npm run build || { echo "❌ Build failed"; exit 1; }'
        //                     echo '✅ Build completed successfully'
        //                 }
        //             } catch (Exception e) {
        //                 echo '❌ Error during build: ${e.getMessage()}'
        //                 throw e
        //             }
        //         }
        //     }
        // }

        stage('Start App for Testing') {
            steps {
                echo '🚦 Starting Next.js app for testing...'
                script {
                    dir('bulletin-board-next') {
                        sh '''
                            pm2 delete all
                            # 使用 pm2 启动新的前端服务
                            pm2 start npm --name next-app -- run start

                            # 打印 pm2 状态
                            pm2 status

                            echo "⏳ PM2 started Next.js app on port 3000"
                        '''
                    }
                }
            }
        }



        // stage('Run Unit Tests') {
        //     steps {
        //         echo '🧠 Running unit tests...'
        //         script {
        //             catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
        //                 try {
        //                     dir('bulletin-board-next') {
        //                         sh 'NODE_ENV=development npm run test || { echo "❌ Unit tests failed"; exit 1; }'
        //                         echo '✅ Unit tests passed'
        //                     }
        //                 } catch (Exception e) {
        //                     echo '❌ Error running unit tests: ${e.getMessage()}'
        //                     throw e
        //                 }
        //             }
        //         }
        //     }
        // }

        // stage('Run Integration Tests') {
        //     steps {
        //         echo '🔄 Running integration tests...'
        //         script {
        //             catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
        //                 try {
        //                     dir('bulletin-board-next') {
        //                         sh '''
        //                             export DISPLAY=:99
        //                             nohup Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &
        //                             sleep 2
        //                             npx cypress run || { echo "❌ Integration tests failed"; exit 1; }
        //                         '''
        //                         echo '✅ Integration tests passed'
        //                     }
        //                 } catch (Exception e) {
        //                     echo '❌ Error running integration tests: ${e.getMessage()}'
        //                     throw e
        //                 }
        //             }
        //         }
        //     }
        // }

        // stage('Security Scan - Snyk') {
        //     steps {
        //         echo '🛡️ Running Snyk scan...'
        //         script {
        //             catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
        //                 try {
        //                     dir('bulletin-board-next') {
        //                         sh '''
        //                            snyk test || echo "⚠️ Snyk scan completed with vulnerabilities (non-blocking)"
        //                         '''
        //                         echo '✅ Snyk scan completed'
        //                     }
        //                 } catch (Exception e) {
        //                     echo '❌ Error running Snyk scan: ${e.getMessage()}'
        //                     throw e
        //                 }
        //             }
        //         }
        //     }
        // }

        stage('Security Scan - ZAP') {
            steps {
                echo '🕷️ Running ZAP scan...'
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        try {
                            sh '''
                                #!/bin/bash
                                set -e

                                echo "🧹 Killing old ZAP..."
                                PIDS=$(ps aux | grep '[j]ava.*zap' | awk '{print $2}')
                                if [ -n "$PIDS" ]; then
                                    echo "🧹 Killing ZAP processes: $PIDS"
                                    for PID in $PIDS; do
                                        kill -9 "$PID" && echo "✅ Killed ZAP process $PID"
                                    done
                                else
                                    echo "⚠️ No ZAP process found"
                                fi

                                echo "🧹 Cleaning old logs and session..."
                                rm -rf /root/.ZAP/
                                rm -f /tmp/zap.log

                                echo "🚀 Starting ZAP in background..."
                                /opt/zap/zap.sh -daemon -host 0.0.0.0 -port 8090 -config api.disablekey=true -config api.addrs.addr.name='.*' -config api.addrs.addr.regex=true > /tmp/zap.log 2>&1 &

                                echo "🌐 Waiting for ZAP to be ready (log-based)..."
                                ZAP_READY=0
                                for i in {1..60}; do
                                    if grep -q "ZAP is now listening" /tmp/zap.log; then
                                        echo "✅ ZAP is ready (log detected)"
                                        ZAP_READY=1
                                        break
                                    fi
                                    echo "⏳ ZAP not ready yet... ($i)"
                                    sleep 2
                                done

                                if [ "$ZAP_READY" = "0" ]; then
                                    echo "❌ ZAP did not start successfully"
                                    cat /tmp/zap.log
                                    exit 1
                                fi

                                # ================= Spider ==================
                                echo "🕷️ Starting spider scan..."
                                SPIDER_RESPONSE=$(curl -s "http://localhost:8090/JSON/spider/action/scan/?url=http://localhost:3000")
                                echo "📦 Spider response: $SPIDER_RESPONSE"
                                SPIDER_ID=$(echo "$SPIDER_RESPONSE" | grep -o '"scan":"[0-9]*"' | grep -o '[0-9]*')
                                echo "🕷️ Spider ID: $SPIDER_ID"

                                if [ -z "$SPIDER_ID" ]; then
                                    echo "❌ Failed to get Spider ID"
                                    exit 1
                                fi

                                echo "🔄 Waiting for spider scan to complete..."
                                while true; do
                                    STATUS=$(curl -s "http://localhost:8090/JSON/spider/view/status/?scanId=$SPIDER_ID" | grep -o '"status":"[0-9]*"' | grep -o '[0-9]*')
                                    echo "🔍 Spider progress: ${STATUS}%"
                                    if [ "$STATUS" = "100" ]; then break; fi
                                    sleep 2
                                done

                                # ================= Active Scan ==================
                                echo "🔥 Starting active scan..."
                                ASCAN_RESPONSE=$(curl -s "http://localhost:8090/JSON/ascan/action/scan/?url=http://localhost:3000")
                                echo "📦 Active scan response: $ASCAN_RESPONSE"
                                ASCAN_ID=$(echo "$ASCAN_RESPONSE" | grep -o '"scan":"[0-9]*"' | grep -o '[0-9]*')
                                echo "🔥 Active Scan ID: $ASCAN_ID"

                                if [ -z "$ASCAN_ID" ]; then
                                    echo "❌ Failed to get Active Scan ID"
                                    exit 1
                                fi

                                echo "🔄 Waiting for active scan to complete..."
                                while true; do
                                    ASTATUS=$(curl -s "http://localhost:8090/JSON/ascan/view/status/?scanId=$ASCAN_ID" | grep -o '"status":"[0-9]*"' | grep -o '[0-9]*')
                                    echo "🔥 Active scan progress: ${ASTATUS}%"
                                    if [ "$ASTATUS" = "100" ]; then break; fi
                                    sleep 5
                                done
                                '''
                            echo '✅ ZAP scan completed'
                        } catch (Exception e) {
                            echo "❌ Error running ZAP scan: ${e.getMessage()}"
                            throw e
                        }
                    }
                }
            }
        }
        // stage('Run Next.js App in Kubernetes') {
        //     steps {
        //         dir('bulletin-board-next') {
        //             echo '🚀 Starting Kubernetes deployment for Next.js app...'
        //             script {
        //                 try {
        //                     sh '''
        //                         echo "🔐 Logging into ACR..."
        //                         docker login crpi-hmkoucghneqevmd4.cn-hangzhou.personal.cr.aliyuncs.com \
        //                             -u "${ACR_USERNAME}" -p "${ACR_PASSWORD}"
        //                     '''

        //                     sh '''
        //                         echo "🏗 Building Docker image..."
        //                         docker build -t crpi-hmkoucghneqevmd4.cn-hangzhou.personal.cr.aliyuncs.com/dddd_nxz/dddd_platform:latest .
        //                         docker image prune -f

        //                         echo "📤 Pushing Docker image to ACR..."
        //                         docker push crpi-hmkoucghneqevmd4.cn-hangzhou.personal.cr.aliyuncs.com/dddd_nxz/dddd_platform:latest
        //                     '''

        //                     sh '''
        //                         echo "🧹 Cleaning old Kubernetes resources..."
        //                         eval "$KUBE_CMD delete all --all -n default" || true
        //                         eval "$KUBE_CMD delete ingress --all -n default" || true
        //                     '''

        //                     sh '''
        //                         echo "📄 Applying Kubernetes manifests..."
        //                         eval "$KUBE_CMD apply -f /root/deploy-yamls/next-deploy.yaml"
        //                         eval "$KUBE_CMD apply -f /root/deploy-yamls/next-service.yaml"
        //                         eval "$KUBE_CMD apply -f /root/deploy-yamls/next-ingress.yaml"
        //                     '''

        //                     sh '''
        //                         echo "⏳ Waiting for pod to be Running..."
        //                         for i in {1..30}; do
        //                             STATUS=$(eval "$KUBE_CMD get pods -o jsonpath='{.items[0].status.phase}'")
        //                             echo "Current pod status: $STATUS"
        //                             if [ "$STATUS" = "Running" ]; then
        //                                 echo "✅ Pod is running."
        //                                 break
        //                             fi
        //                             sleep 5
        //                         done
        //                     '''

        //                     sh '''
        //                         echo "🌐 Fetching ingress public IP..."
        //                         IP=$(eval "$KUBE_CMD get svc -n kube-system | grep nginx-ingress-lb" | awk '{print $4}')
        //                         echo "🌐 Ingress Public IP(in Kubernetes for production): $IP"
        //                     '''
        //                 } catch (Exception e) {
        //                     echo "❌ Kubernetes deployment failed: ${e.getMessage()}"
        //                     currentBuild.result = 'FAILURE'
        //                     throw e
        //                 }
        //             }
        //         }
        //     }
        // }

        stage('Get ECS Public IP') {
            steps {
                echo '🌐 Getting ECS public IP...'
                script {
                    def publicIp = sh(script: "curl -s ifconfig.me", returnStdout: true).trim()
                    def url = publicIp + ":3000"
                    echo "The URL with port is(Aliyun ECS ubuntu instance for development): ${url}"
                }
            }
        }
    }
}