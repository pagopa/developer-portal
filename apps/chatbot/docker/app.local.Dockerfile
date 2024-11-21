FROM python:3.12.4-slim-bullseye
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y \
  curl \
  wget \
  zip

RUN wget https://github.com/rphrp1985/selenium_support/raw/main/chrome_114_amd64.deb && \
  apt-get install -y ./chrome_114_amd64.deb && \
  wget https://chromedriver.storage.googleapis.com/114.0.5735.90/chromedriver_linux64.zip && \
  unzip chromedriver_linux64.zip && \
  mv chromedriver /usr/bin/chromedriver

ENV PYTHONPATH=/app

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR /app
COPY ./pyproject.toml .
COPY ./poetry.lock .
COPY ./src ./src
COPY ./config ./config

RUN poetry config virtualenvs.create false
RUN poetry install

CMD ["fastapi", "dev", "src/app/main.py", "--port", "8080", "--host", "0.0.0.0"]
