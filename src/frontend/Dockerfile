FROM node:24-slim AS base

WORKDIR /frontend

RUN chown node:node /frontend 

USER node
COPY package.json .
RUN npm install

FROM base AS development

COPY . .
ENV WDS_SOCKET_PORT=443

EXPOSE 3000

CMD [ "npm","run","start" ]

FROM base AS builder

COPY . .

RUN npm run build
