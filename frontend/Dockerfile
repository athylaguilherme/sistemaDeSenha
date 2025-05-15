# Etapa de build
FROM node:20-alpine AS build

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

# Etapa de execução
FROM nginx:alpine

# Copiar os arquivos de build para o diretório web do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Opcional: Copiar uma configuração personalizada do nginx, se necessário
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]