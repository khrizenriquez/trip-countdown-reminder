import twilio from 'twilio';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import http from 'http';
import url from 'url';

// Load environment variables
dotenv.config();

// Load shared configuration
const configPath = path.join(process.cwd(), 'config.json');
let config;

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  // Try parent directory if not found (when running from backend folder)
  const parentConfigPath = path.join(process.cwd(), '..', 'config.json');
  try {
    config = JSON.parse(fs.readFileSync(parentConfigPath, 'utf8'));
  } catch (parentError) {
    console.error('Error: No se encontró config.json en el directorio actual ni en el directorio padre');
    console.error('Asegúrate de ejecutar desde la raíz del proyecto o que config.json exista');
    process.exit(1);
  }
}

// Configuration from environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
const TZ_TIMEZONE = process.env.TZ || 'America/Guatemala';

// Trip configuration from environment variables
const TRIP_DATE_ISO = process.env.TRIP_DATE || '2025-06-26T09:40:00';
const TRIP_TIMEZONE = process.env.TRIP_TIMEZONE || 'America/Guatemala';
const TRIP_DESCRIPTION = process.env.TRIP_DESCRIPTION || 'Viaje';
const TRIP_DATE = new Date(TRIP_DATE_ISO).getTime();

// WhatsApp configuration from environment variables
const TEMPLATE_ID = process.env.WHATSAPP_TEMPLATE_ID;
const RECIPIENTS_JSON = process.env.WHATSAPP_RECIPIENTS;

const DEV_MODE = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

// Parse recipients from JSON environment variable
let RECIPIENTS = [];
try {
  if (RECIPIENTS_JSON) {
    RECIPIENTS = JSON.parse(RECIPIENTS_JSON);
  }
} catch (error) {
  console.error('❌ Error parsing WHATSAPP_RECIPIENTS JSON:', error.message);
  process.exit(1);
}

// Validate environment variables
const requiredEnvVars = {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER,
  WHATSAPP_TEMPLATE_ID: TEMPLATE_ID,
  WHATSAPP_RECIPIENTS: RECIPIENTS_JSON,
  TRIP_DATE: TRIP_DATE_ISO
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.error(`Error: ${key} environment variable is required`);
    process.exit(1);
  }
}

if (RECIPIENTS.length === 0) {
  console.error('Error: WHATSAPP_RECIPIENTS must contain at least one recipient');
  console.error('Format: [{"name":"Juan","lastName":"Pérez","phone":"+502123456"}]');
  process.exit(1);
}

// Initialize Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Function to validate phone number format
function validatePhoneNumber(phoneNumber) {
  // Check if phone number starts with + and contains only digits
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

// Function to format phone number for WhatsApp (whatsapp:+number)
function formatWhatsAppNumber(phoneNumber) {
  // Remove any existing whatsapp: prefix
  const cleanNumber = phoneNumber.replace(/^whatsapp:/, '');
  return `whatsapp:${cleanNumber}`;
}

// Function to calculate time difference and generate message
function generateCountdownMessage() {
  const now = new Date().getTime();
  const distance = TRIP_DATE - now;
  
  if (distance <= 0) {
    // Trip date has passed
    return config.messages.safe_travel;
  } else {
    // Calculate remaining time
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return config.messages.countdown.replace('{days}', days);
    } else if (hours > 0) {
      return config.messages.hours.replace('{hours}', hours);
    } else {
      return config.messages.today;
    }
  }
}

// Function to send WhatsApp message to a single recipient
async function sendWhatsAppToRecipient(recipient, days, tripDescription) {
  try {
    if (!validatePhoneNumber(recipient.phone)) {
      throw new Error(`Número de teléfono inválido: ${recipient.phone}. Debe incluir código de país (+502, +1, etc.)`);
    }
    
    const whatsappFrom = formatWhatsAppNumber(TWILIO_WHATSAPP_NUMBER);
    const whatsappTo = formatWhatsAppNumber(recipient.phone);
    
    // Use Twilio template with recipient's personal info
    const templateSid = TEMPLATE_ID;
    const contentVariables = JSON.stringify({
      "1": recipient.name, // nombre del destinatario
      "2": days.toString(), // días restantes
      "3": tripDescription // descripción de la fecha
    });
    
    const messageResponse = await client.messages.create({
      from: whatsappFrom,
      to: whatsappTo,
      contentSid: templateSid,
      contentVariables: contentVariables
    });
    
    console.log(`✅ WhatsApp enviado a ${recipient.name} ${recipient.lastName} (${recipient.phone}) - SID: ${messageResponse.sid}`);
    console.log(`📋 Template usado: ${templateSid}`);
    console.log(`📝 Variables: ${contentVariables}`);
    return { success: true, sid: messageResponse.sid, to: recipient.phone, name: `${recipient.name} ${recipient.lastName}` };
    
  } catch (error) {
    console.error(`❌ Error enviando WhatsApp a ${recipient.name} ${recipient.lastName} (${recipient.phone}):`, error.message);
    return { success: false, error: error.message, to: recipient.phone, name: `${recipient.name} ${recipient.lastName}` };
  }
}

// Function to send WhatsApp to all recipients
async function sendCountdownWhatsApp() {
  const now = new Date().getTime();
  const distance = TRIP_DATE - now;
  
  let days = 0;
  let tripDescription = TRIP_DESCRIPTION;
  
  if (distance <= 0) {
    // Trip date has passed - use a different template or message
    tripDescription = "¡Viaja seguro!";
  } else {
    // Calculate remaining days
    days = Math.floor(distance / (1000 * 60 * 60 * 24));
  }
  
  console.log('💬 Iniciando envío de WhatsApp con template...');
  console.log(`📅 Fecha del viaje: ${TRIP_DESCRIPTION}`);
  console.log(`📊 Días restantes: ${days}`);
  console.log(`👥 Destinatarios: ${RECIPIENTS.length}`);
  console.log('---');
  
  const results = [];
  
  // Send WhatsApp to each recipient using template
  for (const recipient of RECIPIENTS) {
    const result = await sendWhatsAppToRecipient(recipient, days, tripDescription);
    results.push(result);
    
    // Add small delay between sends to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('---');
  console.log('📊 Resumen del envío:');
  console.log(`   ✅ Exitosos: ${successful}`);
  console.log(`   ❌ Fallidos: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Errores encontrados:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`   ${result.name} (${result.to}): ${result.error}`);
    });
  } else if (successful > 0) {
    console.log('\n✅ Mensajes enviados correctamente a:');
    results.filter(r => r.success).forEach(result => {
      console.log(`   ${result.name} (${result.to})`);
    });
  }
  
  return results;
}

// Function to test Twilio WhatsApp configuration
async function testTwilioConfiguration() {
  try {
    console.log('🔧 Verificando configuración de Twilio WhatsApp...');
    
    // For test credentials, skip API calls that don't work
    if (TWILIO_ACCOUNT_SID.startsWith('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')) {
      console.log('🧪 Usando credenciales de TEST - Omitiendo verificaciones de API');
      console.log(`✅ Account SID: ${TWILIO_ACCOUNT_SID.substring(0, 10)}...`);
      console.log(`✅ Auth Token: ${TWILIO_AUTH_TOKEN.substring(0, 6)}...`);
      console.log(`✅ Número WhatsApp configurado: ${TWILIO_WHATSAPP_NUMBER}`);
      console.log(`✅ Destinatarios configurados: ${RECIPIENTS.length}`);
      console.log('💡 Para pruebas: Los destinatarios deben unirse al sandbox primero');
      console.log('💡 Envía "join <codigo>" a +1 415 523 8886 desde WhatsApp');
      
      // Validate WhatsApp number format
      const cleanNumber = TWILIO_WHATSAPP_NUMBER.replace(/^whatsapp:/, '');
      if (!validatePhoneNumber(cleanNumber)) {
        console.log(`⚠️  Formato de número WhatsApp: ${TWILIO_WHATSAPP_NUMBER} (verifica que sea válido)`);
      }
      
      console.log('✅ Configuración básica verificada (modo test)');
      return true;
    } else {
      // Production credentials - full verification
      try {
        const account = await client.api.accounts(TWILIO_ACCOUNT_SID).fetch();
        console.log(`✅ Cuenta Twilio: ${account.friendlyName} (${account.status})`);
        
        const whatsappSenders = await client.messaging.v1.services.list();
        console.log(`✅ Servicios WhatsApp configurados: ${whatsappSenders.length}`);
        
        // Validate WhatsApp number format
        const cleanNumber = TWILIO_WHATSAPP_NUMBER.replace(/^whatsapp:/, '');
        if (!validatePhoneNumber(cleanNumber)) {
          console.log(`⚠️  Formato de número WhatsApp: ${TWILIO_WHATSAPP_NUMBER} (verifica que sea válido)`);
        } else {
          console.log(`✅ Número WhatsApp: ${TWILIO_WHATSAPP_NUMBER}`);
        }
        
        // Validar que las credenciales no sean las de ejemplo
        if (TWILIO_ACCOUNT_SID.startsWith('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')) {
          throw new Error(`
❌ Error: Estás usando credenciales de ejemplo

🔧 Para desarrollo local:
1. cp env.local.example .env
2. Edita .env con tus credenciales REALES de Twilio

🚀 Para producción (Railway):
Ve a tu proyecto → Variables → Agrega tus credenciales REALES

📄 Más info: https://www.twilio.com/console
          `);
        }
        
        console.log('✅ Configuración verificada correctamente');
        return true;
      } catch (error) {
        console.error('❌ Error verificando configuración de producción:', error.message);
        return false;
      }
    }
    
  } catch (error) {
    console.error('❌ Error inesperado verificando configuración:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('authenticate')) {
      console.error('💡 Verifica tu TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN');
    } else if (error.message.includes('WhatsApp')) {
      console.error('💡 Verifica que tu número WhatsApp esté configurado en Twilio');
    }
    
    return false;
  }
}

// Create HTTP server for development API
function createDevServer() {
  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Enable CORS for development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      res.end();
      return;
    }
    
    if (parsedUrl.pathname === '/api/send-whatsapp' && req.method === 'POST') {
      try {
        console.log('📱 API: Recibida solicitud de envío manual');
        const results = await sendCountdownWhatsApp();
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: true,
          message: 'WhatsApp enviado correctamente',
          results: results
        }));
        
      } catch (error) {
        console.error('❌ API: Error enviando WhatsApp:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    } else if (parsedUrl.pathname === '/api/status' && req.method === 'GET') {
      // Status endpoint
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        status: 'running',
        mode: 'development',
        tripDate: TRIP_DATE_ISO,
        recipients: RECIPIENTS.length,
        message: generateCountdownMessage()
      }));
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });
  
  const port = process.env.PORT || 3001;
  server.listen(port, () => {
    console.log(`🌐 Servidor de desarrollo ejecutándose en puerto ${port}`);
    console.log(`📡 API disponible en: http://localhost:${port}/api/send-whatsapp`);
  });
  
  return server;
}

// Main execution
async function main() {
  console.log('🚀 Trip Countdown WhatsApp Bot (Twilio) - Iniciando...');
  console.log('=====================================================');
  
  if (DEV_MODE) {
    console.log('🔧 Modo desarrollo activado');
  }
  
  try {
    // Test configuration first
    const configValid = await testTwilioConfiguration();
    if (!configValid) {
      console.error('❌ Configuración inválida, abortando envío');
      process.exit(1);
    }
    
    console.log('');
    
    // In development mode, start the API server
    if (DEV_MODE) {
      console.log('🌐 Iniciando servidor de desarrollo...');
      createDevServer();
      console.log('✅ Servidor listo. Usa la API para envíos manuales.');
      
      // Keep the process running
      process.on('SIGINT', () => {
        console.log('\n📴 Cerrando servidor de desarrollo...');
        process.exit(0);
      });
      
    } else {
      // Production mode: send once immediately, then setup cron
      console.log('🚀 Modo producción: Enviando mensaje inicial...');
      
      // Send message immediately on deploy
      try {
        await sendCountdownWhatsApp();
        console.log('✅ Mensaje inicial enviado correctamente');
      } catch (error) {
        console.error('❌ Error en envío inicial:', error.message);
      }
      
      console.log('');
      console.log('⏰ Configurando cron job para envíos diarios...');
      console.log('📅 Programado para ejecutarse diariamente a las 5:55 AM (Guatemala)');
      
      // Import cron for scheduling
      const cron = await import('node-cron');
      
      // Schedule job to run daily at 5:55 AM Guatemala time (America/Guatemala)
      cron.default.schedule('55 5 * * *', async () => {
        console.log('\n⏰ Ejecutando envío programado...');
        console.log(`📅 ${new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala' })}`);
        
        try {
          await sendCountdownWhatsApp();
          console.log('✅ Envío programado completado exitosamente\n');
        } catch (error) {
          console.error('❌ Error en envío programado:', error.message);
        }
      }, {
        scheduled: true,
        timezone: "America/Guatemala"
      });
      
      console.log('✅ Cron job configurado correctamente');
      console.log('💡 El bot enviará mensajes diariamente a las 5:55 AM');
      console.log('🔄 Proceso activo, esperando próxima ejecución programada...\n');
    }
    
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Recibida señal de terminación, cerrando...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Recibida señal de interrupción, cerrando...');
  process.exit(0);
});

// Execute main function
main(); 