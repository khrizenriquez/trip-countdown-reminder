import configFile from '../../config.json';

// Get configuration from environment variables with fallbacks
const config = {
  trip: {
    // Use environment variable or fallback for development
    date: import.meta.env.PUBLIC_TRIP_DATE || '2025-06-26T09:40:00',
    timezone: import.meta.env.PUBLIC_TRIP_TIMEZONE || 'America/Guatemala',
    description: import.meta.env.PUBLIC_TRIP_DESCRIPTION || 'Viaje'
  },
  messages: configFile.messages,
  frontend: configFile.frontend
};

export default config; 