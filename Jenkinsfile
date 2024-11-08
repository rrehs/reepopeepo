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
                    stageStatus = [:] // Initialize tracking of all stage statuses
                }
            }
        }
        stage('Cleanup Workspace') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    script {
                        sh 'rm -rf *' // Clean up workspace
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
        // Other stages here...

        stage('Push Changes') {
            when {
                allOf {
                    expression { currentBuild.result == null } // No failures
                }
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
            // Send success email with all stages and their statuses
            script {
                def emailRecipients = 'khairularman56@gmail.com'
                def stagesSummary = stageStatus.collect { stage, status -> "<li><strong>${stage}</strong>: ${status}</li>" }.join('\n')
                def subject = "✅ Build ${currentBuild.fullDisplayName} Succeeded"
                def body = """
                <html>
                <body>
                    <h2 style="color: green;">The build has completed successfully!</h2>
                    <p>Congratulations! The build and linting processes passed without any errors.</p>
                    <h3>Stages Status:</h3>
                    <ul>${stagesSummary}</ul>
                    <h3>Details:</h3>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${currentBuild.number}</p>
                    <h3>Build Log:</h3>
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
        }
        unstable {
            // Send unstable email with all stages and their statuses
            script {
                def emailRecipients = 'khairularman56@gmail.com'
                def stagesSummary = stageStatus.collect { stage, status -> "<li><strong>${stage}</strong>: ${status}</li>" }.join('\n')
                def subject = "⚠️ Build ${currentBuild.fullDisplayName} Unstable"
                def body = """
                <html>
                <body>
                    <h2 style="color: orange;">The build is unstable.</h2>
                    <p>The build completed with some issues.</p>
                    <h3>Stages Status:</h3>
                    <ul>${stagesSummary}</ul>
                    <h3>Details:</h3>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${currentBuild.number}</p>
                    <h3>Build Log:</h3>
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
        }
        failure {
            // Send failure email with all stages and their statuses
            script {
                def emailRecipients = 'khairularman56@gmail.com'
                def stagesSummary = stageStatus.collect { stage, status -> "<li><strong>${stage}</strong>: ${status}</li>" }.join('\n')
                def subject = "❌ Build ${currentBuild.fullDisplayName} Failed"
                def body = """
                <html>
                <body>
                    <h2 style="color: red;">The build has failed.</h2>
                    <p>Unfortunately, the build encountered errors.</p>
                    <h3>Stages Status:</h3>
                    <ul>${stagesSummary}</ul>
                    <h3>Details:</h3>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${currentBuild.number}</p>
                    <h3>Build Log:</h3>
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
            echo 'Pipeline failed. Check the stages for errors.'
        }
    }
}
