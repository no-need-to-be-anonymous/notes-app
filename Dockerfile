# Development
FROM node:16-alpine AS development

# create app dir
RUN mkdir -p /app
WORKDIR /app

# install dependencies
COPY package.json /app
COPY yarn.lock /app
RUN yarn

COPY . /app

EXPOSE 8000
