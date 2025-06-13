import twilio from 'twilio';
import cron from 'node-cron';

// Configuration from environment variables (Railway)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_SENDER_NUMBER = process.env.TWILIO_SENDER_NUMBER; // Your Twilio SMS number
const SMS_RECIPIENTS = process.env.SMS_RECIPIENTS;
const TRIP_DATE = process.env.TRIP_DATE;
const TRIP_DESCRIPTION = process.env.TRIP_DESCRIPTION || 'Viaje';
const TZ = process.env.TZ || 'America/Guatemala';

// Track last sent date to prevent multiple executions per day
let lastSentDate = null;

console.log('🚀 Starting SMS Reminder Bot...');
console.log(`📅 Trip date: ${TRIP_DATE}`);

// Validate required environment variables
const requiredVars = {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SENDER_NUMBER,
  SMS_RECIPIENTS,
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
  recipients = JSON.parse(SMS_RECIPIENTS);
  console.log(`👥 Recipients loaded: ${recipients.length}`);
} catch (error) {
  console.error('❌ Error parsing SMS_RECIPIENTS JSON:', error.message);
  process.exit(1);
}

// Initialize Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Function to calculate days remaining
function calculateDaysRemaining() {
  const now = new Date().getTime();
  const tripTime = new Date(TRIP_DATE).getTime();
  const distance = tripTime - now;
  
  if (distance <= 0) return 0;
  return Math.floor(distance / (1000 * 60 * 60 * 24));
}

// Function to send SMS message
async function sendSmsMessage(to, body) {
  try {
    const message = await client.messages.create({
      from: TWILIO_SENDER_NUMBER,
      to: to,
      body: body
    });
    console.log(`✅ SMS sent to ${to} - SID: ${message.sid}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error sending SMS to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Main reminder function
async function sendReminder() {
  // Restore the once-per-day logic
  const today = new Date().toISOString().split('T')[0];
  if (lastSentDate === today) {
    console.log(`📅 SMS for ${today} already sent. Skipping.`);
    return;
  }

  const days = calculateDaysRemaining();
  const frontendUrl = 'https://khrizenriquez.github.io/trip-countdown-reminder';
  const messageBody = `Hola! Faltan ${days} dias para nuestro viaje: ${TRIP_DESCRIPTION}. Ver countdown: ${frontendUrl}`;

  console.log('📨 Sending daily SMS reminders...');
  
  let anySuccessful = false;
  for (const recipient of recipients) {
    const result = await sendSmsMessage(recipient, messageBody);
    if (result.success) {
      anySuccessful = true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay
  }

  // Only lock for the day if at least one message was sent successfully
  if (anySuccessful) {
    lastSentDate = today;
    console.log(`✅ Daily SMS reminders completed for ${today}.`);
  } else {
    console.log('⚠️ No SMS sent successfully. Will retry in the next scheduled execution.');
  }
}

// Schedule daily cron job
console.log('⏰ Setting up daily cron job for 5:55 AM Guatemala...');
cron.schedule('55 5 * * *', () => {
  console.log('⏰ Cron job triggered at 5:55 AM');
  sendReminder();
}, { scheduled: true, timezone: TZ });

console.log('🤖 Bot is running. Daily messages scheduled for 5:55 AM Guatemala time.');
console.log('📝 Press Ctrl+C to stop...'); 