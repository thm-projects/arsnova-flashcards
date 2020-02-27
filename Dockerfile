# THIS DOCKERFILE IS USED FOR DEVELOP/DEBUG ONLY!
# see .docker dir for production files
FROM node:12

ENV APP_HOME=/usr/app/
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

COPY docker_entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["settings_debug.json"]
