FROM node:12 AS METEOR_BASE

ENV APP_HOME=/usr/app/
ENV BUILD_DIR=/usr/build/
WORKDIR $APP_HOME

# Install packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl \
      g++ \
      build-essential \
      mongodb \
    && \
    apt-get -y clean && \
    rm -rf /var/lib/apt/lists/*

# install node build tool
RUN npm install -g node-gyp

# install meteor
RUN curl https://install.meteor.com/ | sh

# build the meteor app
COPY . $APP_HOME
RUN npm install
RUN mkdir -p "$BUILD_DIR"
RUN meteor build --allow-superuser --server-only --directory "$BUILD_DIR"
RUN (cd "$BUILD_DIR" && cd bundle/programs/server && npm install)

# build optimized images from Alpine
FROM node:12-alpine
ENV APP_HOME=/usr/app/
ENV BUILD_DIR=/usr/build/
WORKDIR $APP_HOME

# copy build artifacts from previous stage
COPY --from=METEOR_BASE $BUILD_DIR .
COPY .docker/app/settings_docker.json .

COPY .docker/app/entrypoint.sh /
RUN chmod +x /entrypoint.sh

EXPOSE 3000

CMD ["/entrypoint.sh"]
