# Use Node.js Alpine for minimal footprint
FROM node:18-alpine

# Install only dcron (no chromium needed for Twilio)
RUN apk add --no-cache dcron

# Set working directory
WORKDIR /usr/src/app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application code from backend directory
COPY backend/ .

# Copy config.json from root
COPY config.json ./config.json

# Set timezone (can be overridden with environment variable)
ENV TZ=America/Guatemala

# Setup cron job to run at 5:55 AM every day (using Twilio WhatsApp)
RUN echo "55 5 * * * /usr/local/bin/node /usr/src/app/send-whatsapp.js" > /etc/crontabs/root

# Set default environment variables (override when running)
ENV TWILIO_ACCOUNT_SID=""
ENV TWILIO_AUTH_TOKEN=""
ENV TWILIO_WHATSAPP_NUMBER=""
ENV RECIPIENT_PHONE_NUMBERS=""

# Start cron daemon in foreground
CMD ["crond", "-f"] 