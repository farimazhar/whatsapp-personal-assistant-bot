const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const config = require('./config.json');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox'] }
});

client.on('qr', qr => qrcode.generate(qr, {small: true}));
client.on('ready', () => {
    console.log('✅ Bot Ready!');
    
    // Scheduled messages lagao config se
    config.scheduledMessages.forEach(job => {
        cron.schedule(job.time, () => {
            client.sendMessage(job.number, job.message);
            console.log(`Scheduled message sent to ${job.number}`);
        });
    });
});

client.on('message', async msg => {
    if(msg.fromMe || !config.autoReplyEnabled) return;

    const text = msg.body.toLowerCase();
    const hasBusyKeyword = config.autoReplies.busyKeywords.some(k => text.includes(k));

    if(hasBusyKeyword){
        await msg.reply(config.autoReplies.busyReply);
    } else {
        await msg.reply(config.autoReplies.default);
    }
});

client.initialize();
