pipeline {
    agent any

    tools {
        nodejs 'NodeJs'
    }

    environment {
        DOCKERHUB_USERNAME  = 'jigden18'
        BE_IMAGE            = 'jigden18/be-todo:02240343'
        FE_IMAGE            = 'jigden18/fe-todo:02240343'
        BE_DIR              = 'JigdenShakya_02240343_DSO101_A1/backend'
        FE_DIR              = 'JigdenShakya_02240343_DSO101_A1/frontend'
        NEXT_PUBLIC_API_URL = 'https://be-todo-github.onrender.com'
    }

    stages {

        // Stage 1: Checkout Code
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Jigden18/SS2026_DSO101_02240343.git'
            }
        }

        // Stage 2: Install Backend Dependencies
        stage('Install Backend') {
            steps {
                dir("${BE_DIR}") {
                    sh 'npm install'
                }
            }
        }

        // Stage 3: Install Frontend Dependencies
        stage('Install Frontend') {
            steps {
                dir("${FE_DIR}") {
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }

        // Stage 4: Build Frontend
        stage('Build') {
            steps {
                dir("${FE_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        // Stage 5: Run Backend Unit Tests
        stage('Test Backend') {
            steps {
                dir("${BE_DIR}") {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: "${BE_DIR}/junit.xml"
                }
            }
        }

        // Stage 6: Run Frontend Unit Tests
        stage('Test Frontend') {
            steps {
                dir("${FE_DIR}") {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: "${FE_DIR}/junit.xml"
                }
            }
        }

        // Stage 7: Build and Push Backend Docker Image
        stage('Deploy Backend') {
            steps {
                dir("${BE_DIR}") {
                    script {
                        docker.withRegistry(
                            'https://registry.hub.docker.com',
                            'docker-hub-creds'
                        ) {
                            def beImage = docker.build("${BE_IMAGE}")
                            beImage.push()
                        }
                    }
                }
            }
        }

        // Stage 8: Build and Push Frontend Docker Image
        stage('Deploy Frontend') {
            steps {
                dir("${FE_DIR}") {
                    script {
                        docker.withRegistry(
                            'https://registry.hub.docker.com',
                            'docker-hub-creds'
                        ) {
                            def feImage = docker.build(
                                "${FE_IMAGE}",
                                "--build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} ."
                            )
                            feImage.push()
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed — both images pushed to Docker Hub.'
        }
        failure {
            echo 'Pipeline failed. Check the stage logs above.'
        }
    }
}