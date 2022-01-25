FROM node:14.16.1 AS base
LABEL maintainer="kareem.mohllal@gmail.com"

WORKDIR /app

# copy package.json package-lock.json and install npm dependicies
COPY package*.json .babelrc ./
RUN npm install

# copy the source files
COPY . .

# change the root user for more security
USER node
