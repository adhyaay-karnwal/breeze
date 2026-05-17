FROM node:20-slim

RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

WORKDIR /app

# Copy only what's needed for migrations
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/environment ./packages/environment
COPY packages/logger ./packages/logger
COPY packages/db ./packages/db

# Install dependencies (same pattern as other Dockerfiles in this repo —
# pnpm resolves only the workspace packages present in the build context)
RUN pnpm install --frozen-lockfile

# Build the environment package (required by drizzle config)
RUN pnpm --filter @breeze/environment build
RUN pnpm --filter @breeze/logger build
RUN pnpm --filter @breeze/db build

CMD ["pnpm", "--filter", "@breeze/db", "db:migrate"]
