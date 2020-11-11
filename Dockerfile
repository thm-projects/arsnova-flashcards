# THIS DOCKERFILE IS USED FOR DEVELOP/DEBUG ONLY!
# see .docker dir for production files
FROM node:12

# Get the args from compose - use 1000 as fallback
ARG UID_GID=1000:1000

# Set up proper home for node
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

# Install node build tool
RUN npm install -g node-gyp

# Setup mount points with correct permissions
RUN mkdir -p /app /home/node
RUN chown -R $UID_GID /app /home/node

# Set proper user for development
USER $UID_GID

# Set the proper entrypoint
ENTRYPOINT ["/app/docker_entrypoint.sh"]
CMD ["settings_debug.json"]
