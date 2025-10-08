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

# Download the OpenTelemetry Layer with Application Signals Support 
RUN dnf install unzip wet -y
RUN wget https://github.com/aws-observability/aws-otel-python-instrumentation/releases/latest/download/layer.zip -O /tmp/layer.zip 

# Extract and include Lambda layer contents 
RUN mkdir -p /opt && \ 
unzip /tmp/layer.zip -d /opt/ && \ 
chmod -R 755 /opt/ && \ 
rm /tmp/layer.zip 

COPY ./ ${LAMBDA_TASK_ROOT}/

CMD ["src.lambda_function.lambda_handler"]
