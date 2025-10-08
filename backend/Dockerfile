# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run with PM2 in cluster mode
FROM node:20-alpine
WORKDIR /app

# Install pm2 globally
RUN npm install -g pm2

# Copy built app
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose backend port
EXPOSE 3000

# Run app with PM2 cluster mode (2 instances)
CMD ["pm2-runtime", "dist/main.js", "-i", "2"]
