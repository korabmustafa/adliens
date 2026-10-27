# Build the frontend once; the runtime image only contains static assets.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY index.html vite.config.js tailwind.config.js postcss.config.js ./
COPY src ./src
# Vite variables are compiled into the browser bundle; they are not secrets.
ARG VITE_AGENCY_FILM_URL=
ENV VITE_AGENCY_FILM_URL=${VITE_AGENCY_FILM_URL}
ARG VITE_USE_MOCK_DATA=true
ARG VITE_API_BASE_URL=http://localhost:3000/api
ENV VITE_USE_MOCK_DATA=${VITE_USE_MOCK_DATA} \
    VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM nginx:stable-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
