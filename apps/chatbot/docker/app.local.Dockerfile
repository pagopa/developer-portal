FROM python:3.12.4-slim-bullseye@sha256:26ce493641ad3b1c8a6202117c31340c7bbb2dc126f1aeee8ea3972730a81dc6
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y \
  gcc \
  curl \
  wget \
  jq \
  zip \
  less

ENV PYTHONPATH=/app
ENV PIP_ROOT_USER_ACTION=ignore

RUN pip install --upgrade pip \
  && pip install poetry

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install

RUN mkdir -p /tmp/.aws-lambda-rie \
    && curl -Lo /tmp/.aws-lambda-rie/aws-lambda-rie https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie \
    && chmod +x /tmp/.aws-lambda-rie/aws-lambda-rie \
    && cp /tmp/.aws-lambda-rie/aws-lambda-rie /usr/local/bin/aws-lambda-rie \
    && rm -rf /tmp/.aws-lambda-rie

WORKDIR /app
COPY ./pyproject.toml .
COPY ./poetry.lock .
COPY ./src ./src
COPY ./config ./config
COPY ./scripts ./scripts
COPY ./notebooks ./notebooks
COPY ./.google_service_account.json .

RUN poetry config virtualenvs.create false
RUN poetry install --with dev

RUN python ./scripts/nltk_download.py
RUN python ./scripts/spacy_download.py

CMD ["fastapi", "dev", "src/app/main.py", "--port", "8080", "--host", "0.0.0.0", "--loop", "asyncio"]
