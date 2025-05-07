FROM docker.io/python:3.12

# install git to be able to install requirements from git
RUN apt-get update && apt-get install -y git
{% if cookiecutter.saml_authentication == "Yes, please!" %}
RUN apt-get install -y libxml2-dev libxmlsec1-dev libxmlsec1-openssl
{% endif %}
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /backend

# set environment variables
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip
COPY requirements.txt /backend/
RUN pip install -r requirements.txt

