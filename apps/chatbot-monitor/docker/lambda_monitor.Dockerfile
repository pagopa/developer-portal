FROM public.ecr.aws/lambda/python:3.12@sha256:2b907880cd2ebc58e8913e939e81627d57307a62e536faf0a8232b74e2557d4a

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN dnf install -y \
  git

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT

COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT

RUN poetry config virtualenvs.create false
RUN poetry install

COPY ./src ${LAMBDA_TASK_ROOT}/src
COPY ./scripts ${LAMBDA_TASK_ROOT}/scripts
COPY ./config ${LAMBDA_TASK_ROOT}/config
COPY ./docker/files ${LAMBDA_TASK_ROOT}/files

RUN python ./scripts/nltk_download.py
RUN python ./scripts/spacy_download.py

RUN echo "appuser:x:1000:1000::/home/appuser:/bin/sh" >> /etc/passwd \
  && mkdir -p /home/appuser \
  && chown -R 1000:1000 /home/appuser ${LAMBDA_TASK_ROOT}

USER appuser

CMD ["src.lambda_function.lambda_handler"]
