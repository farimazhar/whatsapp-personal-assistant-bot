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
    config.scheduledMessages.forEach(job => {
        cron.schedule(job.time, () => {
            client.sendMessage(job.number, job.message);
            console.log(`Sent to ${job.number}`);
        });
    });
});

client.on('message', async msg => {
    if (msg.from.includes('@g.us')) return;
    if (msg.fromMe) return;
    setTimeout(() => {
        msg.reply(config.autoReplyMessage);
    }, 2000);
});

client.initialize();
