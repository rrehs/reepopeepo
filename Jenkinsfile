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
            script {
                // Email configuration
                def emailRecipients = 'khairularman56@gmail.com' // Recipient's email address
                def subject = "Build ${currentBuild.fullDisplayName} completed"
                
                // Get the last 1000 lines of the build log
                def buildLog = currentBuild.rawBuild.getLog(1000).join('<br/>') // Use <br/> for line breaks in HTML
                def body = """
                    <html>
                        <body>
                            <h2>Build Status: ${currentBuild.currentResult}</h2>
                            <p>The build has completed. Check the Jenkins job for details.</p>
                            <h3>Build Log:</h3>
                            <pre style="background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                                ${buildLog}
                            </pre>
                        </body>
                    </html>
                """
                
                // Sending email notification
                emailext (
                    to: emailRecipients,
                    subject: subject,
                    body: body,
                    mimeType: 'text/html' // Set the mimeType to 'text/html' for HTML formatting
                )
            }
        }
        failure {
            echo 'Pipeline failed. Check the stages for errors.'
        }
    }
}
