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
            credentialsId: 'dockercrd',
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
      sh "docker build -t $BACKEND_IMAGE:latest ."
      sh "docker push $BACKEND_IMAGE:latest"
    }
  }
}

    stage("Générer frontend image") {
      steps {
        dir("fitconnect-frontend") {
          sh "docker build -t $FRONTEND_IMAGE:latest ."
          sh "docker push $FRONTEND_IMAGE:latest"
        }
      }
    }
    stage("Test Quality of code with SonarQube") {
  steps {
    dir("fitconnect-backend") {
      withCredentials([
        string(
          credentialsId: "sonar_creds",
          variable: "SONAR_TOKEN"
        )
      ]) {
        sh '''
          mvn clean verify sonar:sonar \
            -Dsonar.projectKey=devops \
            -Dsonar.projectName=devops \
            -Dsonar.host.url=http://192.168.65.136:9000 \
            -Dsonar.login=$SONAR_TOKEN \
            -DskipTests
        '''
      }
    }
  }
}
    stage("Deploy avec k8s") {
  steps {
    withKubeConfig([
      credentialsId: 'kubeconfigcred',
      serverUrl: 'https://192.168.65.136:6443'
    ]) {
      sh "kubectl get nodes"
      sh "kubectl apply -f k8s/"
      sh "kubectl rollout restart deployment/backend"
      sh "kubectl rollout restart deployment/frontend"
      sh "kubectl get pods"
      sh "kubectl get svc"
    }
  }
}
  }

  post {
    always {
      sh "docker logout || true"
    }
  }
}
