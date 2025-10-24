# base image
FROM docker.io/library/node:22-alpine as base

RUN apk update && apk add --no-cache --virtual .gyp python3 make g++
# Install Chrome
RUN apk add chromium
ENV CHROME_BIN='/usr/bin/chromium-browser'
RUN apk del .gyp

# create directory frontend on container
WORKDIR /frontend
# copy package.json and yarn.lock from host machine to container
COPY package.json yarn.lock /frontend/
# install frontend libraries on container
RUN yarn
# add all configuration files
COPY angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json karma.conf.js proxy.conf.docker.json /frontend/
