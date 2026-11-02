# Multi-stage Dockerfile for Next.js Enterprise Standalone
FROM node:20.19-alpine AS builder
WORKDIR /app

# Enable libc6 compatibility for alpine
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build application with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Runner stage
FROM node:20.19-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache tini libc6-compat && adduser -D -u 1001 appuser

# Copy standalone build and static assets
COPY --from=builder --chown=appuser:appuser /app/.next/standalone ./
COPY --from=builder --chown=appuser:appuser /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appuser /app/public ./public

USER appuser
EXPOSE 3000

ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]
