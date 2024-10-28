pipeline {
    agent {
        docker {
            image 'jenkins/jenkins:latest' // or your preferred Jenkins image
            args '-u root' // This makes the pipeline run as root user
        }
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository or pull the latest code
                git 'https://github.com/yourusername/your-repo.git' // Replace with your repo URL
            }
        }

        stage('Install Node.js and npm') {
            steps {
                script {
                    // Install Node.js and npm as root
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
                // Install htmlhint globally as root
                sh 'npm install -g htmlhint'
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
