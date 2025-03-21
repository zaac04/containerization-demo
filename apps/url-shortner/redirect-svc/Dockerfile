#build
FROM golang:alpine as build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-w -s" -o redirect_svc 


#final-stage
FROM alpine
WORKDIR /app
RUN wget -q -O - https://github.com/zaac04/lockenv/releases/download/v2.1.2/install.sh | sh -s v2.1.2 lockenv-linux-server-amd64 
COPY --from=build /app/redirect_svc ./
CMD [ "./redirect_svc" ]