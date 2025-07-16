# thanks to https://github.com/umihico/docker-selenium-lambda/releases
FROM public.ecr.aws/lambda/python@sha256:8a7e192732832465cb613ab8bbcc8c7b8c926f781947cae2963bc97db507c2de as build
RUN dnf install -y unzip && \
    curl -Lo "/tmp/chromedriver-linux64.zip" "https://storage.googleapis.com/chrome-for-testing-public/138.0.7204.157/linux64/chromedriver-linux64.zip" && \
    curl -Lo "/tmp/chrome-linux64.zip" "https://storage.googleapis.com/chrome-for-testing-public/138.0.7204.157/linux64/chrome-linux64.zip" && \
    unzip /tmp/chromedriver-linux64.zip -d /opt/ && \
    unzip /tmp/chrome-linux64.zip -d /opt/

FROM public.ecr.aws/lambda/python@sha256:8a7e192732832465cb613ab8bbcc8c7b8c926f781947cae2963bc97db507c2de
RUN dnf install -y atk g++ cups-libs gtk3 libXcomposite alsa-lib \
    libXcursor libXdamage libXext libXi libXrandr libXScrnSaver \
    libXtst pango at-spi2-atk libXt xorg-x11-server-Xvfb \
    xorg-x11-xauth dbus-glib dbus-glib-devel nss mesa-libgbm
RUN pip install --upgrade pip \
  selenium==4.34.2 \
  poetry
COPY --from=build /opt/chrome-linux64 /opt/chrome
COPY --from=build /opt/chromedriver-linux64 /opt/

WORKDIR $LAMBDA_TASK_ROOT
COPY pyproject.toml $LAMBDA_TASK_ROOT
COPY poetry.lock $LAMBDA_TASK_ROOT
RUN poetry config virtualenvs.create false
RUN poetry install --verbose

#COPY ./src ${LAMBDA_TASK_ROOT}/src
#COPY ./scripts ${LAMBDA_TASK_ROOT}/scripts
#COPY ./config ${LAMBDA_TASK_ROOT}/config
COPY ./ ${LAMBDA_TASK_ROOT}/

CMD ["src.lambdas.create_vector_index.lambda_handler"]
