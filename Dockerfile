# TheMailSignature on a single host.
#
# Node 24 is not optional: the app uses node:sqlite, the built-in driver, which
# arrived in 22 and is stable in 24. There is no database container to run.
FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The public site URL is read at build time by the metadata and the sitemap.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Both live on a mounted volume, so a redeploy never takes the database or an
# image that sent mail still points at.
ENV DATABASE_PATH=/data/app.db
ENV UPLOAD_DIR=/data/uploads
ENV OUTBOX_DIR=/data/outbox

# Next's standalone output ships only the files the server actually needs.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# node:24 images already have a non-root `node` user; the volume is chowned in
# compose so the app can write to it.
RUN mkdir -p /data && chown -R node:node /data /app
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
