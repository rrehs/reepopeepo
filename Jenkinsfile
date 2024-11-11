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
                    // Initialize the stageStatus map
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
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        sh 'rm -rf *'
                    }
                }
            }
            post {
                success {
                    script { 
                        stageStatus['Cleanup Workspace'] = 'Success'
                    }
                }
                failure {
                    script { 
                        stageStatus['Cleanup Workspace'] = 'Failure'
                    }
                }
            }
        }
        stage('Clone Repository') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        sh 'git clone https://github.com/rrehs/reepopeepo.git'
                        dir('reepopeepo') {
                            sh 'git checkout main'
                        }
                    }
                }
            }
            post {
                success {
                    script {
                        stageStatus['Clone Repository'] = 'Success'
                    }
                }
                failure {
                    script {
                        stageStatus['Clone Repository'] = 'Failure'
                    }
                }
            }
        }
        stage('Build Code') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        dir('reepopeepo') {
                            sh 'npm install -g html-minifier'
                            sh 'html-minifier --collapse-whitespace --remove-comments --minify-css true --minify-js true -o output.html *.html'
                        }
                    }
                }
            }
            post {
                success {
                    script {
                        stageStatus['Build Code'] = 'Success'
                    }
                }
                failure {
                    script {
                        stageStatus['Build Code'] = 'Failure'
                    }
                }
            }
        }
        stage('Lint Code') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        dir('reepopeepo') {
                            sh 'htmlhint **/*.html'
                        }
                    }
                }
            }
            post {
                success {
                    script {
                        stageStatus['Lint Code'] = 'Success'
                    }
                }
                failure {
                    script {
                        stageStatus['Lint Code'] = 'Failure'
                    }
                }
            }
        }
        stage('Integration Test') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        dir('reepopeepo') {
                            sh 'npm install'  // Install dependencies for the tests
                            sh 'npm test'     // Run integration tests
                        }
                    }
                }
            }
            post {
                success {
                    script {
                        stageStatus['Integration Test'] = 'Success'
                    }
                }
                failure {
                    script {
                        stageStatus['Integration Test'] = 'Failure'
                    }
                }
            }
        }
        stage('Push Changes') {
            when {
                allOf { expression { currentBuild.result == null } } // Only run if no previous failures
            }
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
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
                success {
                    script {
                        stageStatus['Push Changes'] = 'Success'
                    }
                }
                failure {
                    script {
                        stageStatus['Push Changes'] = 'Failure'
                    }
                }
                always {
                    script {
                        if (currentBuild.result == 'SKIPPED') {
                            stageStatus['Push Changes'] = 'Skipped'
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'reepopeepo/**/*.html', allowEmptyArchive: true
            echo 'Build and lint results archived'
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

import org.apache.commons.lang.StringEscapeUtils

// Helper function to send email with all stages and their statuses
def sendEmail(buildResult, subjectEmoji, color, message) {
    def emailRecipients = 'khairularman56@gmail.com'
    def stagesSummary = stageStatus.collect { stage, status -> "<li><strong>${stage}</strong>: ${status}</li>" }.join('\n')
    def subject = "${subjectEmoji} Build ${currentBuild.fullDisplayName} ${buildResult}"
    
    // Escape special characters in the build log
    def rawBuildLog = currentBuild.rawBuild.getLog(1000).join('\n')
    def escapedLog = StringEscapeUtils.escapeHtml(rawBuildLog)

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
        <pre style="background-color: #f4f4f4; padding: 10px;">${escapedLog}</pre>
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
