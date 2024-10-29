pipeline {
    agent {
        docker {
            image 'node:14' // Use a Node.js image with pre-installed Node.js and npm
            args '-u root' // Run as root for any necessary permissions
        }
    }
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
        stage('Install HTML Linter') {
            steps {
                // Install HTMLHint (or other linters) globally for this session
                sh 'npm install -g htmlhint'
            }
        }
        stage('Lint HTML Code') {
            steps {
                script {
                    // Run HTMLHint on the specified HTML files
                    dir('reepopeepo') { // Specify the directory with HTML files
                        sh 'htmlhint **/*.html' // Lint all HTML files in the repo
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
            // Archive the linting results or any artifacts if necessary
            archiveArtifacts artifacts: 'reepopeepo/**/*.html', allowEmptyArchive: true
            echo 'Cleanup and notifications (if needed)'
        }
    }
}
