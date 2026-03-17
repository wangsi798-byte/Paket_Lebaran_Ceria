FROM node:16-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 5000

# Environment
ENV NODE_ENV=production

# Run command
CMD ["npm", "start"]