FROM python:3.6-alpine

# git to be able to install requirements from git
RUN apk update && apk add --no-cache git openssh
# build dependencies for psycopg2
RUN apk add --virtual .build-deps gcc python3-dev musl-dev postgresql-dev
# runtime dependency of psycopg2
RUN apk add --no-cache libpq

WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY requirements.txt /app/
RUN pip3 install -r requirements.txt

COPY . /app

ENTRYPOINT ["/app/entrypoint.sh"]