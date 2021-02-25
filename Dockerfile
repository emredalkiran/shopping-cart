FROM node:12-alpine

WORKDIR /usr/app/shopping-cart

COPY . .

WORKDIR /usr/app/shopping-cart/client

RUN npm install

RUN npm run css-build

RUN npm run build

WORKDIR /usr/app/shopping-cart/server

RUN npm install

RUN npm run build

RUN adduser -S -H -D shopping-cart-docker

USER shopping-cart-docker

WORKDIR /usr/app/shopping-cart/server

CMD ["npm", "start"]