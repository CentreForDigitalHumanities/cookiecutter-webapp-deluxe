FROM docker.io/python:3.11-alpine3.20

# set environment variables
ENV PYTHONUNBUFFERED=1


# install git to be able to install requirements from git
RUN apk add git musl-dev libffi-dev postgresql-dev
{% if cookiecutter.saml_authentication == "Yes, please!" %}
RUN apk add gcc xmlsec
{% endif %}

WORKDIR /backend

RUN pip install --upgrade pip
COPY requirements.txt /backend
RUN pip install -r requirements.txt

# Cleanup build-only packages
RUN apk del git musl-dev libffi-dev
{% if cookiecutter.saml_authentication == "Yes, please!" %}
RUN apk del gcc
{% endif %}
