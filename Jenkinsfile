pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                script {
                    sh 'git clone https://github.com/rrehs/reepopeepo.git' // Replace with your repo URL
                    dir('reepopeepo') {
                        sh 'git checkout main' // Ensure we are on the main branch
                    }
                }
            }
        }
        stage('Lint HTML Code') {
            steps {
                script {
                    dir('reepopeepo') { // Specify the directory with HTML files
                        sh 'htmlhint **/*.html' // Run HTMLHint on all HTML files in the repo
                    }
                }
            }
        }
        stage('Build') {
            steps {
                echo 'Build stage (if needed)'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'reepopeepo/**/*.html', allowEmptyArchive: true
            echo 'Cleanup and notifications (if needed)'
        }
    }
}
