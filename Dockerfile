# Development
FROM node:lts AS development

RUN apt-get -qy update && apt-get -qy install openssl

# create app dir
ARG POSTGRES_HOST
ENV DATABASE_URL="postgresql://postgres:postgres@${POSTGRES_HOST}/notes-test?schema=public"
RUN mkdir -p /app
WORKDIR /app

# install dependencies
COPY package.json /app
COPY yarn.lock /app
RUN yarn

COPY . /app

EXPOSE 8000
