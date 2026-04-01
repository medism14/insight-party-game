# ── Stage 1: Build ──────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_BASE_PATH
RUN VITE_BASE_PATH="${VITE_BASE_PATH:-/}" npm run build

# ── Stage 2: Serve with nginx ──────────────────────────────────────────
FROM nginx:1.27-alpine AS production

RUN apk add --no-cache curl
RUN rm /etc/nginx/conf.d/default.conf
RUN sed -i -E 's|^pid[[:space:]]+[^;]+;|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf \
  && sed -i '/^user /d' /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run /run
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
