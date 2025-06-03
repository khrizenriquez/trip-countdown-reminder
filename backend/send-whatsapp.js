import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const WHATSAPP_GROUP_ID = process.env.WHATSAPP_GROUP_ID;
const TRIP_DATE = new Date('2024-12-25T00:00:00').getTime(); // Modify this date as needed

// Validate environment variables
if (!WHATSAPP_GROUP_ID) {
  console.error('Error: WHATSAPP_GROUP_ID environment variable is required');
  process.exit(1);
}

// Initialize WhatsApp client with LocalAuth to persist session
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './session'
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Generate QR code for first-time authentication
client.on('qr', (qr) => {
  console.log('Escanea este código QR con WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// Client ready event
client.on('ready', async () => {
  console.log('Cliente de WhatsApp conectado exitosamente');
  
  try {
    await sendCountdownMessage();
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
  } finally {
    await client.destroy();
    process.exit(0);
  }
});

// Authentication success
client.on('authenticated', () => {
  console.log('Autenticación exitosa');
});

// Authentication failure
client.on('auth_failure', () => {
  console.error('Error de autenticación');
  process.exit(1);
});

// Client disconnected
client.on('disconnected', (reason) => {
  console.log('Cliente desconectado:', reason);
});

// Function to calculate time difference and send message
async function sendCountdownMessage() {
  const now = new Date().getTime();
  const distance = TRIP_DATE - now;
  
  let message;
  
  if (distance <= 0) {
    // Trip date has passed
    message = '¡Viaja seguro! 🎉✈️';
  } else {
    // Calculate remaining time
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      message = `¡Faltan ${days} días para el viaje! 🗓️✈️`;
    } else if (hours > 0) {
      message = `¡Faltan ${hours} horas para el viaje! ⏰✈️`;
    } else {
      message = '¡El viaje es hoy! 🎉✈️';
    }
  }
  
  try {
    await client.sendMessage(WHATSAPP_GROUP_ID, message);
    console.log(`Mensaje enviado: ${message}`);
  } catch (error) {
    console.error('Error al enviar mensaje a WhatsApp:', error);
    throw error;
  }
}

// Error handling
client.on('error', (error) => {
  console.error('Error del cliente WhatsApp:', error);
});

// Initialize client
console.log('Iniciando cliente de WhatsApp...');
client.initialize(); 