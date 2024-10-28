pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository or pull the latest code
                git branch: 'main', url: 'https://github.com/rrehs/reepopeepo.git' // Replace with your repo URL
            }
        }

        stage('Install Node.js and npm') {
            steps {
                script {
                    // Install Node.js and npm
                    sh '''
                    # Install required dependencies
                    apt-get update && \
                    apt-get install -y curl && \
                    # Install Node.js
                    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
                    apt-get install -y nodejs && \
                    apt-get clean && \
                    rm -rf /var/lib/apt/lists/*
                    '''
                }
            }
        }

        stage('Install HTMLHint') {
            steps {
                // Install htmlhint locally
                sh 'npm install -g htmlhint' // Use -g to install globally
            }
        }

        stage('Lint HTML') {
            steps {
                // Run the HTML linter
                sh 'htmlhint **/*.html' // Lint all HTML files in the repo
            }
        }
    }

    post {
        success {
            echo 'HTML linting completed successfully!'
        }
        failure {
            echo 'HTML linting failed. Please check the errors above.'
        }
    }
}
