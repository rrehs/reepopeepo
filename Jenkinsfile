pipeline {
    agent any
    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'ref', value: '$.ref']
            ],
            causeString: 'Triggered on push to GitHub',
            token: '1337yana',
            printContributedVariables: true,
            printPostContent: true
        )
    }

    environment {
        REPO_DIR = 'reepopeepo'
        GIT_CREDENTIALS = 'ba552a1c-c018-497e-a733-cae3f2d4c7b3'
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    // Initialize the stageStatus map
                    stageStatus = [
                        'Cleanup Workspace': 'Pending',
                        'Clone Repository': 'Pending',
                        'Build Code': 'Pending',
                        'Lint Code': 'Pending',
                        'Integration Test': 'Pending'
                    ]
                }
            }
        }

        stage('Cleanup Workspace') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        sh 'rm -rf *'
                    }
                }
            }
            post {
                success {
                    script { stageStatus['Cleanup Workspace'] = 'Success' }
                }
                failure {
                    script { stageStatus['Cleanup Workspace'] = 'Failure' }
                }
                always {
                    script {
                        if (currentBuild.result == 'FAILURE') {
                            stageStatus['Cleanup Workspace'] = 'Failure'
                        }
                    }
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS, usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                            sh 'git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/rrehs/nacsa.git'
                            dir(REPO_DIR) {
                                sh 'git checkout main' // or "master" if using master
                            }
                        }
                    }
                }
            }
            post {
                success {
                    script { stageStatus['Clone Repository'] = 'Success' }
                }
                failure {
                    script { stageStatus['Clone Repository'] = 'Failure' }
                }
                always {
                    script {
                        if (currentBuild.result == 'FAILURE') {
                            stageStatus['Clone Repository'] = 'Failure'
                        }
                    }
                }
            }
        }

        stage('Build Code') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        dir(REPO_DIR) {
                            sh 'npm install --legacy-peer-deps'
                            sh 'npm run build'
                        }
                    }
                }
            }
            post {
                success {
                    script { stageStatus['Build Code'] = 'Success' }
                }
                failure {
                    script { stageStatus['Build Code'] = 'Failure' }
                }
                always {
                    script {
                        if (currentBuild.result == 'FAILURE') {
                            stageStatus['Build Code'] = 'Failure'
                        }
                    }
                }
            }
        }

        // New Lint Code Stage
        stage('Lint Code') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        dir(REPO_DIR) {
                            sh 'npm run lint' // Runs ESLint on JavaScript files
                        }
                    }
                }
            }
            post {
                success {
                    script { stageStatus['Lint Code'] = 'Success' }
                }
                failure {
                    script { stageStatus['Lint Code'] = 'Failure' }
                }
                always {
                    script {
                        if (currentBuild.result == 'FAILURE') {
                            stageStatus['Lint Code'] = 'Failure'
                        }
                    }
                }
            }
        }

        stage('Integration Test') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        dir(REPO_DIR) {
                            sh 'npm test'  // Run integration tests
                        }
                    }
                }
            }
            post {
                success {
                    script { stageStatus['Integration Test'] = 'Success' }
                }
                failure {
                    script { stageStatus['Integration Test'] = 'Failure' }
                }
                always {
                    script {
                        if (currentBuild.result == 'FAILURE') {
                            stageStatus['Integration Test'] = 'Failure'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: "${REPO_DIR}/**/*.html", allowEmptyArchive: true
        }
        success {
            sendEmail('Success', '✅', 'green', 'The build completed successfully.')
        }
        unstable {
            sendEmail('Unstable', '⚠️', 'orange', 'The build completed with some issues.')
        }
        failure {
            sendEmail('Failure', '❌', 'red', 'The build encountered errors.')
        }
    }
}

// Helper function to send email with all stages and their statuses
def sendEmail(buildResult, subjectEmoji, color, message) {
    def emailRecipients = 'khairularman56@gmail.com'
    def stagesSummary = stageStatus.collect { stage, status -> "<li><strong>${stage}</strong>: ${status}</li>" }.join('\n')
    def subject = "${subjectEmoji} Build ${currentBuild.fullDisplayName} ${buildResult}"
    
    // Get the build log and save it to a file
    def rawBuildLog = currentBuild.rawBuild.getLog(1000).join('\n')
    def logFile = "build-log-${currentBuild.number}.txt"
    
    // Write the log content to a file
    writeFile(file: logFile, text: rawBuildLog)

    // Email body without the log content
    def body = """
    <html>
    <body>
        <h2 style="color: ${color};">${message}</h2>
        <h3>Stages Status:</h3>
        <ul>${stagesSummary}</ul>
        <h3>Build Details:</h3>
        <p><strong>Job:</strong> ${env.JOB_NAME}</p>
        <p><strong>Build Number:</strong> ${currentBuild.number}</p>
        <h3>Build Log Attachment:</h3>
        <p>The build log is attached as a text file.</p>
    </body>
    </html>
    """
    
    // Send the email with the log file as an attachment
    emailext (
        to: emailRecipients,
        subject: subject,
        body: body,
        mimeType: 'text/html',
        attachmentsPattern: logFile  // Attach the log file
    )
}
