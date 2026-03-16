FROM node:16-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

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