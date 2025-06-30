FROM python:3.12.4-slim-bullseye
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y \
  gcc \
  curl \
  wget \
  jq \
  zip

RUN wget https://github.com/rphrp1985/selenium_support/raw/main/chrome_114_amd64.deb && \
  apt-get install -y ./chrome_114_amd64.deb && \
  wget https://chromedriver.storage.googleapis.com/114.0.5735.90/chromedriver_linux64.zip && \
  unzip chromedriver_linux64.zip && \
  mv chromedriver /usr/bin/chromedriver

ENV PYTHONPATH=/app
ENV PIP_ROOT_USER_ACTION=ignore

RUN pip install --upgrade pip \
  && pip install poetry awscli

WORKDIR /app
COPY ./pyproject.toml .
# COPY ./poetry.lock .
COPY ./src ./src
# COPY ./config ./config
COPY ./scripts ./scripts
COPY ./notebooks ./notebooks

RUN poetry config virtualenvs.create false
RUN poetry install

#RUN python ./scripts/nltk_download.py
#RUN python ./scripts/spacy_download.py

CMD ["fastapi", "dev", "src/app/main.py", "--port", "8080", "--host", "0.0.0.0", "--loop", "asyncio"]
