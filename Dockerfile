FROM node:10.15.0-alpine
EXPOSE 80

WORKDIR /home/app

COPY package.json /home/app/

RUN yarn

COPY . /home/app

RUN yarn run build

ENV NODE_ENV=production
ENV PORT=80
RUN chmod 755 ./scripts/start.sh

CMD ./scripts/start.sh
