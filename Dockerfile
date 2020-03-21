# The instructions for the first stage
FROM node:12-alpine as builder
LABEL maintainer="RestQa <team@restqa.io>"
LABEL app="restqapi"
LABEL name="http restqapi"
LABEL description="A light Gherkin based  testing for HTTP APIs using Cucumber (JS)"
LABEL repository="https://github.com/restqa/restqapi"
LABEL url="https://restqa.io/restqapi"

RUN apk --no-cache add python make g++

COPY package*.json ./
RUN npm install --production
RUN npm ci --only=production


# The instructions for second stage
FROM node:12-alpine

WORKDIR /app
COPY --from=builder node_modules node_modules

ENV NODE_ENV=production

COPY . .
RUN ln -s /app/bin/restqapi /usr/bin/restqapi

CMD ["restqapi"]
