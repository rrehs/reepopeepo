pipeline {
    agent any
    stages {
        stage('Cleanup Workspace') {
            steps {
                script {
                    sh 'rm -rf *' // Clean up workspace
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
                        // Minify HTML files
                        sh 'npm install -g html-minifier' // Install html-minifier globally
                        sh 'html-minifier --collapse-whitespace --remove-comments --minify-css true --minify-js true -o output.html *.html'
                    }
                }
            }
        }
        stage('Lint Code') {
            steps {
                script {
                    dir('reepopeepo') {
                        // Lint HTML files
                        sh 'htmlhint **/*.html' // Lint HTML files
                    }
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'reepopeepo/**/*.html', allowEmptyArchive: true
            echo 'Build and lint results archived'
        }
        failure {
            echo 'Pipeline failed. Check the stages for errors.'
        }
    }
}
