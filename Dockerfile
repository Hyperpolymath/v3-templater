# Multi-stage Dockerfile for v3-templater
# RSR PLATINUM: Container support for reproducible builds

# Stage 1: Build
FROM node:25-alpine AS builder

LABEL maintainer="v3-templater maintainers <maintainers@hyperpolymath.dev>"
LABEL org.opencontainers.image.source="https://github.com/Hyperpolymath/v3-templater"
LABEL org.opencontainers.image.description="Modern, secure templating engine"
LABEL org.opencontainers.image.licenses="MIT AND Palimpsest-0.8"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:25-alpine

# Add non-root user for security
RUN addgroup -g 1001 -S v3t && \
    adduser -S v3t -u 1001

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder --chown=v3t:v3t /app/dist ./dist
COPY --from=builder --chown=v3t:v3t /app/node_modules ./node_modules
COPY --from=builder --chown=v3t:v3t /app/package.json ./

# Switch to non-root user
USER v3t

# Expose no ports (CLI tool, not a service)

# Health check (verify CLI works)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/cli.js --version || exit 1

# Default command (show help)
ENTRYPOINT ["node", "dist/cli.js"]
CMD ["--help"]
