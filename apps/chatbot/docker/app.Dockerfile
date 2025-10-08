FROM public.ecr.aws/lambda/python:3.12
ARG DEBIAN_FRONTEND=noninteractive

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT
COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT
RUN poetry config virtualenvs.create false
RUN poetry install --only main

# Download the OpenTelemetry Layer with Application Signals Support 
RUN yum install -y unzip wget 
RUN wget https://github.com/aws-observability/aws-otel-python-instrumentation/releases/latest/download/layer.zip -O /tmp/layer.zip 

# Extract and include Lambda layer contents 
RUN mkdir -p /opt && \ 
unzip /tmp/layer.zip -d /opt/ && \ 
chmod -R 755 /opt/ && \ 
rm /tmp/layer.zip 


COPY . ${LAMBDA_TASK_ROOT}
RUN python ./scripts/nltk_download.py
RUN python ./scripts/spacy_download.py

CMD ["src.app.main.handler"]
