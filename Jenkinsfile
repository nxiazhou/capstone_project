pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Git Status') {
            steps {
                sh 'pwd'
                sh 'git status'
            }
        }
    }
}