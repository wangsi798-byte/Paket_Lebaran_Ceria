FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN rm -f package-lock.json .npmrc && \
    npm install --registry https://registry.npmjs.org

# Copy project files
COPY . .

# Expose port
EXPOSE 5000

# Environment
ENV NODE_ENV=development

# Run command
CMD ["npm", "start"]
