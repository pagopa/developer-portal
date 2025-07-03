FROM public.ecr.aws/lambda/python:3.12
ARG DEBIAN_FRONTEND=noninteractive

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT
COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT
RUN poetry config virtualenvs.create false
RUN poetry install

#COPY ./src ${LAMBDA_TASK_ROOT}/src
#COPY ./scripts ${LAMBDA_TASK_ROOT}/scripts
#COPY ./config ${LAMBDA_TASK_ROOT}/config
COPY ./ ${LAMBDA_TASK_ROOT}/

RUN python ./scripts/print_cwd.py

RUN python ./scripts/nltk_download.py
RUN python ./scripts/spacy_download.py

CMD ["src.lambdas.create_vector_index.lambda_handler"]
