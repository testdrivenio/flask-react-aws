# pull official base image
FROM node:13.10.1-alpine

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm ci
RUN npm install react-scripts@3.4.0 -g --silent

# start app
CMD ["npm", "start"]
