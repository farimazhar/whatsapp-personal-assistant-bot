const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const config = require('./config.json');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox'] }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
    console.log('QR Ready, scan karo!');
});

client.on('ready', () => {
    console.log('✅ Bot Ready!');
    
    // Scheduled messages
    config.scheduledMessages.forEach(job => {
        cron.schedule(job.time, () => {
            client.sendMessage(job.number, job.message);
            console.log(`Scheduled message sent to ${job.number}`);
        });
    });
});

// Auto-reply jab koi message bheje
client.on('message', async msg => {
    if (msg.from.includes('@g.us')) return; // group ignore
    if (msg.fromMe) return;
    
    // Thori dair baad reply
    setTimeout(() => {
        msg.reply(config.autoReplyMessage);
    }, 2000);
});

client.initialize();
