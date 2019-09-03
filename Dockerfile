FROM ubuntu:18.04

ENV METEOR_ALLOW_SUPERUSER=1

# Copy test files
COPY . /cards

# Make the reports folder available vor mounting
VOLUME /robotframework/reports

# Install packages
RUN apt-get update \
    && apt-get install --quiet --assume-yes \
      python-pip \
      unzip \
      wget \
      curl \
      git \
      mongo-tools

# Upgrade pip
RUN pip install --upgrade pip

# Install robotframework
RUN pip install robotframework requests

# Install robotframework libraries
RUN pip install -U \
    robotframework-seleniumlibrary \
    robotframework-requests

RUN wget --no-verbose https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg --install google-chrome-stable_current_amd64.deb; apt-get --fix-broken --assume-yes install
RUN apt-get install -f

# Install google chrome and google chrome driver
RUN wget --no-verbose --output-document \
      /tmp/chromedriver_linux64.zip \
      http://chromedriver.storage.googleapis.com/2.44/chromedriver_linux64.zip && \
    unzip -qq /tmp/chromedriver_linux64.zip -d /opt/chromedriver && \
    chmod +x /opt/chromedriver/chromedriver && \
    ln -fs /opt/chromedriver/chromedriver /usr/local/bin/chromedriver

# install meteor
RUN curl https://install.meteor.com/ | sh

# Set the work dir
WORKDIR /cards

# Install cards project
RUN meteor npm install

# Start the server
ENTRYPOINT ["meteor", "--settings", "settings_debug.json"]
