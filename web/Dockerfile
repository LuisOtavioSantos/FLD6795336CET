# ==========================================
# ESTÁGIO DE BUILD
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Cria a build de produção (gera a pasta .next)
RUN npm run build

# ==========================================
# ESTÁGIO DE PRODUÇÃO (Runner)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app
# Copia apenas o necessário do estágio de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
