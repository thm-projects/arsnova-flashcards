# THIS DOCKERFILE IS USED FOR DEVELOP/DEBUG ONLY!
# see .docker dir for production files
FROM node:12

ARG UID=1000
ARG GID=1000

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

RUN mkdir -p /home/node/node_modules
RUN mkdir -p /home/node/local

RUN npm config set prefix "/home/node/node_modules"

RUN chown -R $UID:$GID /home/node/node_modules /home/node/local /home/node/.config

USER $UID:$GID
# install meteor
RUN curl https://install.meteor.com/ | sh

ENTRYPOINT ["/home/node/app/docker_entrypoint.sh"]
CMD ["settings_debug.json"]
