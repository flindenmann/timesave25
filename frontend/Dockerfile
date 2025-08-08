# my-app/frontend/Dockerfile
FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV BROWSERSLIST_IGNORE_OLD_DATA=true

EXPOSE 3000
CMD ["npm", "start"]