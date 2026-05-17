FROM node:20-slim
LABEL org.opencontainers.image.source="https://github.com/adhyaay-karnwal/breeze"

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/environment ./packages/environment
COPY packages/logger ./packages/logger
COPY packages/shared ./packages/shared
COPY packages/queue ./packages/queue
COPY packages/gateway-clients ./packages/gateway-clients
COPY packages/triggers ./packages/triggers
COPY packages/services ./packages/services
COPY packages/providers ./packages/providers
COPY packages/db ./packages/db
COPY packages/triggers ./packages/triggers
COPY apps/trigger-service ./apps/trigger-service

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build workspace packages
RUN pnpm --filter @breeze/logger build
RUN pnpm --filter @breeze/shared build
RUN pnpm --filter @breeze/environment build
RUN pnpm --filter @breeze/queue build
RUN pnpm --filter @breeze/db build
RUN pnpm --filter @breeze/gateway-clients build
RUN pnpm --filter @breeze/triggers build
RUN pnpm --filter @breeze/services build

EXPOSE 3001

WORKDIR /app/apps/trigger-service

CMD ["pnpm", "start"]
