FROM node:10.15.0-alpine
EXPOSE 3000 5000

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN yarn ci

COPY . /home/app

RUN yarn run build

ENV NODE_ENV=development
ENV PORT=3000

CMD ./scripts/start.sh
