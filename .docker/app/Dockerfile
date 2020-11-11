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
RUN mkdir -p "$BUILD_DIR" /home/node/local/db
RUN rm -rf "$APP_HOME".meteor/local && ln -fs /home/node/local "$APP_HOME".meteor/local
RUN npm install
RUN /bin/echo -e "\e[1;31m           ---------------          \e[0m" && \
    /bin/echo -e "\e[1;36m      +++++++++++++++++++++++++     \e[0m" && \
    /bin/echo -e "\e[1;32m ===================================\e[0m" && \
    echo " " && \
    echo " " && \
    /bin/echo -e "\e[1;33m    Going to build the meteor app   \e[0m" && \
    /bin/echo -e "\e[1;33m        This take a LONG time       \e[0m" && \
    /bin/echo -e "\e[1;33m          Please be patient         \e[0m" && \
    echo " " && \
    echo " " && \
    /bin/echo -e "\e[1;32m ===================================\e[0m" && \
    /bin/echo -e "\e[1;36m      +++++++++++++++++++++++++     \e[0m" && \
    /bin/echo -e "\e[1;31m           ---------------          \e[0m"
RUN (meteor build --allow-superuser --server-only --directory "$BUILD_DIR" >> build.log 2>&1) ; cat build.log
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
