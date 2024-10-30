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
                    sh 'git clone https://github.com/rrehs/reepopeepo.git' // Clone the repository
                    dir('reepopeepo') {
                        sh 'git checkout main' // Switch to main branch
                    }
                }
            }
        }
        stage('Build Code') {
            steps {
                script {
                    dir('reepopeepo') {
                        sh 'npm install -g html-minifier' // Install html-minifier
                        sh 'html-minifier --collapse-whitespace --remove-comments --minify-css true --minify-js true -o output.html *.html' // Minify HTML files
                    }
                }
            }
        }
        stage('Lint Code') {
            steps {
                script {
                    dir('reepopeepo') {
                        sh 'htmlhint **/*.html' // Lint HTML files
                    }
                }
            }
        }
        stage('Push Changes') {
            steps {
                script {
                    dir('reepopeepo') {
                        // Only attempt to push if all previous stages have succeeded
                        sh 'git config user.name "rrehs"'
                        sh 'git config user.email "spinorager338@gmail.com"'
                        sh 'git add .'
                        sh 'git commit -m "Automated commit after successful build and linting" || echo "Nothing to commit, working directory clean"' // Commit if there are changes
                        sh 'git push origin main' // Push changes to GitHub
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
                def emailRecipients = 'khairularman56@gmail.com' // Recipient's email
                def subject = "Build ${currentBuild.fullDisplayName} completed"
                def body = "<p>The build has completed.</p><p>Check the Jenkins job for details.</p><pre>${currentBuild.rawBuild.getLog(1000).join('\n')}</pre>"
                emailext (
                    to: emailRecipients,
                    subject: subject,
                    body: body,
                    mimeType: 'text/html'
                )
            }
        }
        failure {
            echo 'Build failed! Code has NOT been pushed.'
        }
    }
}
