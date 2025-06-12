import twilio from 'twilio';
import cron from 'node-cron';

// Configuration from environment variables (Railway)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
const WHATSAPP_TEMPLATE_ID = process.env.WHATSAPP_TEMPLATE_ID;
const WHATSAPP_RECIPIENTS = process.env.WHATSAPP_RECIPIENTS;
const TRIP_DATE = process.env.TRIP_DATE;
const TRIP_DESCRIPTION = process.env.TRIP_DESCRIPTION || 'Viaje';
const TZ = process.env.TZ || 'America/Guatemala';

// Track last sent date to prevent multiple executions per day
let lastSentDate = null;

console.log('🚀 Starting WhatsApp bot...');
console.log(`📅 Trip date: ${TRIP_DATE}`);
console.log(`🌎 Timezone: ${TZ}`);
console.log(`📝 Description: ${TRIP_DESCRIPTION}`);

// Validate required environment variables
const requiredVars = {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER,
  WHATSAPP_TEMPLATE_ID,
  WHATSAPP_RECIPIENTS,
  TRIP_DATE
};

for (const [key, value] of Object.entries(requiredVars)) {
  if (!value) {
    console.error(`❌ Error: ${key} environment variable is required`);
    process.exit(1);
  }
}

// Parse recipients from JSON
let recipients = [];
try {
  recipients = JSON.parse(WHATSAPP_RECIPIENTS);
  console.log(`👥 Recipients loaded: ${recipients.length}`);
} catch (error) {
  console.error('❌ Error parsing WHATSAPP_RECIPIENTS JSON:', error.message);
  console.error('Expected format: ["whatsapp:+502123456","whatsapp:+502789012"]');
  process.exit(1);
}

// Initialize Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Function to send WhatsApp message
async function sendWhatsAppMessage(to, name, days, description) {
  try {
    // Frontend URL
    const frontendUrl = 'https://khrizenriquez.github.io/trip-countdown-reminder';
    const descriptionWithUrl = `${description}\n\n🔗 Ver cuenta regresiva: ${frontendUrl}`;
    
    const contentVariables = JSON.stringify({
      "1": name,
      "2": days.toString(),
      "3": descriptionWithUrl
    });
    
    const message = await client.messages.create({
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      to: to,
      contentSid: WHATSAPP_TEMPLATE_ID,
      contentVariables: contentVariables
    });
    
    console.log(`✅ Message sent to ${to} - SID: ${message.sid}`);
    return { success: true, sid: message.sid };
    
  } catch (error) {
    console.error(`❌ Error sending to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Function to calculate days remaining
function calculateDaysRemaining() {
  const now = new Date().getTime();
  const tripTime = new Date(TRIP_DATE).getTime();
  const distance = tripTime - now;
  
  if (distance <= 0) {
    return 0; // Trip has passed
  }
  
  return Math.floor(distance / (1000 * 60 * 60 * 24));
}

// Main reminder function
async function sendReminderMessage() {
  // Check if we already sent messages today
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  if (lastSentDate === today) {
    console.log(`📅 Messages already sent today (${today}). Skipping execution.`);
    return;
  }
  
  const days = calculateDaysRemaining();
  
  console.log('📨 Sending daily reminders...');
  console.log(`📅 Today: ${today}`);
  console.log(`📊 Days remaining: ${days}`);
  
  if (days === 0) {
    console.log('✈️ Trip day! Sending safe travel message...');
  }
  
  const results = [];
  let anySuccessful = false;
  
  for (const recipient of recipients) {
    let name, phoneNumber;
    
    // Handle both string and object formats
    if (typeof recipient === 'string') {
      // Format: "whatsapp:+502123456"
      phoneNumber = recipient;
      name = recipient.replace('whatsapp:+502', '').slice(0, 4) || 'Amigo';
    } else if (typeof recipient === 'object' && recipient.phone) {
      // Format: {"name":"Chris","phone":"+50254775800"}
      phoneNumber = recipient.phone;
      name = recipient.name || 'Amigo';
    } else {
      console.error(`❌ Invalid recipient format:`, recipient);
      continue;
    }
    
    // Ensure phone number has whatsapp: prefix for Twilio
    if (!phoneNumber.startsWith('whatsapp:')) {
      phoneNumber = `whatsapp:${phoneNumber}`;
    }
    
    console.log(`📱 Sending to: ${name} (${phoneNumber})`);
    
    const result = await sendWhatsAppMessage(
      phoneNumber,
      name,
      days,
      TRIP_DESCRIPTION
    );
    
    results.push(result);
    
    // Track if any message was successful
    if (result.success) {
      anySuccessful = true;
    }
    
    // Small delay between messages
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`📊 Summary: ${successful} sent, ${failed} failed`);
  
  // Only update lastSentDate if at least one message was successful
  // This prevents marking the day as "sent" when hitting daily limits
  if (anySuccessful) {
    lastSentDate = today;
    console.log(`✅ Daily messages completed for ${today}`);
  } else {
    console.log(`⚠️ No messages sent successfully. Will retry in next execution.`);
  }
}

// Send immediate message on deploy (for testing)
// COMMENTED OUT to avoid wasting daily message limits
// console.log('🧪 Sending immediate test message...');
// sendReminderMessage().then(() => {
//   console.log('✅ Test message completed');
// }).catch(error => {
//   console.error('❌ Test message failed:', error);
// });

console.log('🧪 Immediate test message disabled to preserve daily limits');

// Schedule daily cron job at 12:30 PM Guatemala time (GMT-6)
console.log('⏰ Setting up daily cron job (12:30 PM Guatemala)...');
cron.schedule('30 12 * * *', () => {
  console.log('⏰ Cron job triggered at 12:30 PM');
  sendReminderMessage();
}, {
  scheduled: true,
  timezone: TZ
});

console.log('🤖 Bot is running. Daily messages scheduled for 12:30 PM Guatemala time.');
console.log('📝 Press Ctrl+C to stop...'); 