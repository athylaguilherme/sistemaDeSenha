# Usar a imagem base do OpenJDK 17 para rodar a aplicação Java
FROM openjdk:21-jdk-slim

# Definir diretório de trabalho dentro do container
WORKDIR /app

# Copiar o JAR gerado pelo Maven para dentro do container
COPY target/cardapaio-0.0.1-SNAPSHOT.jar app.jar

# Expor a porta onde o backend rodará
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
