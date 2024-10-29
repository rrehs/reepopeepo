pipeline {
    agent any
    stages {
        stage('Cleanup Workspace') {
            steps {
                script {
                    sh 'rm -rf *'
                }
            }
        }
        stage('Clone Repository') {
            steps {
                script {
                    sh 'git clone https://github.com/rrehs/reepopeepo.git'
                    dir('reepopeepo') {
                        sh 'git checkout main'
                    }
                }
            }
        }
        stage('Build Code') {
            steps {
                script {
                    dir('reepopeepo') {
                        // Build the project (adjust the command if needed)
                        sh 'npm run build' // Replace with your build command
                    }
                }
            }
        }
        stage('Run Unit Tests') {
            steps {
                script {
                    dir('reepopeepo') {
                        // Run unit tests (adjust the command based on your testing framework)
                        sh 'npm test' // Replace with your specific testing command
                    }
                }
            }
        }
        stage('Lint Code') {
            steps {
                script {
                    dir('reepopeepo') {
                        // Lint code to check for syntax and style errors
                        sh 'htmlhint **/*.html' // Replace with other linter commands if needed
                    }
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'reepopeepo/**/*.html', allowEmptyArchive: true
            echo 'Build, test, and lint results archived'
        }
        failure {
            echo 'Pipeline failed. Check the stages for errors.'
        }
    }
}
