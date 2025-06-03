# Use Node.js Alpine for minimal footprint
FROM node:18-alpine

# Install busybox-cron for cron jobs
RUN apk add --no-cache busybox-cron

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create session directory for WhatsApp auth persistence
RUN mkdir -p session

# Set timezone (can be overridden with environment variable)
ENV TZ=America/Guatemala

# Setup cron job to run at 5:55 AM every day
RUN echo "55 5 * * * /usr/local/bin/node /usr/src/app/send-whatsapp.js" > /etc/crontabs/root

# Set environment variables
ENV WHATSAPP_GROUP_ID=""

# Start cron daemon in foreground
CMD ["crond", "-f"] 