# Etapa 1: Usar uma imagem Node.js para construir e rodar a aplicação
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependência para o contêiner
COPY package.json package-lock.json ./

# Instalar as dependências
RUN npm install

# Copiar todo o código da aplicação para o contêiner
COPY . .

# Rodar o comando de build do Vite
RUN npm run build

# Expor a porta do Vite (geralmente 5173 ou configurada no seu projeto)
EXPOSE 5173

# Rodar a aplicação com o Vite diretamente
CMD ["npm", "run", "dev"]
