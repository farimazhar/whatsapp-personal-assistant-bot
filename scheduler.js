const cron = require('node-cron');
const config = require('./config.json');

function startScheduler(client) {
  config.scheduledMessages.forEach(job => {
    cron.schedule(job.time, async () => {
      try {
        await client.sendMessage(job.number, job.message);
        console.log(`Scheduled message sent to ${job.number}`);
      } catch (e) {
        console.log("Scheduler error:", e.message);
      }
    });
  });
}

module.exports = startScheduler;
