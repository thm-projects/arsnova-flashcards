# THIS DOCKERFILE IS USED FOR DEVELOP/DEBUG ONLY!
# see .docker dir for production files
FROM node:12

ENV HOME=/home/node/
WORKDIR $HOME

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

USER node
# install meteor
RUN curl https://install.meteor.com/ | sh

ENTRYPOINT ["/home/node/app/docker_entrypoint.sh"]
CMD ["settings_debug.json"]
