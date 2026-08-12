pipeline {
  agent any

  stages {
    stage("Clean up") {
      steps {
        deleteDir()
      }
    }

    stage("Checkout") {
      steps {
        git branch: 'main',
            credentialsId: 'githubcrd',
            url: 'https://github.com/tasnimoueslati/Fitness.git'
      }
    }

    stage("Docker Hub") {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'dockeer-crd',
            usernameVariable: 'DOCKERHUB_USERNAME',
            passwordVariable: 'DOCKERHUB_TOKEN'
          )
        ]) {
          bat '''
            echo %DOCKERHUB_TOKEN% | docker login -u %DOCKERHUB_USERNAME% --password-stdin
          '''
        }
      }
    }

    stage("Générer backend image") {
      steps {
        dir("fitconnect-backend") {
          bat "mvn clean package -DskipTests"
          bat "docker build -t %DOCKERHUB_USERNAME%/fitconnect-backend:latest . --no-cache"
          bat "docker push %DOCKERHUB_USERNAME%/fitconnect-backend:latest"
        }
      }
    }

    stage("Générer frontend image") {
      steps {
        dir("fitconnect-frontend") {
          bat "docker build -t %DOCKERHUB_USERNAME%/fitconnect-frontend:latest . --no-cache"
          bat "docker push %DOCKERHUB_USERNAME%/fitconnect-frontend:latest"
        }
      }
    }

    stage("Lancement du docker compose") {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'dockeer-crd',
            usernameVariable: 'DOCKERHUB_USERNAME',
            passwordVariable: 'DOCKERHUB_TOKEN'
          )
        ]) {
          bat "docker compose down"
          bat "docker compose pull"
          bat "docker compose up -d"
          bat "docker compose ps"
        }
      }
    }
  }

  post {
    always {
      bat "docker logout"
    }
  }
}
