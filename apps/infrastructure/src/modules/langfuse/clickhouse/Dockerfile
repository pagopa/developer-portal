# Use the specific version requested
FROM docker.io/clickhouse/clickhouse-server:25.8.8.26-alpine

# 1. Switch to root briefly to handle file permissions
USER root

# 2. Copy your custom config into the config.d directory
# This overrides settings in the main config.xml without replacing the whole file
COPY config.xml /etc/clickhouse-server/config.xml

# 3. Ensure the clickhouse user owns the new configuration file
# and has access to the necessary directories
RUN chown clickhouse:clickhouse /etc/clickhouse-server/config.xml && \
    chmod 644 /etc/clickhouse-server/config.xml

# 4. Set the default user to 'clickhouse' (UID 101 in this image)
# This ensures the container does not run as root in ECS
USER clickhouse

# 5. Standard ClickHouse ports
EXPOSE 8123 9000 9009

# 6. Use the standard entrypoint
ENTRYPOINT ["/usr/bin/clickhouse-server"]
CMD ["--config-file=/etc/clickhouse-server/config.xml"]