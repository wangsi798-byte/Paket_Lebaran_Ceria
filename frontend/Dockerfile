FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN rm -f package-lock.json .npmrc && \
    npm install --registry https://registry.npmjs.org

# Copy project files
COPY . .

# Build production
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Run command
CMD ["serve", "-s", "build", "-l", "3000"]
