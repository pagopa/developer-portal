FROM python:3.12.4-slim-bullseye
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y \
  gcc \
  curl \
  wget \
  jq \
  zip \
  less

RUN curl -Lo /usr/local/bin/aws-lambda-rie \
  https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie && \
  chmod +x /usr/local/bin/aws-lambda-rie && \
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install

ENV PYTHONPATH=/app
ENV PIP_ROOT_USER_ACTION=ignore

RUN pip install --upgrade pip \
  && pip install poetry

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install

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
