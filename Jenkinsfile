pipeline {
  agent any

  options {
    skipDefaultCheckout(true)
  }

  environment {
    DOCKERHUB_USERNAME = 'tasnim255'
    FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/fitconnect-frontend"
    BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/fitconnect-backend"
  }

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

    stage("Docker Hub Login") {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'dockeer-crd',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_TOKEN'
          )
        ]) {
          sh '''
            echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USER" --password-stdin
          '''
        }
      }
    }

    stage("Générer backend image") {
      steps {
        dir("fitconnect-backend") {
          sh "mvn clean package -DskipTests"
          sh "docker build -t $BACKEND_IMAGE:latest . --no-cache"
          sh "docker push $BACKEND_IMAGE:latest"
        }
      }
    }

    stage("Générer frontend image") {
      steps {
        dir("fitconnect-frontend") {
          sh "docker build -t $FRONTEND_IMAGE:latest . --no-cache"
          sh "docker push $FRONTEND_IMAGE:latest"
        }
      }
    }

    stage("Lancement du docker compose") {
      steps {
        sh '''
          export DOCKERHUB_USERNAME=tasnim255
          docker compose down || true
          docker compose pull
          docker compose up -d
          docker compose ps
        '''
      }
    }
  }

  post {
    always {
      sh "docker logout || true"
    }
  }
}
