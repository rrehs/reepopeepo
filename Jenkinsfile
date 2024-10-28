pipeline {
    agent {
        docker {
            image 'node:14' // Use a Node.js image to run the pipeline
            args '-u root' // Run as root to install packages
        }
    }
    stages {
        stage('Clone Repository') {
            steps {
                // Cloning the Git repository
                git url: 'https://github.com/rrehs/reepopeepo.git', branch: 'main'
            }
        }
        stage('Install Node.js and npm') {
            steps {
                script {
                    // Run commands to install npm packages
                    sh 'npm install -g htmlhint' // Install HTMLHint globally
                }
            }
        }
        stage('Lint HTML Code') {
            steps {
                script {
                    // Run HTMLLint on the specified HTML files
                    sh 'htmlhint **/*.html' // Update the path to your HTML files
                }
            }
        }
        stage('Build') {
            steps {
                // Add your build steps here
                echo 'Build stage (if needed)'
            }
        }
    }
    post {
        always {
            // Archive the linting results or any artifacts if necessary
            archiveArtifacts artifacts: '**/*.html', allowEmptyArchive: true
            echo 'Cleanup and notifications (if needed)'
        }
    }
}
