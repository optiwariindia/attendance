FROM node:24-slim AS base

WORKDIR /frontend


COPY package.json .
COPY patch-node-modules.js .

RUN npm install

RUN chown -R node:node /frontend 
USER node

FROM base AS development

COPY . .
ENV WDS_SOCKET_PORT=443

EXPOSE 3000

CMD [ "npm","run","start" ]

FROM base AS builder

COPY . .

RUN npm run build
