# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:21-jdk-jammy

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml file
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Make sure mvnw is executable (fixes the permission error you had earlier too)
RUN chmod +x mvnw

# Download dependencies (this step can be cached)
RUN ./mvnw dependency:go-offline

# Copy the project source
COPY src ./src

# --- KEY CHANGE ---
# Build the application JAR file during the Docker build phase
# We skip tests here to speed up deployment
RUN ./mvnw clean package -DskipTests

# Expose the port
EXPOSE 8080

# Run the JAR file directly, instead of running Maven
# (Make sure the *.jar matches what your pom.xml produces. 
# usually it's just one JAR in the target folder, so this wildcard works well)
CMD ["sh", "-c", "java -jar target/*.jar"]