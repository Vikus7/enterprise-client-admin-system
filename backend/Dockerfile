FROM maven:3.9.11-eclipse-temurin-25 AS build

WORKDIR /app

ARG MAVEN_ARGS="-DskipTests package"

COPY pom.xml .
COPY src ./src
COPY certs/ /tmp/certs/

RUN set -eux; \
		if [ -d /tmp/certs ] && find /tmp/certs -type f \( -name "*.crt" -o -name "*.pem" \) | grep -q .; then \
			find /tmp/certs -type f \( -name "*.crt" -o -name "*.pem" \) -print | while read -r cert; do \
				alias_name="corp-$(basename "$cert" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9._-')"; \
				keytool -importcert -cacerts -storepass changeit -noprompt -file "$cert" -alias "$alias_name"; \
			done; \
		fi; \
		mvn ${MAVEN_ARGS}

FROM eclipse-temurin:25-jre

WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]