# ---- Build frontend ----
FROM node:20 AS builder
WORKDIR /app
COPY client ./client
RUN cd client && npm install && npm run build

# ---- Run backend + serve frontend ----
FROM node:20
WORKDIR /app
COPY server ./server
COPY --from=builder /app/client/dist ./server/public
WORKDIR /app/server

# Install backend deps
RUN npm install

# Expose port
EXPOSE 8080

# Start command
CMD ["node", "index.js"]
