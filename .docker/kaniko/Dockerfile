# THIS DOCKERFILE IS SUPPOSED TO RUN ON THE KANIKO EXECUTOR
# ON SCM-ADMIN - ARTIFACT FROM PIPELINE NEEDED!
FROM node:12 AS METEOR_BASE

ARG BUILD_DIR=$BUILD_DIR
ARG BUNDLE_DIR=$BUNDLE_DIR

ENV APP_HOME=/usr/app/
ENV DOCKER_BUILD_DIR=/usr/build/
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

# copy the artifact from gitlab CI
# WORKS ONLY ON THE THM SCM-BUILDER AND INSIDE OF A PIPELINE
RUN mkdir -p "$DOCKER_BUILD_DIR/bundle"
COPY "$BUNDLE_DIR" "$DOCKER_BUILD_DIR/bundle"
RUN (cd "$DOCKER_BUILD_DIR" && cd bundle/programs/server && npm install)

# build optimized images from Alpine
FROM node:12-alpine
ENV APP_HOME=/usr/app/
ENV DOCKER_BUILD_DIR=/usr/build/
WORKDIR $APP_HOME

# copy build artifacts from previous stage
COPY --from=METEOR_BASE $DOCKER_BUILD_DIR .
COPY .docker/kaniko/settings_docker.json .

# copy entrypoint from repository
COPY .docker/kaniko/entrypoint.sh /

# expose the node.js standard port
EXPOSE 3000

# Overwrite CMD for testing purposes
# RUN chmod +x /entrypoint.sh
# CMD ["/entrypoint.sh"]
CMD ["/bin/sh"]
