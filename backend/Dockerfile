# Use an official OpenJDK runtime
FROM  eclipse-temurin:21-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and pom file
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies (this caches them for faster builds)
RUN ./mvnw dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["./mvnw", "spring-boot:run"]