pipeline {
    agent any

    tools {
        nodejs 'NodeJs'
    }

    environment {
        BE_IMAGE            = 'jigden18/be-todo:02240343'
        FE_IMAGE            = 'jigden18/fe-todo:02240343'
        BE_DIR              = 'JigdenShakya_02240343_DSO101_A1/backend'
        FE_DIR              = 'JigdenShakya_02240343_DSO101_A1/frontend'
        NEXT_PUBLIC_API_URL = 'https://be-todo-github-go7h.onrender.com'
        DATABASE_URL        = credentials('render-database-url')
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Jigden18/SS2026_DSO101_02240343.git'
            }
        }

        stage('Install Backend') {
            steps {
                dir("${BE_DIR}") {
                    bat 'npm install'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir("${FE_DIR}") {
                    bat 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FE_DIR}") {
                    bat 'npm run build'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir("${BE_DIR}") {
                    bat 'npm test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: "${BE_DIR}/junit.xml"
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir("${FE_DIR}") {
                    bat 'npm test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: "${FE_DIR}/junit.xml"
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                dir("${BE_DIR}") {
                    script {
                        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
                            docker.build("${BE_IMAGE}").push()
                        }
                    }
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                dir("${FE_DIR}") {
                    script {
                        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
                            docker.build(
                                "${FE_IMAGE}",
                                "--build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} ."
                            ).push()
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            bat 'docker system prune -f || true'
        }
        success { echo 'Pipeline completed — both images pushed to Docker Hub.' }
        failure { echo 'Pipeline failed. Check the stage logs above.' }
    }
}