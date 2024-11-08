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
    stages {
        stage('Initialize') {
            steps {
                script {
                    stageStatus = [
                        'Cleanup Workspace': 'Pending',
                        'Clone Repository': 'Pending',
                        'Build Code': 'Pending',
                        'Lint Code': 'Pending',
                        'Push Changes': 'Pending'
                    ]
                }
            }
        }
        stage('Cleanup Workspace') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    script {
                        sh 'rm -rf *'
                    }
                }
            }
            post {
                success { script { stageStatus['Cleanup Workspace'] = 'Success' } }
                failure { script { stageStatus['Cleanup Workspace'] = 'Failure' } }
            }
        }
        stage('Clone Repository') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    script {
                        sh 'git clone https://github.com/rrehs/reepopeepo.git'
                        dir('reepopeepo') {
                            sh 'git checkout main'
                        }
                    }
                }
            }
            post {
                success { script { stageStatus['Clone Repository'] = 'Success' } }
                failure { script { stageStatus['Clone Repository'] = 'Failure' } }
            }
        }
        stage('Build Code') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    script {
                        dir('reepopeepo') {
                            sh 'npm install -g html-minifier'
                            sh 'html-minifier --collapse-whitespace --remove-comments --minify-css true --minify-js true -o output.html *.html'
                        }
                    }
                }
            }
            post {
                success { script { stageStatus['Build Code'] = 'Success' } }
                failure { script { stageStatus['Build Code'] = 'Failure' } }
            }
        }
        stage('Lint Code') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    script {
                        dir('reepopeepo') {
                            sh 'htmlhint **/*.html'
                        }
                    }
                }
            }
            post {
                success { script { stageStatus['Lint Code'] = 'Success' } }
                failure { script { stageStatus['Lint Code'] = 'Failure' } }
            }
        }
        stage('Push Changes') {
            when {
                allOf { expression { currentBuild.result == null } } // Only run if no previous failures
            }
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
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
            post {
                success { script { stageStatus['Push Changes'] = 'Success' } }
                failure { script { stageStatus['Push Changes'] = 'Failure' } }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'reepopeepo/**/*.html', allowEmptyArchive: true
            echo 'Build and lint results archived'
        }
        success {
            sendEmail('Success', '✅ Build Succeeded', 'green', 'The build and linting processes completed successfully.')
        }
        unstable {
            sendEmail('Unstable', '⚠️ Build Unstable', 'orange', 'The build completed with some issues.')
        }
        failure {
            sendEmail('Failure', '❌ Build Failed', 'red', 'The build encountered errors.')
        }
    }
}

// Helper function to send email with all stages and their statuses
def sendEmail(buildResult, subjectEmoji, color, message) {
    def emailRecipients = 'khairularman56@gmail.com'
    def stagesSummary = stageStatus.collect { stage, status -> "<li><strong>${stage}</strong>: ${status}</li>" }.join('\n')
    def subject = "${subjectEmoji} Build ${currentBuild.fullDisplayName} ${buildResult}"
    def body = """
    <html>
    <body>
        <h2 style="color: ${color};">${message}</h2>
        <h3>Stages Status:</h3>
        <ul>${stagesSummary}</ul>
        <h3>Build Details:</h3>
        <p><strong>Job:</strong> ${env.JOB_NAME}</p>
        <p><strong>Build Number:</strong> ${currentBuild.number}</p>
        <h3>Build Log (Last 1000 Lines):</h3>
        <pre style="background-color: #f4f4f4; padding: 10px;">${currentBuild.rawBuild.getLog(1000).join('\n')}</pre>
    </body>
    </html>
    """
    emailext (
        to: emailRecipients,
        subject: subject,
        body: body,
        mimeType: 'text/html'
    )
}
