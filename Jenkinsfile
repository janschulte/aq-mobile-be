pipeline {
   environment {
       registry = "mbursac/belair-2.0"
       registryCredential = 'docker-hub-credentials'
       app = ''
   }

   agent any

   stages {
      stage('Build docker image') {
       steps {
            script {
                app = docker.build registry

                app.inside('--name belair --volume "$/jenkins/workspace/belair-2.0:/app/platforms/android/app/build/outputs/apk/debug/" -it registry') { c ->
                    sh 'java -version'
                }
            }
       }
      }
      stage('Push image') {
        steps {
            script {
              docker.withRegistry('', registryCredential) {
                  app.push()
              }
            }
        }
      }
      stage('Remove Unused docker image') {
        steps{
          sh "docker rmi $registry"
        }
      }
   }
}


