FROM debian:jessie

RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get -y dist-upgrade

RUN apt-get install -y \
        python \
        python-dev \
        python-pip \
        make \
        build-essential \
        wget \
        curl \
    && apt-get clean

ADD requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

ADD app /app
WORKDIR /app

CMD ["python", "main.py"]

EXPOSE 5000
