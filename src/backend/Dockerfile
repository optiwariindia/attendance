FROM node:26-slim AS base

WORKDIR /app

RUN npm install -g nodemon
RUN chown node:node /app

USER node

COPY package.json .
RUN npm install

FROM base AS development

COPY . .
ENV PORT=3000
ENV DB=mongodb://db/hrms

CMD [ "npm","run","dev" ]

FROM base AS production

COPY . .
ENV PORT=3000
ENV DB=mongodb://db/hrms

EXPOSE 3000

CMD [ "npm","run","start" ]