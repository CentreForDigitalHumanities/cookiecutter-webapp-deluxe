FROM python:3.6-alpine

# to be able to install requirements from git
RUN apk update && apk add --no-cache git openssh
# build dependencies for psycopg2
RUN apk add --virtual .build-deps gcc python3-dev musl-dev postgresql-dev
# runtime dependency of psycopg2
RUN apk add --no-cache libpq

WORKDIR /app/backend

COPY requirements.txt /backend/

RUN pip3 install -r /backend/requirements.txt

COPY . /backend