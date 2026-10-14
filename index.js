const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config.json');
const startScheduler = require('./scheduler');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ Bot is Ready!');
    startScheduler(client);
});

client.on('message', async msg => {
    if (msg.from.includes('@g.us') || msg.fromMe) return;
    if (!config.autoReplyEnabled) return;

    let replyMessage = config.autoReplies.default;
    const lowerBody = msg.body.toLowerCase();

    if (config.autoReplies.busyKeywords.some(k => lowerBody.includes(k))) {
        replyMessage = config.autoReplies.busyReply;
    }

    await msg.reply(replyMessage);
});

client.initialize();
