# following the info here:
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/#creating-a-dockerfile
FROM node:12

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "start"]
