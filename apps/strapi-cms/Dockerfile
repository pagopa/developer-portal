ARG NODE_IMAGE=node:18.18.0-alpine@sha256:a0b787b0d53feacfa6d606fb555e0dbfebab30573277f1fe25148b05b66fa097

# Creating multi-stage build for production
FROM ${NODE_IMAGE} AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package*.json ./
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm i --omit=dev
ENV PATH /opt/node_modules/.bin:$PATH
WORKDIR /opt/app
COPY . .
RUN npm run build

# Creating final production image
FROM ${NODE_IMAGE} AS buildfinal
RUN apk add --no-cache vips-dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules
WORKDIR /opt/app
COPY --from=build /opt/app ./
ENV PATH /opt/node_modules/.bin:$PATH

RUN chown -R node:node /opt/app
USER node
EXPOSE 1337
CMD npm run start
