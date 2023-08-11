FROM golang:1.18

WORKDIR /home/chains
RUN apt-get install curl git
RUN curl -L https://get.ignite.com/cli@v0.22.1! | bash
RUN git clone -b wager-denomination https://github.com/cosmos/b9-checkers-academy-draft.git /home/chains

ARG configyml
COPY ${configyml} /home/chains/config.yml
ARG prefix
RUN sed -i "s/\"cosmos\"/\"${prefix}\"/g" app/app.go

COPY ./run-chains.sh /home/chains
RUN chmod +x ./run-chains.sh

ENTRYPOINT ["/bin/bash", "-c", "/home/chains/run-chains.sh"]
EXPOSE 26657 1317 4500