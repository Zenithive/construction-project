FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "nx.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install -g @nrwl/cli
# RUN npm i nx@17.0.0
RUN npm install
COPY . .
RUN npm install -g @nrwl/cli
# RUN npm install --production --silent && mv node_modules ../
RUN npx nx build client --prod
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "start-client"]
