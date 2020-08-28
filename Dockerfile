FROM node:lts-stretch-slim

ENV appdir /usr/src/app

WORKDIR $appdir

COPY ./web-app $appdir
RUN  npm install --production

EXPOSE 8079

CMD [ "npm", "start" ]
