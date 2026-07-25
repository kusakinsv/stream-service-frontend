# Этап 1: Сборка
FROM node:22-alpine AS builder

WORKDIR /app

# Копируем зависимости
COPY ../package*.json ./
COPY ../yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем исходники
COPY . .

ARG VITE_SEARCHER_URL
ARG VITE_CORE_URL
ENV VITE_SEARCHER_URL=$VITE_SEARCHER_URL
ENV VITE_CORE_URL=$VITE_CORE_URL

# Собираем приложение
RUN yarn build

# Этап 2: Продакшен (с Nginx)
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфиг Nginx (опционально)
COPY ../nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]