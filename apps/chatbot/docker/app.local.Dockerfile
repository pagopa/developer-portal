FROM python:3.12.4-slim-bullseye
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y \
  curl

ENV PYTHONPATH=/app

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR /app
COPY pyproject.toml .
COPY poetry.lock .
RUN poetry config virtualenvs.create false
RUN poetry install
RUN python -m spacy download it_core_news_md
RUN python -m spacy download en_core_web_md

COPY . .

CMD ["fastapi", "dev", "src/app/main.py", "--port", "8080", "--host", "0.0.0.0"]
