FROM node:10.16-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn install --production --silent && yarn build
COPY . .
EXPOSE 3001
CMD yarn
