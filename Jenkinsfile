pipeline {
    agent any
    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'ref', value: '$.ref']
            ],
            causeString: 'Triggered on push to GitHub',
            token: '1337yana', // Optional, but recommended
            printContributedVariables: true,
            printPostContent: true
        )
    }
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
                        sh 'npm install -g html-minifier'
                        sh 'html-minifier --collapse-whitespace --remove-comments --minify-css true --minify-js true -o output.html *.html'
                    }
                }
            }
        }
        stage('Lint Code') {
            steps {
                script {
                    dir('reepopeepo') {
                        sh 'htmlhint **/*.html'
                    }
                }
            }
        }
        stage('Push Changes') {
            when {
                allOf {
                    expression { currentBuild.result == null } // No failures
                }
            }
            steps {
                script {
                    dir('reepopeepo') {
                        withCredentials([usernamePassword(credentialsId: 'ba552a1c-c018-497e-a733-cae3f2d4c7b3', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_TOKEN')]) {
                            sh 'git config user.name "rrehs"'
                            sh 'git config user.email "spinorager338@gmail.com"'
                            sh 'git add .'
                            sh 'git commit -m "Automated commit after successful build and linting" || echo "Nothing to commit"'
                            sh 'git push https://${GIT_USERNAME}:${GIT_TOKEN}@github.com/rrehs/reepopeepo.git main'
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            // Archive artifacts
            archiveArtifacts artifacts: 'reepopeepo/**/*.html', allowEmptyArchive: true
            echo 'Build and lint results archived'
        }
        success {
            // Send success email
            script {
                def emailRecipients = 'khairularman56@gmail.com' // Update with recipient's email
                def subject = "Build ${currentBuild.fullDisplayName} succeeded"
                def body = "The build has completed successfully. Check the Jenkins job for details."
                def logFile = "build.log"
                writeFile(file: logFile, text: currentBuild.rawBuild.getLog(1000).join('\n'))
                
                emailext (
                    to: emailRecipients,
                    subject: subject,
                    body: body,
                    attachments: logFile,
                    mimeType: 'text/html' // Optional, change to 'text/plain' if needed
                )
            }
        }
        failure {
            // Send failure email
            script {
                def emailRecipients = 'khairularman56@gmail.com' // Update with recipient's email
                def subject = "Build ${currentBuild.fullDisplayName} failed"
                def body = "The build has failed. Check the Jenkins job for details."
                def logFile = "build.log"
                writeFile(file: logFile, text: currentBuild.rawBuild.getLog(1000).join('\n'))
                
                emailext (
                    to: emailRecipients,
                    subject: subject,
                    body: body,
                    attachments: logFile,
                    mimeType: 'text/html' // Optional, change to 'text/plain' if needed
                )
            }
            echo 'Pipeline failed. Check the stages for errors.'
        }
    }
}
