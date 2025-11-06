# Use Eclipse Temurin JDK 21
FROM eclipse-temurin:21-jdk-jammy

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Ensure mvnw is executable
RUN chmod +x mvnw

# Download dependencies (cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Expose port 8080
EXPOSE 8080

# Run the application using the Maven wrapper
CMD ["./mvnw", "spring-boot:run"]