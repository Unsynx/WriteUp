FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install

# Install `serve` globally to serve production builds
RUN npm install -g serve

COPY . .

# Expose both dev and production ports
EXPOSE 5173 4173

# Add entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Use entrypoint to switch behavior
CMD ["docker-entrypoint.sh"]