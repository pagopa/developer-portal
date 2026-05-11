FROM public.ecr.aws/lambda/python:3.12@sha256:2b907880cd2ebc58e8913e939e81627d57307a62e536faf0a8232b74e2557d4a

ENV PYTHONPATH=$LAMBDA_TASK_ROOT

RUN dnf install -y atk cups-libs gtk3 libXcomposite alsa-lib \
  libXcursor libXdamage libXext libXi libXrandr libXScrnSaver \
  libXtst pango at-spi2-atk libXt xorg-x11-server-Xvfb \
  xorg-x11-xauth dbus-glib dbus-glib-devel nss mesa-libgbm jq unzip

COPY ./docker/chrome-installer.sh ./chrome-installer.sh
RUN ./chrome-installer.sh
RUN rm ./chrome-installer.sh

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

RUN echo "appuser:x:1000:1000::/home/appuser:/bin/sh" >> /etc/passwd \
  && mkdir -p /home/appuser \
  && chown -R 1000:1000 /home/appuser ${LAMBDA_TASK_ROOT}

USER appuser

CMD ["src.lambda_refresh_index.lambda_handler"]
