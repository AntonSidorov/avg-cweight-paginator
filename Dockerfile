FROM node:12-slim

ENV DOMAIN=""
ENV PORT=5000
ENV INITIAL=""

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE ${PORT}
CMD [ "npm", "start" ]