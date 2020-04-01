FROM python:3.6-alpine

# RUN apk update && apk add --no-cache build-base
WORKDIR /backend

COPY requirements.txt /backend/

RUN pip3 install -r requirements.txt

COPY . /backend