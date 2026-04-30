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
  ./aws/install && \
  rm awscliv2.zip

RUN curl -Lo /usr/local/bin/aws-lambda-rie \
  https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie && \
  chmod +x /usr/local/bin/aws-lambda-rie

WORKDIR /app
COPY ./pyproject.toml .
COPY ./poetry.lock .

RUN poetry config virtualenvs.create false
RUN poetry install --with dev

COPY ./CHANGELOG.md .
COPY ./src ./src
COPY ./config ./config
COPY ./scripts ./scripts
COPY ./notebooks ./notebooks
COPY ./.google_service_account.json .

RUN python ./scripts/nltk_download.py

RUN groupadd -r appuser && useradd -r -g appuser -u 1000 appuser
RUN chown -R appuser:appuser /app

RUN mkdir -p /home/appuser/.local /home/appuser/.jupyter /home/appuser/.cache && \
  chown -R appuser:appuser /home/appuser

USER appuser

ENTRYPOINT ["bash", "./scripts/entrypoint.sh"]
CMD ["bash", "./scripts/run.local.sh"]
