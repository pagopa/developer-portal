FROM public.ecr.aws/lambda/python:3.12

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN dnf install -y atk cups-libs gtk3 libXcomposite alsa-lib \
  libXcursor libXdamage libXext libXi libXrandr libXScrnSaver \
  libXtst pango at-spi2-atk libXt xorg-x11-server-Xvfb \
  xorg-x11-xauth dbus-glib dbus-glib-devel nss mesa-libgbm jq unzip less

COPY ./docker/chrome-installer.sh ./chrome-installer.sh
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm awscliv2.zip && \
  chmod +x ./chrome-installer.sh && \
  ./chrome-installer.sh && \
  rm ./chrome-installer.sh

RUN pip install --upgrade pip \
  && pip install poetry

WORKDIR $LAMBDA_TASK_ROOT

COPY ./pyproject.toml ${LAMBDA_TASK_ROOT}/
COPY ./poetry.lock ${LAMBDA_TASK_ROOT}/

RUN poetry config virtualenvs.create false
RUN poetry install --with test

COPY ./src ${LAMBDA_TASK_ROOT}/src
COPY ./scripts ${LAMBDA_TASK_ROOT}/scripts
COPY ./config ${LAMBDA_TASK_ROOT}/config
COPY ./docker/files ${LAMBDA_TASK_ROOT}/files

RUN chown -R 1000:1000 ${LAMBDA_TASK_ROOT}

USER 1000

CMD ["src.lambda_refresh_index.lambda_handler"]
