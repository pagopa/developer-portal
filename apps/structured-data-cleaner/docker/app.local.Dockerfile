FROM python:3.12.4-slim-bullseye
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  gcc \
  curl \
  wget \
  jq \
  zip \
  less && \
  rm -rf /var/lib/apt/lists/*

ENV PYTHONPATH=/app
ENV PIP_ROOT_USER_ACTION=ignore

RUN pip install --upgrade pip \
  && pip install poetry

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm awscliv2.zip

WORKDIR /app
COPY ./pyproject.toml .
COPY ./poetry.lock .

RUN poetry config virtualenvs.create false
RUN poetry install

COPY ./src ./src
COPY ./scripts ./scripts

RUN chmod +x /app/scripts/*.sh

RUN groupadd -r appuser && useradd -r -g appuser -u 1000 appuser
RUN chown -R appuser:appuser /app

RUN mkdir -p /home/appuser/.local /home/appuser/.cache && \
  chown -R appuser:appuser /home/appuser

USER appuser

CMD ["python", "src/main.py"]
