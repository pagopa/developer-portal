FROM node:18.15.0-alpine

# Install dependencies:
RUN apk update && apk upgrade && \
  apk add --update --no-cache \
    bash \
    curl \
    fontconfig \
    git \
    libc6-compat \
    mc \
    sudo \
    vim

WORKDIR /developer-portal
ENV PATH /developer-portal/node_modules/.bin:$PATH

# Non root user
ARG USER=node
ENV USER $USER
run addgroup -S sudo \
  && adduser $USER sudo \
  && echo "$USER ALL=NOPASSWD: ALL" >> /etc/sudoers.d/50-$USER \
  && chown -R $USER:$USER /developer-portal

USER $USER

COPY docker/developer-portal-development.entrypoint.sh /usr/bin/
RUN sudo chmod +x /usr/bin/developer-portal-development.entrypoint.sh
ENTRYPOINT ["developer-portal-development.entrypoint.sh"]

CMD ["turbo", "run", "dev"]
