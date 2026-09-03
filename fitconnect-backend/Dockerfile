FROM maven:3.9.11-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre-alpine

RUN apk upgrade --no-cache && \
    addgroup -S fitconnect && \
    adduser -S fitconnect -G fitconnect

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

RUN mkdir -p /app/uploads && \
    chown -R fitconnect:fitconnect /app

USER fitconnect

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"]
