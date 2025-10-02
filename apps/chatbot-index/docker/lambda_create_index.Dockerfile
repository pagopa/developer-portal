FROM public.ecr.aws/lambda/python:3.12
ARG DEBIAN_FRONTEND=noninteractive

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN dnf install -y wget unzip jq shadow-utils \
  && curl -sSL https://dl.google.com/linux/linux_signing_key.pub -o /etc/pki/rpm-gpg/RPM-GPG-KEY-google \
  && echo '[google-chrome]' > /etc/yum.repos.d/google-chrome.repo \
  && echo 'name=google-chrome - x86_64' >> /etc/yum.repos.d/google-chrome.repo \
  && echo 'baseurl=https://dl.google.com/linux/chrome/rpm/stable/x86_64' >> /etc/yum.repos.d/google-chrome.repo \
  && echo 'enabled=1' >> /etc/yum.repos.d/google-chrome.repo \
  && echo 'gpgcheck=1' >> /etc/yum.repos.d/google-chrome.repo \
  && echo 'gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-google' >> /etc/yum.repos.d/google-chrome.repo \
  && dnf install -y google-chrome-stable \
  \
  # Install chromedriver using Chrome for Testing API
  && DRIVER_VERSION=$(curl -s https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json \
  | jq -r ".channels.Stable.version") \
  && wget -q "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/${DRIVER_VERSION}/linux64/chromedriver-linux64.zip" \
  && unzip chromedriver-linux64.zip -d /usr/bin/ \
  && mv /usr/bin/chromedriver-linux64/chromedriver /usr/bin/chromedriver \
  && rm -rf chromedriver-linux64.zip /usr/bin/chromedriver-linux64 \
  \
  && dnf clean all

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT
COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT
COPY --from=039804388894.dkr.ecr.eu-south-1.amazonaws.com/lambda-extension/otel-collector:v1 /src/collector /opt/extensions/collector
COPY config/adot-config.yaml /opt/collector-config/config.yaml
RUN poetry config virtualenvs.create false
RUN poetry install

COPY ./ ${LAMBDA_TASK_ROOT}/

CMD ["src.lambda_create_index.lambda_handler"]
