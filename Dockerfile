FROM node:lts

RUN mkdir -p /usr/src/pruebaPayU
WORKDIR /usr/src/pruebaPayU
COPY . .
EXPOSE 5000

#Instalar dependencias
RUN npm install
CMD ["node","src/index.js"]