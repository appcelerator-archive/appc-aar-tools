#! groovy

def isPR = false
isPR = env.BRANCH_NAME.startsWith('PR-')

node('node && npm && npm-publish && nsp && retirejs') {
  stage('Checkout') {
    checkout scm
  }
  stage('Dependencies') {
    sh 'npm install'
  }
  stage('Test') {
    sh 'retire'
    sh 'nsp check'
    sh 'npm test'
  }
  stage('Publish') {
    if (!isPR) {
				sh 'npm publish'
    }
  }
}
