FROM node:24-alpine AS dev

WORKDIR /app
RUN npm i -g pnpm@10

COPY package.json pnpm-lock.yaml ./
COPY . .

ENV CI=true
RUN pnpm install --frozen-lockfile

EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]


FROM node:24-alpine AS builder

WORKDIR /app
RUN npm i -g pnpm@10

COPY package.json pnpm-lock.yaml ./
COPY . .

ENV CI=true
RUN pnpm install --frozen-lockfile
RUN pnpm build


FROM nginx:stable-alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]