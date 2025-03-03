FROM ghcr.io/grafbase/gateway:latest

COPY grafbase.toml /etc/grafbase.toml

CMD ["--config", "/etc/grafbase.toml", "--listen-address", "0.0.0.0:5000", "--graph-ref", "demo-graph@main"]
