pipeline {
    agent any

    environment {
        REGISTRY = 'docker.io'
        IMAGE_NAME = 'beercrew/enterprise-web'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Lint & Type Check') {
            steps {
                sh 'npm ci'
                sh 'npm run lint'
            }
        }

        stage('Build Docker Standalone Image') {
            steps {
                script {
                    dockerImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}", "-f docker/Dockerfile .")
                }
            }
        }

        stage('Deploy Staging') {
            steps {
                echo 'Deploying standalone container via Docker Compose...'
                sh 'docker compose -f docker/docker-compose.yml up -d --remove-orphans'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment Pipeline Completed Successfully!'
        }
        failure {
            echo 'Pipeline Failed!'
        }
    }
}
