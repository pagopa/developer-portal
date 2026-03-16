FROM node:22-slim
ARG DEBIAN_FRONTEND=noninteractive

# Install Chromium and its runtime dependencies for Puppeteer
RUN apt-get update && \
  apt-get install -y \
  chromium \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libxss1 \
  xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to skip bundled Chromium download and use the system one
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app/apps/parser

# Copy only the parser's package.json for a standalone install (no workspace needed)
COPY apps/parser/package.json ./

# Install dependencies without running lifecycle scripts (husky etc.)
RUN npm install --ignore-scripts

# Copy root tsconfig.json to the path expected by apps/parser/tsconfig.json's "extends": "../../tsconfig.json"
COPY tsconfig.json /app/tsconfig.json

# Copy source and scripts
COPY apps/parser/tsconfig.json ./
COPY apps/parser/tsconfig.build.json ./
COPY apps/parser/src ./src
COPY apps/parser/scripts ./scripts

RUN npm run build

RUN chmod +x scripts/*.sh

RUN chown -R node:node /app

RUN mkdir -p /home/node/.local /home/node/.cache && \
  chown -R node:node /home/node

USER node

CMD ["node", "dist/main.js"]
