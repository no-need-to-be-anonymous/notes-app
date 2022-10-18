# Development
FROM node:lts AS development

RUN apt-get -qy update && apt-get -qy install openssl

# create app dir
RUN mkdir /app
WORKDIR /app

# install dependencies
COPY package.json /app
COPY yarn.lock /app
COPY prisma /app/prisma

RUN yarn

# COPY . /app

# EXPOSE 8000
