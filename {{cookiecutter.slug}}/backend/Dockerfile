FROM python:3.6

# git to be able to install requirements from git
RUN apt-get update && apt-get install git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY requirements.txt /app/
RUN pip3 install -r requirements.txt

ENTRYPOINT ["/app/entrypoint.sh"]