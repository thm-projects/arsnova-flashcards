# THIS DOCKERFILE IS SUPPOSED TO RUN ON THE KANIKO EXECUTOR
# ON SCM-ADMIN - ARTIFACT FROM PIPELINE NEEDED!
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

# copy the artifact from gitlab CI
# WORKS ONLY ON THE THM SCM-BUILDER AND INSIDE OF A PIPELINE
RUN mkdir -p "$BUILD_DIR/bundle"
COPY build/bundle "$BUILD_DIR/bundle"
RUN (cd "$BUILD_DIR" && cd bundle/programs/server && npm install)

# build optimized images from Alpine
FROM node:12-alpine
ENV APP_HOME=/usr/app/
ENV BUILD_DIR=/usr/build/
WORKDIR $APP_HOME

# copy build artifacts from previous stage
COPY --from=METEOR_BASE $BUILD_DIR .
COPY .docker/app/settings_docker.json .
RUN export METEOR_SETTINGS="`cat settings_docker.json`"
EXPOSE 3000

COPY .docker/app/entrypoint.sh .
ENTRYPOINT ["entrypoint.sh"]
