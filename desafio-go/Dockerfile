# first stage does the building
# for UX purposes, I'm naming this stage `build-stage`

FROM golang:alpine as build-stage
ENV GO111MODULE=off
WORKDIR /go-hello
COPY hello-world.go .
RUN go build -o hello-world .


# starting second stage
FROM scratch

# copy the binary from the `build-stage`
COPY --from=build-stage /go-hello/hello-world /hello-world

CMD ["/hello-world"]
